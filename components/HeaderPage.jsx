"use client"
import React, { useState } from 'react';
import { Bell, ShoppingCart } from 'lucide-react';

const HeaderBar = () => {
    const [cartItems, setCartItems] = useState(0);
    const [notifications, setNotifications] = useState(0);

    return (
        <div className="flex justify-end items-center w-full">
            <div className="flex items-center gap-5">
                <button className="group relative p-2 text-gray-200 hover:bg-white/10 rounded-full transition-colors">
                    <ShoppingCart size={25} className="group-hover:animate-bounce" />
                    {cartItems > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-sm">
                            <span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative">{cartItems}</span>
                        </span>
                    )}
                </button>

                <button className="group relative p-2 text-gray-200 hover:bg-white/10 rounded-full transition-colors">
                    <Bell size={25} className="group-hover:animate-bounce" />
                    {notifications > 0 && (
                        <span className="absolute top-1.5 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default HeaderBar;