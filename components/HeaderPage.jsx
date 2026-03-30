"use client";

import React, { useState } from 'react';
import { Bell, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/Theme';

const NavIcon = ({ href, icon: Icon, count, isDot, onClick, showBadge = true }) => {
  const commonClasses = "group relative p-2 text-white-200 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center";
  
  
  const content = (
    <>
      <Icon size={25} className="group-hover:animate-bounce" />
      {showBadge && count > 0 && (
        <span className={isDot 
          ? "absolute top-2 right-2 flex h-2 w-2" 
          : "absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white shadow-sm"
        }>
          <span className={`animate-ping absolute h-full w-full rounded-full opacity-50 ${isDot ? 'bg-red-400' : 'bg-blue-400'}`}></span>
          <span className={`relative ${isDot ? 'rounded-full h-2 w-2 bg-red-500' : ''}`}>{!isDot && count}</span>
        </span>
      )}
    </>
  );

  if (href) {
    return <Link href={href} className={commonClasses}>{content}</Link>;
  }

  return <button onClick={onClick} type="button" className={commonClasses}>{content}</button>;
};

const HeaderPage = () => {
  const [notifications] = useState(1);
  const { theme } = useTheme();

  return (
    <header 
      className="sticky top-0 left-0 w-full z-50 navbar bg-base-100 shadow-sm px-10 md:px-5 flex justify-between items-center h-20 header"
    >
      <div className="flex-1 p-0 m-0">
        <Link href="/" className="flex items-start w-fit p-0 m-0">
          <img 
            src={theme === 'dark' ? '/logo_claro.png' : '/logo_escuro.png'}
            alt="Logo Uai Rango" 
            className="h-50 w-50 -mt-0 -ml-7.5 object-fit"         
            />
        </Link>
      </div>

      <div className="flex-none flex items-center gap-2">
        <NavIcon 
          href="/cart" 
          icon={ShoppingCart} 
          showBadge={false} 
        />
        
        <NavIcon 
          href="/notifications" /* Essa rota aqui ainda não existe, e está apenas como placeholder */
          icon={Bell} 
          count={notifications} 
          isDot={true} 
        />
      </div>
    </header>
  );
};

export default HeaderPage;