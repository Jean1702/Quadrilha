"use client";

import React, { useState } from 'react';
import { Bell, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/Theme';
import { usePathname } from 'next/navigation'; 
import CourseLogo from '@/components/logos/LogoTipo.png';

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
  const pathname = usePathname() || "";

  const courseLogos = {
    curso1: '/logos/LogoTipo.png',
    curso2: '/logos/curso2.png',
    curso3: '/logos/curso3.png',
    curso4: '/logos/curso4.png',
    curso5: '/logos/curso5.png',
  };

  const segments = pathname.split('/').filter(Boolean);
  let courseKey = null;
  const idx = segments.indexOf('course');
  
  if (idx !== -1 && segments.length > idx + 1) {
    courseKey = segments[idx + 1];
  } else if (segments[0] === 'curso' && segments.length > 1) {
    courseKey = segments[1];
  } else if (segments[0] && Object.keys(courseLogos).includes(segments[0])) {
    courseKey = segments[0];
  }

  const mappedLogo = courseKey && courseLogos[courseKey] ? courseLogos[courseKey] : null;

  if (pathname.includes('/course')) {
    const staticLogo = CourseLogo?.src || CourseLogo;
    
    return (
      <header className="sticky top-0 left-0 w-full z-50 navbar bg-base-100 shadow-sm px-10 md:px-5 flex justify-between items-center h-20 header">
        <div className="flex-1">
          <Link href="/" className="relative h-20 flex items-center w-fit ">
            <img 
              src={staticLogo}
              alt="Logo" 
              className="h-18 ml-5 w-auto object-contain drop-shadow-md"         
            />
            <h2 className=' font-black text-xl ml-2'>Informática</h2>
          </Link>
        </div>

        <div className="flex-none flex items-center gap-2">
          <NavIcon href="/cart" icon={ShoppingCart} showBadge={false} />
          <NavIcon href="/notifications" icon={Bell} count={notifications} isDot={true} />
        </div>
      </header>
    );
  }

  const logoSrc = mappedLogo || (theme === 'dark' ? '/logo_claro.png' : '/logo_escuro.png');

  return (
    <header className="sticky top-0 left-0 w-full z-50 navbar bg-base-100 shadow-sm px-10 md:px-5 flex justify-between items-center h-20 header">
      <div className="flex-1">
        <Link href="/" className="relative h-20 flex items-center w-fit ">
          <img 
            src={logoSrc}
            alt="Logo" 
            className="h-50 mt-3 -ml-10 w-auto object-contain drop-shadow-md"         
          />
        </Link>
      </div>

      <div className="flex-none flex items-center gap-2">
        <NavIcon href="/cart" icon={ShoppingCart} showBadge={false} />
        <NavIcon href="/notifications" icon={Bell} count={notifications} isDot={true} />
      </div>
    </header>
  );
};

export default HeaderPage;