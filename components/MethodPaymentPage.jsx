"use client";

import React, { useState, useContext, useEffect, useRef } from 'react';
import { ShoppingBasket, AlertTriangle } from 'lucide-react';
import { CartContext } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export default function MethodPaymentPage() {
    const { carrinho, limparCarrinho } = useContext(CartContext);
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSdkLoaded, setIsSdkLoaded] = useState(false);

    const brickBuilderRef = useRef(null);
    const total = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

    useEffect(() => {
        // Redireciona se o carrinho esvaziar
        if (carrinho.length === 0) {
            router.push('/');
        }
    }, [carrinho, router]);

    // Inicializa o Payment Brick assim que o Script do MP carregar na janela
    useEffect(() => {
        if (!isSdkLoaded || carrinho.length === 0 || brickBuilderRef.current) return;

        let timer;

        const inicializarBrick = () => {
            // Damos um micro-atraso de 100ms para garantir que o Next.js já montou o HTML na tela
            timer = setTimeout(async () => {
                const container = document.getElementById('paymentBrick_container');

                // Trava de segurança: Se o container não existir na tela, cancela para não quebrar o código
                if (!container) {
                    console.warn("[Checkout Bricks] Container 'paymentBrick_container' ainda não está pronto no DOM. Retentando...");
                    return;
                }

                try {
                    const mp = new window.MercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY, {
                        locale: 'pt-BR'
                    });

                    const bricksBuilder = mp.bricks();
                    brickBuilderRef.current = bricksBuilder;

                    const settings = {
                        initialization: {
                            amount: total,
                            payer: {
                                entityType: 'individual' // Mantém a correção para CPF
                            },
                        },
                        customization: {
                            visual: {
                                style: {
                                    theme: 'default', // 'default' | 'dark' | 'bootstrap' | 'flat'
                                }
                            },
                            // ✅ ESTRUTURA CORRETA PARA O PAYMENT BRICK V2:
                            paymentMethods: {
                                creditCard: 'all',
                                debitCard: 'all',
                                bankTransfer: 'all', // 👈 Isso ativa o Pix nativo sem quebrar o componente
                                maxInstallments: 12
                            },
                        },
                        callbacks: {
                            onReady: () => {
                                console.log("Payment Brick pronto para uso.");
                            },
                            onSubmit: async ({ selectedPaymentMethod, formData }) => {
                                setIsLoading(true);
                                setErrorMessage('');

                                try {
                                    const response = await fetch('/api/chckoutF', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ formData, carrinho })
                                    });

                                    const data = await response.json();

                                    if (!response.ok) {
                                        throw new Error(data.error || "Houve uma falha ao registrar o seu pagamento.");
                                    }

                                    if (data.paymentMethod === 'pix') {
                                        router.push(`/payment?pedidoId=${data.pedidoId}&qrCode=${encodeURIComponent(data.qrCode)}&total=${data.total}`);
                                    } else {
                                        router.push('/user');
                                    }
                                } catch (error) {
                                    console.error("Erro no processamento:", error);
                                    setErrorMessage(error.message);
                                } finally {
                                    setIsLoading(false);
                                }
                            },
                            onError: (error) => {
                                console.error("Erro interno no widget do Brick:", error);
                                setErrorMessage("Falha ao inicializar o gateway de pagamento.");
                            },
                        },
                    };

                    await bricksBuilder.create('payment', 'paymentBrick_container', settings);
                } catch (err) {
                    console.error("Erro ao renderizar o elemento de pagamentos:", err);
                }
            }, 100); // 100 milissegundos são suficientes para estabilizar o Next.js
        };

        inicializarBrick();

        // Limpa o Brick da memória e os timers pendentes
        return () => {
            if (timer) clearTimeout(timer);
            if (brickBuilderRef.current) {
                const container = document.getElementById('paymentBrick_container');
                if (container) container.innerHTML = '';
                brickBuilderRef.current = null;
            }
        };
    }, [isSdkLoaded, carrinho, total, router, limparCarrinho]);

    if (carrinho.length === 0) return null;

    return (
        <main className="max-w-4xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-5 gap-8 mt-2">
            {/* Carrega o Script Oficial de forma assíncrona no Next.js */}
            <Script
                src="https://sdk.mercadopago.com/js/v2"
                strategy="afterInteractive"
                onLoad={() => setIsSdkLoaded(true)}
            />

            {/* Listagem Lateral dos Produtos */}
            <div className="lg:col-span-3 space-y-4">
                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-orange-500 p-2 rounded-lg">
                            <ShoppingBasket className="text-white" size={20} />
                        </div>
                        <h2 className="font-bold text-gray-900 text-xl tracking-tight">Itens do carrinho</h2>
                    </div>

                    <div className="space-y-6">
                        {carrinho.map((item) => (
                            <div key={item.idItemCarrinho} className="flex justify-between items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-800 font-bold text-sm bg-gray-50 px-2 py-0.5 rounded-lg shrink-0">
                                            {item.quantidade}x
                                        </span>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold text-gray-900 leading-tight">{item.produto.nome}</p>
                                            {item.observacao && (
                                                <span className="text-[11px] text-gray-400 italic mt-0.5">Obs: {item.observacao}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-600 shrink-0">
                                    R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Container onde o Checkout Brick será injetado pelo SDK */}
            <div className="lg:col-span-2">
                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-8">
                    <h2 className="text-lg font-extrabold mb-4 text-gray-900">Forma de Pagamento</h2>

                    {errorMessage && (
                        <div className="flex items-start gap-2 mb-5 p-4 bg-red-100 border border-red-200 rounded-2xl text-red-700">
                            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                            <p className="text-sm font-semibold leading-snug">{errorMessage}</p>
                        </div>
                    )}

                    {/* Alerta de Carregamento Prévio */}
                    {!isSdkLoaded && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-2">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs text-gray-400">Carregando canais de pagamento seguro...</p>
                        </div>
                    )}

                    {/* O Mercado Pago vai construir o formulário inteiro e o botão de envio dentro desta div */}
                    <div id="paymentBrick_container" className={isLoading ? "pointer-events-none opacity-50" : ""}></div>
                </section>
            </div>
        </main>
    );
}