"use client";

import React, { useState, useEffect } from 'react';
import { House, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Darkmode from './Darkmode';

const FooterBar = () => {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const isCheckoutFlow = pathname.includes('/cart') ||
        pathname.includes('/product') ||
        pathname.includes('/method_payment');

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 50) {

                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const menuItems = [
        { id: 'Início', icon: House, href: "/" },
        { id: 'Usuário', icon: UserRound, href: "/User" }
    ];

    if (isCheckoutFlow) {
        return null; 
    }

    return (
        <div className={`fixed bottom-1.5 left-0 w-full px-5 transition-all duration-300 ease-in-out z-50 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}>
            <nav className="flex items-center justify-between rounded-full px-4 py-3 shadow-lg w-full max-w-md mx-auto footer">
                {menuItems.map(({ id, icon: Icon, href }) => {
                    const isActive = pathname === href;

                    return (
                        <Link key={id} href={href} className="relative flex-1 flex flex-col items-center justify-center py-2 z-10">
                            {isActive && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-16 rounded-full bg-[var(--color-amarelo)] shadow-sm" />
                                </div>
                            )}
                            <Icon
                                size={25}
                                className={`relative z-20 transition-colors ${isActive ? 'text-white' : 'text-gray-350'}`}
                                strokeWidth={isActive ? 2 : 1.5}
                            />
                        </Link>
                    );
                })}

                <div className="flex flex-1  justify-center z-10">
                    <Darkmode />
                </div>
            </nav>
        </div>
    );
};


export default FooterBar;