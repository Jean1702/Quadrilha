'use client'
import { Trash2 } from "lucide-react"
import { useState, useContext } from 'react';
import Link from "next/link";
import { CartContext } from "@/context/CartContext";
import { ProductContext } from '@/context/ProductContext';

export default function Cart() {

    const { carrinho, removerDoCarrinho } = useContext(CartContext);
    const { imagensGlobais } = useContext(ProductContext);

    const totalAmount = carrinho.reduce((acc, item) => {
        return acc + item.subtotal;
    }, 0);


    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pt-8 pb-32 px-4 sm:pt-12 font-sans">
            <div className="container max-w-lg mx-auto">
                <div className="flex-center">
                    <h1 className="text-4xl font-black uppercase tracking-tight mb-8 pl-2">
                        Carrinho
                    </h1>
                </div>

                <div className="flex flex-col gap-6">

                    {carrinho.map((item) => {
                        // Busca a foto do produto cruzando os IDs
                        const imagemProduto = imagensGlobais.find(img => String(img.idproduto) === String(item.produto.idproduto))?.url_imagem || '/placeholder.png';

                        return (
                            <div key={item.idItemCarrinho} className="flex flex-col p-5 border-[1.5px] border-[#514442]/15 rounded-[32px] shadow-sm bg-[var(--surface)]">

                                {/* Imagem (Altura Controlada) */}
                                <div className="w-full h-40 sm:h-48 flex justify-center items-center mb-4">
                                    <img
                                        src={imagemProduto}
                                        alt={item.produto.nome}
                                        className="h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <div className="flex justify-between items-start mb-2 gap-2">
                                    <div className="flex flex-col">
                                        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight ">
                                            {item.produto.nome}
                                        </h2>
                                        {/* Mostra a observação se ela existir */}
                                        {item.observacao && (
                                            <p className="text-sm opacity-60 italic mt-1 font-medium">
                                                Obs: {item.observacao}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => removerDoCarrinho(item.idItemCarrinho)}
                                        className=" hover:text-[#D95032] transition-colors p-1 cursor-pointer shrink-0 mt-0.5"
                                        title="Remover item"
                                    >
                                        <Trash2 size={22} strokeWidth={2.5} />
                                    </button>
                                </div>

                                <div className="flex items-end justify-between mt-auto pt-2">
                                    <div>
                                        <p className="text-[11px] sm:text-xs uppercase font-bold tracking-wider mb-1">
                                            Subtotal
                                        </p>
                                        <p className="text-2xl sm:text-3xl font-black text-card leading-none">
                                            R$ {item.subtotal.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Design de Quantidade (Estilo Pílula - Fixo) */}
                                    <div className="flex items-center justify-center bg-[var(--bg)] rounded-full px-5 py-2 shadow-sm border border-[#514442]/10">
                                        <span className="font-black text-sm uppercase tracking-widest opacity-80">
                                            Qtd: {item.quantidade}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {carrinho.length > 0 ? (
                            <div className="flex flex-col gap-6 p-6 sm:p-8 border-[1.5px] border-[#514442]/15 bg-white/20 rounded-[40px] shadow-sm mt-2">
                                <div className="flex justify-between items-end border-b border-text pb-4">
                                    <span className="text-lg sm:text-xl font-bold uppercase tracking-wide ">
                                        Total
                                    </span>
                                    <span className="text-3xl sm:text-4xl font-black text-card">
                                        R$ {totalAmount.toFixed(2)}
                                    </span>
                                </div>

                                <Link href={'/method_payment'}>
                                    <button className="w-full bg-[var(--bg)] hover:bg-[#D95032] text-lg sm:text-xl font-black uppercase py-5 rounded-full active:scale-95 transition-all shadow-md cursor-pointer">
                                        Pagar Agora
                                    </button>
                                </Link>
                            </div>
                    ) : (
                        <div className="flex-center flex-col h-full p-10 border-[1.5px] border-[#514442]/15 bg-[var(--surface)] shadow-sm rounded-[40px] text-center mt-2">
                            <p className="text-xl font-black uppercase mb-2 ">Seu carrinho está vazio</p>
                            <p className="opacity-70 mb-6">Explore o nosso menu e adicione os seus favoritos.</p>
                            <Link href="/">
                                <button className="bg-[var(--bg)] px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-[#D95032] transition-colors shadow-sm">
                                    Ver Menu
                                </button>
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}