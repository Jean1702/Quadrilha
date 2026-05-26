"use client";

import React, { useRef, useEffect } from 'react';
import { getCorTurma } from '@/lib/turmaColors';

interface AdminHeaderPageProps {
  titulo?: string; 
  nometurma?: string;
  anoturma?: string;
  logo?: string;
}


const AdminHeaderPage = ({ titulo = "ADMINISTRAÇÃO", nometurma, anoturma, logo }: AdminHeaderPageProps) => {
  const corTurma = getCorTurma(nometurma);
  const shouldWrap = !!nometurma && nometurma.includes(' ');
  const normalize = (s: string) =>
    String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  let displayName = nometurma || '';
  const norm = normalize(displayName);
  if (norm && (norm.includes('seguranca') || norm === '1seg' || norm === '1seh' || norm === '2seg')) {
    displayName = 'Segurança';
  }
  
  const titleRef = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.fontSize = '';
    el.style.whiteSpace = 'nowrap';
    const minSize = 10;
    const computed = parseFloat(getComputedStyle(el).fontSize) || 16;
    let size = computed;
    const fit = () => {
      while (el.scrollWidth > el.clientWidth && size > minSize) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
    };
    fit();
    const onResize = () => { size = computed; el.style.fontSize = `${computed}px`; fit(); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); if (el) { el.style.fontSize = ''; el.style.whiteSpace = ''; } };
  }, [displayName]);
  
  return (
    <header className="w-full fixed top-0 left-0 z-50 text-white shadow-lg overflow-hidden" style={{ backgroundColor: corTurma.bg }}>
      <div className="flex items-center justify-between px-4 pt-5 pb-8 max-w-7xl mx-auto overflow-hidden">
        <span className="font-bold text-sm sm:text-lg md:text-2xl uppercase tracking-wide flex-shrink-0">
          {titulo}
        </span>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink min-w-0">
          <span ref={titleRef} className={`font-bold text-sm sm:text-lg md:text-2xl uppercase tracking-wide whitespace-nowrap`}>
            {anoturma}° - {displayName}
          </span>

          <img 
            src={logo }
            alt="Logo Conectados" 
            className="h-16 sm:h-14 md:h-16 w-auto flex-shrink-0"
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeaderPage;
