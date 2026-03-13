"use client"
import React, { useState } from 'react';
import { Bell, ShoppingCart } from 'lucide-react';

const HeaderBar = () => {
    const [cartItems, setCartItems] = useState(0);

    return (
        <div className="flex items-center gap-4 justify-between w-full">
            
            <button className="group relative p-2 text-gray-600 hover:bg-white/10 rounded-full transition-colors">
                <Bell size={24} className="group-hover:animate-bounce" />
                <span className="absolute top-1.5 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative rounded-full h-2 w-2 bg-red-500"></span>
                </span>
            </button>
        </div>
    );
};

export default HeaderBar;