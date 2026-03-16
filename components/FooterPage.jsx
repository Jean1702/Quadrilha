"use client"
import React, { useState } from 'react';
import { House, ShoppingCart, UserRound, Moon } from 'lucide-react';
import Link from 'next/link';
const FooterBar = () => {
    const [activeTab, setActiveTab] = useState('Comida');

    const menuItems = [
        { id: 'Início', icon: House, href: "/" },
        { id: 'Carrinho', icon: ShoppingCart, href: "/" },
        { id: 'Usuário', icon: UserRound , href: "/user" },
        { id: 'Tema escuro', icon: Moon, href: "/" },

    ];

    return (
        <div className="flex-center bg-transparent fixed bottom-1 w-full">

            <nav className="relative flex items-center bg-white rounded-full px-2.5 py-5 shadow-lg w-full max-w-md mx-2 ">

                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    const href = item.href;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className="relative flex-2 flex flex-col items-center justify-center transition-all duration-200 z-10"
                        >
                            {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-17 bg-amarelo rounded-full shadow-sm" />
                                </div>
                            )}
                            <Link href={href}>
                                <div className={`relative z-20 cursor-pointer ${isActive ? 'mb-1.5' : 'mb-1'}`}>
                                    <Icon
                                        size={25}
                                        strokeWidth={isActive ? 2 : 1.5}
                                        className={isActive ? 'text-black' : 'text-gray-600'}
                                    />
                                </div>
                            </Link>

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
