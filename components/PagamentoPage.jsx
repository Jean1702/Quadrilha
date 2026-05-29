'use client';

import { useState, useEffect, Suspense, useContext, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { CartContext } from '@/context/CartContext';
import { CreateClient } from '../lib/supabase/client';

const supabaseFront = CreateClient();

function PaymentContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { carrinho, limparCarrinho } = useContext(CartContext);

    const codigoPedido = searchParams.get('pedidoId') || "000000";
    const chavePix = searchParams.get('qrCode') || "";
    const totalPedido = Number(searchParams.get('total') || 0);

    const [tempo, setTempo] = useState(5 * 60);
    const [statusPedido, setStatusPedido] = useState("Aguardando pagamento");

    // useRef para evitar que loops recriem funções do useEffect desnecessariamente
    const redirecionando = useRef(false);

    // 1. Limpa o carrinho logo na entrada
    useEffect(() => {
        if (carrinho && carrinho.length > 0) {
            limparCarrinho();
        }
    }, [carrinho, limparCarrinho]);

    // 2. Timer regressivo
    useEffect(() => {
        if (tempo <= 0 || statusPedido !== "Aguardando pagamento") return;

        const timer = setInterval(() => {
            setTempo(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [statusPedido, tempo]);

    // 3. Monitoramento em Tempo Real + Fallback Inteligente
    useEffect(() => {
        if (!codigoPedido || codigoPedido === "000000") return;

        // Função interna para mudar o status e redirecionar o usuário
        const confirmarEIrParaPerfil = () => {
            if (redirecionando.current) return;
            redirecionando.current = true;

            setStatusPedido("Pagamento Confirmado!");

            setTimeout(() => {
                router.push('/user');
            }, 2000);
        };

        // Função de checagem no banco de dados (usada no mount e no polling)
        const checarStatusBanco = async () => {
            console.log(`[FRONTEND] Verificando banco para o ID MP: ${codigoPedido}`);
            const { data, error } = await supabaseFront
                .from('venda')
                .select('status')
                .eq('mp_payment_id', codigoPedido)
                .maybeSingle();

            // 🔍 LOG CRÍTICO: Vamos ver exatamente o que o Supabase está cuspindo
            console.log("[DEBUG POLING]", { data, error });

            if (error) {
                console.error("[FRONTEND] Erro ao consultar venda:", error.message);
                return;
            }

            if (data) {
                console.log(`[FRONTEND] Status atual no banco: ${data.status}`);
                if (data.status === 'pago' || data.status === 'approved') {
                    console.log("[FRONTEND] Pagamento detectado via consulta direta!");
                    confirmarEIrParaPerfil();
                }
            } else {
                console.warn("[FRONTEND] NENHUM registro encontrado para esse ID MP. O RLS pode estar bloqueando.");
            }
        };
        // CHECAGEM IMEDIATA: Não espera os 4 segundos do intervalo se o webhook já tiver rodado
        checarStatusBanco();

        // Configuração do Canal Realtime
        const canalRealtime = supabaseFront
            .channel(`venda_status_${codigoPedido}`)
            .on(
                'postgres_changes',
                { event: 'UPDATE', filter: `mp_payment_id=eq.${codigoPedido}`, schema: 'public', table: 'venda' },
                (payload) => {
                    console.log("[FRONTEND] Atualização recebida via Realtime:", payload);
                    const novoStatus = payload.new.status;
                    if (novoStatus === 'pago' || novoStatus === 'approved') {
                        confirmarEIrParaPerfil();
                    }
                }
            )
            .subscribe((status) => {
                console.log(`[FRONTEND] Status da inscrição Realtime: ${status}`);
            });

        // Configuração do Intervalo de Fallback (A cada 4 segundos)
        const intervaloFallback = setInterval(() => {
            if (!redirecionando.current) {
                checarStatusBanco();
            }
        }, 4000);

        return () => {
            clearInterval(intervaloFallback);
            supabaseFront.removeChannel(canalRealtime);
        };
    }, [codigoPedido, router]);

    const copiarChavePix = () => {
        if (!chavePix) return;
        navigator.clipboard.writeText(chavePix);
        alert("Código Pix copiado!");
    };

    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    return (
        <div className="flex justify-center items-center min-h-screen relative overflow-hidden bg-gray-50">
            <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 border border-gray-100">

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {statusPedido === "Pagamento Confirmado!" ? "🎉 Sucesso!" : "Pagamento Pix"}
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        {statusPedido === "Pagamento Confirmado!"
                            ? "Seu pagamento foi recebido e processado!"
                            : "Escaneie o QR Code ou copie o código abaixo para pagar."}
                    </p>
                </div>

                {statusPedido === "Aguardando pagamento" && chavePix ? (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="relative p-4 rounded-lg bg-white border-2 border-dashed border-gray-200">
                                <QRCode value={chavePix} size={180} />
                            </div>
                        </div>

                        <div className="mb-6 text-center">
                            <p className="font-semibold text-gray-700 text-sm">Código Pix (Copia e Cola):</p>
                            <p className="text-xs break-all bg-gray-100 p-3 rounded-lg mt-1 select-all font-mono text-gray-600 max-h-20 overflow-y-auto">
                                {chavePix}
                            </p>
                            <button
                                onClick={copiarChavePix}
                                className="mt-3 px-6 py-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all font-medium text-sm w-full shadow-md cursor-pointer"
                            >
                                Copiar Código Pix
                            </button>
                        </div>

                        <div className="text-center mb-6 bg-gray-50 py-2 rounded-lg">
                            <p className="text-xs text-gray-500 font-medium">Tempo restante para pagar:</p>
                            <p className="text-xl font-bold font-mono text-gray-700 mt-0.5">
                                {tempo > 0
                                    ? `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`
                                    : "Código expirado"}
                            </p>
                        </div>
                    </>
                ) : (
                    statusPedido === "Pagamento Confirmado!" && (
                        <div className="flex flex-col items-center justify-center p-6 my-4 bg-green-50 rounded-xl text-green-700 border border-green-200">
                            <svg className="w-16 h-16 mb-2 text-green-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="font-bold text-lg">Processando pedido na cozinha...</span>
                        </div>
                    )
                )}

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                    <p className="font-semibold text-sm text-gray-700">IDENTIFICAÇÃO DO PAGAMENTO</p>
                    <p className="text-xs text-gray-500 mt-1 font-mono break-all">ID: {codigoPedido}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Status: <span className="font-medium text-orange-600">{statusPedido}</span></p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <div className="flex justify-between font-bold text-gray-800">
                        <p>Total do Pedido</p>
                        <p className="text-orange-600">R$ {totalPedido.toFixed(2)}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function PagamentoPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-sm text-gray-500 font-medium">Carregando dados de pagamento...</p>
                </div>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}