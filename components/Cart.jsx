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
        <div className="min-h-screen bg-[#F2F2F2] pt-8 pb-32 px-4 sm:pt-12">
            <div className="container max-w-2xl mx-auto">
                <div className="flex flex-col gap-6 sm:gap-10">
                    
                    {cartItems.map((product) => (
                        <div key={product.id} className="flex flex-col gap-6 items-center p-6 sm:p-10 bg-white rounded-[40px] shadow-sm">
                            
                            <div className="w-full max-w-[280px] sm:max-w-md">
                                <div className="aspect-square w-full relative">
                                    <img
                                        src={product.url}
                                        alt={product.nome}
                                        className="w-full h-full object-contain drop-shadow-xl rounded-3xl"
                                    />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#0D0D0D] text-center mt-4 tracking-tight leading-none">
                                    {product.nome}
                                </h1>
                            </div>

                            <div className="flex items-center border-[3px] border-[#0D0D0D] rounded-full overflow-hidden">
                                <button
                                    onClick={() => handleDecrease(product.id)}
                                    className="p-3 sm:p-4 hover:bg-[#F2F2F2] transition-colors cursor-pointer"
                                >
                                    <Minus size={20} strokeWidth={3} />
                                </button>
                                <span className="w-12 sm:w-16 text-center font-black text-xl sm:text-2xl">{quantities[product.id]}</span>
                                <button
                                    onClick={() => handleIncrease(product.id)}
                                    className="p-3 sm:p-4 hover:bg-[#F2F2F2] transition-colors cursor-pointer"
                                >
                                    <Plus size={20} strokeWidth={3} />
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-xs sm:text-sm uppercase font-bold text-[#0D0D0D]/40 tracking-widest mb-1">Subtotal</p>
                                <p className="text-3xl sm:text-4xl font-black text-[#D95032]">
                                    R$ {(product.preco * (quantities[product.id] || 1)).toFixed(2)}
                                </p>
                            </div>

                            <button 
                                onClick={() => handleRemove(product.id)}
                                className="group flex items-center justify-center p-3 rounded-full border-2 border-red-500/20 hover:border-red-500 transition-colors w-12 h-12 sm:w-14 sm:h-14 cursor-pointer"
                            >
                                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 group-hover:text-red-500" />
                            </button>

                        </div>
                    ))}

                    {cartItems.length > 0 ? (
                        <div className="flex flex-col gap-6 p-6 sm:p-8 bg-white rounded-[40px] shadow-sm mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xl sm:text-2xl font-black uppercase text-[#0D0D0D] tracking-wide">
                                    Total
                                </span>
                                <span className="text-3xl sm:text-4xl font-black text-[#D95032]">
                                    R$ {totalAmount.toFixed(2)}
                                </span>
                            </div>

                            <button className="w-full bg-[#D95032] text-white text-lg sm:text-xl font-black uppercase py-5 rounded-full active:scale-95 transition-transform shadow-md cursor-pointer">
                                Pagar Agora
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-[40px] shadow-sm text-center">
                            <p className="text-xl font-black text-[#0D0D0D] uppercase mb-2">Seu carrinho está vazio</p>
                            <p className="text-[#0D0D0D]/60">Adicione alguns produtos para continuar.</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}