"use client";

import React, { useState } from 'react';
import { Bell, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/Theme';
import { usePathname, useRouter } from 'next/navigation';
import CourseLogo from '../public/logos/LogoTipo.png';

const NavIcon = ({ href, icon: Icon, count, isDot, onClick, showBadge = true, customClass = "", isBackMode }) => {

  const colorClass = isBackMode ? 'text-white' : 'text-black';
  const hoverClass = isBackMode ? 'hover:bg-white/20' : 'hover:bg-black/5';

  const commonClasses = `group relative p-2 ${colorClass} ${hoverClass} rounded-full transition-all flex items-center justify-center ${customClass}`;

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

  if (href) return <Link href={href} className={commonClasses}>{content}</Link>;
  return <button onClick={onClick} type="button" className={commonClasses}>{content}</button>;
};

const HeaderBar = () => {
  const [notifications] = useState(1);
  const { theme } = useTheme();
  const pathname = usePathname() || "";
  const router = useRouter();

  const isBackMode =  pathname.includes('/product') || pathname.includes('/cart');

  const courseLogos = { curso1: '../public/logos/LogoTipo.png' };
  const segments = pathname.split('/').filter(Boolean);
  const courseIndex = segments.indexOf('course');
  let courseKey = courseIndex !== -1 ? segments[courseIndex + 1] : segments[1];

  const isCoursePage = pathname.includes('/course');
  const defaultLogo = theme === 'dark' ? '/logo_claro.png' : '/logo_escuro.png';
  const logoSrc = courseLogos[courseKey] || defaultLogo;

  return (
    <header
      className={`top-0 left-0 w-full z-50 navbar px-10 md:px-5 flex justify-between items-center h-20 transition-all duration-300 ${isBackMode
          ? "bg-transparent shadow-none fixed"
          : "bg-(--footer) shadow-sm sticky"
        }`}
    >
      <div className="flex-1">
        {isBackMode ? (
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center text-white bg-black/30 hover:bg-black/50 transition-colors p-2 rounded-full"
          >
            <ArrowLeft size={28} />
          </button>
        ) : (
          <Link href="/" className="relative h-20 flex items-center w-fit">
            <img
              src={isCoursePage ? (CourseLogo?.src || CourseLogo) : logoSrc}
              alt="Logo"
              className={`${isCoursePage ? 'h-20' : 'h-40'} w-auto object-contain -ml-5`}
            />
            {isCoursePage && <h2 className='font-black text-xl ml-1 text-black'>Informática</h2>}
          </Link>
        )}
      </div>

      <div className="flex-none flex items-center gap-2">
        {!isBackMode && (
          <NavIcon
            href="/cart"
            icon={ShoppingCart}
            showBadge={false}
            isBackMode={isBackMode}
          />
        )}

        <NavIcon
          href="/notifications"
          icon={Bell}
          count={notifications}
          isDot={true}
          isBackMode={isBackMode}
          customClass={isBackMode ? "bg-black/30" : ""}
        />
      </div>
    </header>
  );
};

export default HeaderBar;