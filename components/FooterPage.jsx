"use client"
import React, { useState } from 'react';
import { House, ShoppingCart, UserRound, Moon } from 'lucide-react';

const FooterBar = () => {
    const [activeTab, setActiveTab] = useState('Comida');

    const menuItems = [
        { id: 'Início', icon: House },
        { id: 'Carrinho', icon: ShoppingCart },
        { id: 'Usuário', icon: UserRound },
        { id: 'Tema escuro', icon: Moon },
    ];

    return (
        <div className="flex-center bg-transparent fixed bottom-2 w-full">

            <nav className="relative flex items-center bg-white rounded-full px-2.5 py-5 shadow-lg w-full max-w-md mx-2 ">

                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className="relative flex-3 flex flex-col items-center justify-center transition-all duration-200 z-10"
                        >
                            {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-17 bg-amarelo rounded-full shadow-sm" />
                                </div>
                            )}

                            <div className={`relative z-20 cursor-pointer ${isActive ? 'mb-1' : 'mb-1.5'}`}>
                                <Icon
                                    size={25}
                                    strokeWidth={isActive ? 2 : 1.5}
                                    className={isActive ? 'text-black' : 'text-gray-800'}
                                />
                            </div>

                            {!isActive && item.label && (
                                <span className="text-xs font-medium text-gray-900">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default FooterBar;
