"use client"
import React, { useState } from 'react';
import { House, Store, UserRound, Menu } from 'lucide-react';

const FooterBar = () => {
    const [activeTab, setActiveTab] = useState('Comida');

    const menuItems = [
        { id: 'Início', icon: House },
        { id: 'Comidas', icon: Store },
        { id: 'Usuário', icon: UserRound },
        { id: 'Menu', icon: Menu },
    ];

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">

            <nav className="relative flex items-center bg-white rounded-full px-5 py-5 shadow-lg w-full max-w-md mx-4">

                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className="relative flex-1 flex flex-col items-center justify-center transition-all duration-200 z-10"
                        >
                            {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-17 bg-amarelo rounded-full shadow-sm" />
                                </div>
                            )}

                            <div className={`relative z-20 ${isActive ? 'mb-0' : 'mb-1'}`}>
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 1.5}
                                    className={isActive ? 'text-black' : 'text-gray-600'}
                                />
                            </div>

                            {!isActive && item.label && (
                                <span className="text-xs font-medium text-gray-500">
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
