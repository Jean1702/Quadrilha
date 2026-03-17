"use client";

import React from 'react';
import { House, ShoppingCart, UserRound, Moon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FooterBar = () => {
    const pathname = usePathname();

    const menuItems = [
        { id: 'Início', icon: House, href: "/" },
        { id: 'Carrinho', icon: ShoppingCart, href: "/cart" },
        { id: 'Usuário', icon: UserRound, href: "/user" },
        { id: 'Tema escuro', icon: Moon },
    ];

    return (
        <div className="flex justify-center bg-transparent fixed bottom-2 w-full">
            <nav className="relative flex items-center bg-white rounded-full px-2.5 py-3 shadow-lg w-full max-w-md mx-2">
                {menuItems.map((item) => {
                    const isActive = item.href ? pathname === item.href : false;
                    const Icon = item.icon;
                    const commonClasses = "relative flex-1 flex flex-col items-center justify-center transition-all duration-200 z-10 py-2";

                    const content = (
                        <>
                            {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-22 h-16 bg-yellow-400 rounded-full shadow-sm" />
                                </div>
                            )}
                            <div className="relative z-20">
                                <Icon
                                    size={24}
                                    strokeWidth={isActive ? 2 : 1.5}
                                    className={isActive ? 'text-black' : 'text-gray-500'}
                                />
                            </div>
                        </>
                    );

                    if (item.href) {
                        return (
                            <Link key={item.id} href={item.href} className={commonClasses}>
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <button key={item.id} onClick={item.onClick} className={commonClasses}>
                            {content}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default FooterBar;