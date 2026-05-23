"use client";

import React from 'react';

interface AdminHeaderPageProps {
  titulo?: string; 
  nometurma?: string;
  anoturma?: string;
  logo?: string;
}

const AdminHeaderPage = ({ titulo = "ADMINISTRAÇÃO", nometurma, anoturma, logo }: AdminHeaderPageProps) => {
  return (
    <header className="w-full text-white shadow-lg overflow-hidden fixed" style={{ backgroundColor: '#0f172a' }}>
      <div className="flex items-center justify-between px-4 pt-5 pb-8 max-w-7xl mx-auto overflow-hidden">
        <span className="font-bold text-sm sm:text-lg md:text-2xl uppercase tracking-wide flex-shrink-0">
          {titulo}
        </span>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink min-w-0">
          <span className="font-bold text-sm sm:text-lg md:text-2xl uppercase tracking-wide whitespace-nowrap">
            {anoturma}° - {nometurma}
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
