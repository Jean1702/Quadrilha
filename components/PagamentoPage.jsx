'use client';  // Diretriz para informar que este é um Client Component

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

export default function PagamentoPage() {
    // Dados do pagamento
    const pagamento = {
        codigoPedido: "55958859",
        Barraca: "3° Informática",
        status: "Aguardando pagamento",
        itens: [
            {
                id: 1,
                nome: "Patel",
                valor: 23.00,
                quantidade: 1,
            },
            {
                id: 3,
                nome: "Caldo de frango",
                valor: 10.00,
                quantidade: 1,
            },
        ],
        chavePix: "yssa62250521mpqrinter150036319381630475C6",
        tempoRestante: 5 * 60,
    };

    // Função para copiar a chave Pix para a área de transferência
    const copiarChavePix = () => {
        navigator.clipboard.writeText(pagamento.chavePix);
        alert("Chave Pix copiada!");
    };

    // Contagem regressiva
    const [tempo, setTempo] = useState(pagamento.tempoRestante);

    useEffect(() => {
        if (tempo > 0) {
            const timer = setInterval(() => {
                setTempo(tempo - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [tempo]);

    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    return (


        
        <div className="flex justify-center items-center min-h-screen relative overflow-hidden ">

            
            <div className="w-95 max-w-md bg-[var(--surface)] rounded-[4px] shadow-xl p-6">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold ">Pagamento</h1>
                    <p className="text-lg ">Complete o pagamento para finalizar seu pedido.</p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                    <QRCode value={`pix:${pagamento.chavePix}`} size={156} />
                </div>

                {/* Chave Pix */}
                <div className="mb-6 text-center">
                    <p className="font-semibold ">Código Pix:</p>
                    <p className="text-lg  break-all">{pagamento.chavePix}</p>
                    <button
                        onClick={copiarChavePix}
                        className="mt-2 px-4 py-2 bg-card text-white rounded-full hover:bg-card/70 focus:outline-none"
                    >
                        Copiar Código Pix
                    </button>
                </div>

                {/* Tempo restante para pagamento */}
                <div className="text-center mb-6">
                    <p className="font-semibold ">Tempo restante para pagamento:</p>
                    <p className="text-xl ">{`${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`}</p>
                </div>

                {/* Detalhes do pedido */}
                <div className="bg-[var(--bg)] p-4 rounded-lg shadow-md mb-6">
                    <p className="font-semibold text-lg ">PEDIDO #{pagamento.codigoPedido}</p>
                    <p className="text-sm ">{pagamento.Barraca}</p>
                </div>

                {/* Itens do pedido */}
                <div className="bg-[var(--bg)] p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg ">Itens:</h3>
                    {pagamento.itens.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm ">
                            <p>{item.nome}</p>
                            <p>R$ {item.valor.toFixed(2)}</p>
                        </div>
                    ))}

                    {/* Cálculo do total */}
                    <div className="flex justify-between font-semibold text-lg  mt-4">
                        <p>Total</p>
                        <p>R$ {(pagamento.itens.reduce((acc, item) => acc + item.valor, 0)).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}