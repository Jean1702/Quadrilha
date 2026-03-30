'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

export default function PagamentoPage() {

    const pagamento = {
        codigoPedido: "55958859",
        Barraca: "3° Informática",
        status: "Aguardando pagamento",
        itens: [
            { id: 1, nome: "Patel", valor: 23.00, quantidade: 1 },
            { id: 3, nome: "Caldo de frango", valor: 10.00, quantidade: 1 },
        ],
        chavePix: "yssa62250521mpqrinter150036319381630475C6",
        tempoRestante: 5 * 60,
    };

    const copiarChavePix = () => {
        navigator.clipboard.writeText(pagamento.chavePix);
        alert("Chave Pix copiada!");
    };

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
        <div className="flex justify-center items-center min-h-screen relative overflow-hidden bg-bege">

            {/* Fundo decorativo */}
            <div className="absolute size-100 sm:size-150 bg-laranja rounded-full blur-3xl opacity-20 -top-40 -left-40 animate-pulse"></div>
            <div className="absolute size-95 sm:size-125 bg-terracotta rounded-full blur-3xl opacity-20 -bottom-40 -right-40 animate-pulse"></div>

            {/* Card */}
            <div className="w-95 max-w-md bg-white rounded-xl shadow-xl p-6 border border-bege">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-marrom">Pagamento</h1>
                    <p className="text-md text-marrom/80">
                        Complete o pagamento para finalizar seu pedido.
                    </p>
                </div>

                {/* QR Code com moldura */}
                <div className="flex justify-center mb-6">
                    <div className="relative p-4              rounded-lg">

                        {/* QR */}
                        <QRCode value={`pix:${pagamento.chavePix}`} size={150} />

                        {/* Cantos */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#514442] rounded-tl-lg"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#514442] rounded-tr-lg"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#514442] rounded-bl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#514442] rounded-br-lg"></div>

                    </div>
                </div>

                {/* Pix */}
                <div className="mb-6 text-center">
                    <p className="font-semibold text-marrom">Código Pix:</p>
                    <p className="text-sm text-marrom/80 break-all">{pagamento.chavePix}</p>

                    <button
                        onClick={copiarChavePix}
                        className="mt-2 px-4 py-2 bg-[#514442] text-white rounded-full hover:bg-[#3f3533] transition"
                    >
                        Copiar Código Pix
                    </button>
                </div>

                {/* Tempo */}
                <div className="text-center mb-6">
                    <p className="font-semibold text-marrom">Tempo restante:</p>
                    <p className="text-2xl font-bold text-verde">
                        {`${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`}
                    </p>
                </div>

                {/* Pedido */}
<div className="bg-bege/60 p-4 rounded-lg mb-4 border-l-4 border-laranja">
                    <p className="font-semibold text-marrom">
                        PEDIDO #{pagamento.codigoPedido}
                    </p>
                    <p className="text-sm text-marrom/70">{pagamento.Barraca}</p>
                </div>

                {/* Itens */}
                <div className="bg-bege/60 p-4 rounded-lg">
                    <h3 className="font-semibold text-marrom mb-2">Itens:</h3>

                    {pagamento.itens.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm text-marrom/80 mt-1">
                            <p>{item.nome}</p>
                            <p>R$ {item.valor.toFixed(2)}</p>
                        </div>
                    ))}

                    {/* Total */}
                    <div className="flex justify-between font-bold text-lg text-terracotta mt-4 border-t pt-2">
                        <p>Total</p>
                        <p>
                            R$ {pagamento.itens.reduce((acc, item) => acc + item.valor, 0).toFixed(2)}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}