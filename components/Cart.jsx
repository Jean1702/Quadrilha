'use client'
import { Minus, Plus, Trash2 } from "lucide-react"
import { useState } from 'react';

const initialProducts = [
    { id: 1, nome: 'Clássico Burger', url: 'hamburguer.png', preco: 39.90 },
    { id: 2, nome: 'Bacon Blast', url: 'hamburguer2.png', preco: 45.90 },
    { id: 3, nome: 'Double Cheese Trufado', url: 'hamburguer3.png', preco: 52.00 }
];

export default function Cart() {
    const [cartItems, setCartItems] = useState(initialProducts);
    const [quantities, setQuantities] = useState({ 1: 1, 2: 1, 3: 1 });

    const handleIncrease = (id) => {
        setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const handleDecrease = (id) => {
        setQuantities(prev => ({
            ...prev,
            [id]: prev[id] > 1 ? prev[id] - 1 : 1
        }));
    };

    const handleRemove = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
        setQuantities(prev => {
            const newQuantities = { ...prev };
            delete newQuantities[id];
            return newQuantities;
        });
    };

    const totalAmount = cartItems.reduce((acc, product) => {
        return acc + (product.preco * (quantities[product.id] || 1));
    }, 0);

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pt-8 pb-32 px-4 sm:pt-12 font-sans">
            <div className="container max-w-lg mx-auto">
                
                <h1 className="text-3xl font-black uppercase tracking-tight mb-8 pl-2">
                    Seu Carrinho
                </h1>

                <div className="flex flex-col gap-6">
                    
                    {cartItems.map((product) => (
                        /* Card Vertical Refinado */
                        <div key={product.id} className="flex flex-col p-5 border-[1.5px] border-[#514442]/15 rounded-[32px] shadow-sm bg-[var(--surface)]">
                            
                            {/* Imagem (Altura Controlada) */}
                            <div className="w-full h-40 sm:h-48 flex justify-center items-center mb-4">
                                <img
                                    src={product.url}
                                    alt={product.nome}
                                    className="h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Título e Lixeira Alinhados */}
                            <div className="flex justify-between items-start mb-4 gap-2">
                                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight ">
                                    {product.nome}
                                </h2>
                                <button 
                                    onClick={() => handleRemove(product.id)}
                                    className=" hover:text-[#D95032] transition-colors p-1 cursor-pointer shrink-0 mt-0.5"
                                    title="Remover item"
                                >
                                    <Trash2 size={22} strokeWidth={2.5} />
                                </button>
                            </div>

                            {/* Preço e Controles */}
                            <div className="flex items-end justify-between mt-auto">
                                <div>
                                    <p className="text-[11px] sm:text-xs uppercase font-bold  tracking-wider mb-1">
                                        Subtotal
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-black text-card leading-none">
                                        R$ {(product.preco * (quantities[product.id] || 1)).toFixed(2)}
                                    </p>
                                </div>

                                {/* Novo Design de Quantidade (Estilo Pílula) */}
                                <div className="flex items-center bg-[var(--bg)] rounded-full p-1 shadow-md">
                                    <button
                                        onClick={() => handleDecrease(product.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                                    >
                                        <Minus size={16} strokeWidth={3} />
                                    </button>
                                    
                                    <span className="w-8 text-center font-black text-sm">
                                        {quantities[product.id]}
                                    </span>
                                    
                                    <button
                                        onClick={() => handleIncrease(product.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#D95032] hover:opacity-90 transition-opacity shadow-sm cursor-pointer text-[#DFD0AF]"
                                    >
                                        <Plus size={16} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {cartItems.length > 0 ? (
                        <div className="flex flex-col gap-6 p-6 sm:p-8 border-[1.5px] border-[#514442]/15 bg-white/20 rounded-[40px] shadow-sm mt-2">
                            <div className="flex justify-between items-end border-b border-text pb-4">
                                <span className="text-lg sm:text-xl font-bold uppercase tracking-wide ">
                                    Total
                                </span>
                                <span className="text-3xl sm:text-4xl font-black text-card">
                                    R$ {totalAmount.toFixed(2)}
                                </span>
                            </div>

                            <button className="w-full bg-[var(--bg)] hover:bg-[#D95032]  text-lg sm:text-xl font-black uppercase py-5 rounded-full active:scale-95 transition-all shadow-md cursor-pointer">
                                Pagar Agora
                            </button>
                        </div>
                    ) : (
                        <div className="flex-center flex-col h-full p-10 border-[1.5px] border-[#514442]/15 bg-white/20 rounded-[40px] text-center mt-2">
                            <p className="text-xl font-black uppercase mb-2 ">Seu carrinho está vazio</p>
                            <p >Adicione alguns produtos para continuar.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}