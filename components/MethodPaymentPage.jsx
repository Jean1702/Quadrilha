"use client";

import React, { useState } from 'react';
import { CreditCard, Banknote, ShoppingBasket, ArrowLeft, QrCode, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ORDER_ITEMS = [
    { id: 1, name: 'Burger Artesanal Especial', description: 'Pão brioche, blend 180g, queijo cheddar e bacon.', price: 34.90, qty: 1 },
    { id: 2, name: 'Batata Rústica (G)', description: 'Acompanha maionese da casa.', price: 18.00, qty: 1 },
    { id: 3, name: 'Coca-Cola 350ml', description: 'Lata gelada.', price: 6.50, qty: 2 },
];

export default function MethodPaymentPage() {
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });

    const subtotal = ORDER_ITEMS.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const total = subtotal;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const paymentOptions = [
        { id: 'credit_card', label: 'Cartão de Crédito', icon: <CreditCard size={25} />, desc: 'Pague pelo app' },
        { id: 'debit_card', label: 'Cartão de Débito', icon: <Banknote size={25} />, desc: 'Pague pelo app' },
        { id: 'pix', label: 'Pix', icon: <QrCode size={25} />, desc: 'Aprovação instantânea' },
    ];

    return (
        <div className="min-h-screen pb-10">
            <div className="max-w-4xl mx-auto px-4 pt-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors group font-medium text-sm"
                >
                    <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 group-hover:border-red-100 transition-all">
                        <ArrowLeft size={22} />
                    </div>
                </button>
            </div>

            <main className="max-w-4xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-5 gap-8 mt-2">
                <div className="lg:col-span-3 space-y-4">
                    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-[var(--color-laranja)] p-2">
                                <ShoppingBasket className="text-white" size={20} />
                            </div>
                            <h2 className="font-bold text-gray-900 text-xl tracking-tight">Itens do carrinho</h2>
                        </div>

                        <div className="space-y-6">
                            {ORDER_ITEMS.map((item) => (
                                <div key={item.id} className="flex justify-between items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-black-800 font-bold text-sm px-2 py-0.5 rounded-lg">
                                                {item.qty}x
                                            </span>
                                            <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-600">
                                        R$ {(item.price * item.qty).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-2">
                    <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-8">
                        <h2 className="text-lg font-extrabold mb-6 text-gray-900">Pagamento</h2>

                        <div className="space-y-3">
                            {paymentOptions.map((option) => {
                                const isSelected = paymentMethod === option.id;
                                const isCard = option.id.includes('card');

                                return (
                                    <div key={option.id} className="overflow-hidden">
                                        <button
                                            onClick={() => setPaymentMethod(option.id)}
                                            className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left
                        ${isSelected ? 'border-red-500 bg-red-50/10' : 'border-gray-50 hover:border-gray-200 bg-gray-50/30'}
                      `}
                                        >
                                            <div className={`mr-4 p-2 rounded-xl ${isSelected ? 'bg-red-500 text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                                {option.icon}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-[13px] font-bold ${isSelected ? 'text-red-600' : 'text-gray-700'}`}>
                                                    {option.label}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{option.desc}</p>
                                            </div>
                                            <div className={`transition-transform duration-300 ${isSelected && isCard ? 'rotate-180' : ''}`}>
                                                {isCard ? <ChevronDown size={18} className="text-gray-400" /> :
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-red-500' : 'border-gray-200'}`}>
                                                        {isSelected && <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />}
                                                    </div>
                                                }
                                            </div>
                                        </button>

                                        <div className={`transition-all duration-300 ease-in-out ${isSelected && isCard ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                            <div className="p-4 bg-gray-50 rounded-2xl space-y-3 border border-gray-100">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Número do Cartão</label>
                                                    <input
                                                        type="text"
                                                        name="number"
                                                        placeholder="0000 0000 0000 0000"
                                                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nome no Cartão</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        placeholder="JOÃO A SILVA"
                                                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Validade</label>
                                                        <input
                                                            type="text"
                                                            name="expiry"
                                                            placeholder="MM/AA"
                                                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">CVV</label>
                                                        <input
                                                            type="text"
                                                            name="cvv"
                                                            placeholder="123"
                                                            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="flex flex-col mb-6">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Valor total da compra</span>
                                <span className="text-3xl font-black text-gray-900 leading-tight">
                                    R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            <button
                                onClick={() => console.log('Finalizando com:', { paymentMethod, cardData })}
                                className="w-full bg-[var(--color-laranja)] hover:brightness-90 text-black font-bold py-4 rounded-[40px] transition-all active:scale-95 shadow-lg shadow-yellow-900/10 flex items-center justify-center gap-2"
                            >
                                Finalizar Pedido
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}