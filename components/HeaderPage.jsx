"use client";

import React, { useState, useContext, useEffect, useRef } from 'react';
import { Bell, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/Theme';
import { usePathname, useRouter } from 'next/navigation';
import CourseLogo from '../public/logos/LogoTipo.png';
import { CartContext } from '@/context/CartContext';
import { CreateClient } from "@/lib/supabase/client";
import { getCorTurma } from '@/lib/turmaColors';

const NavIcon = ({ href, icon: Icon, count, isDot, onClick, showBadge = true, customClass = "", isBackMode, theme }) => {

  const colorClass = isBackMode ? 'text-white' : theme === 'dark' ? 'text-black' : 'text-white';

  const commonClasses = `group relative p-2 ${colorClass} rounded-full transition-all flex items-center justify-center ${customClass}`;

  const content = (
    <>
      <Icon size={25} className="group-hover:animate-bounce" />
      {showBadge && count > 0 && (
        <span className={isDot
          ? "absolute top-2 right-2 flex h-2 w-2"
          : "absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm"
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

  const { carrinho } = useContext(CartContext);
  const quantidadeNoCarrinho = carrinho.length;

  const [turmaAtual, setTurmaAtual] = useState(null);
  const [categoriaAtual, setCategoriaAtual] = useState(null);
  const [corTurma, setCorTurma] = useState({ bg: 'var(--footer)', text: '#ffffff' });
  const supabase = CreateClient();

  const isBackMode = pathname.includes('/product') || pathname.includes('/cart');

  const courseLogos = { curso1: '../public/logos/LogoTipo.png' };
  const segments = pathname.split('/').filter(Boolean);

  const isCoursePage = pathname.includes('/course');
  const courseIndex = segments.indexOf('course');
  let courseKey = courseIndex !== -1 ? segments[courseIndex + 1] : null;


  const isCategoryPage = pathname.includes('/categoria');
  const categoryIndex = segments.indexOf('categoria');
  let categoryKey = categoryIndex !== -1 ? segments[categoryIndex + 1] : null;
  const defaultLogo = theme === 'dark' ? '/logo_claro.png' : '/logo_escuro.png';

  useEffect(() => {
    if (isCoursePage && courseKey) {
      const fetchTurma = async () => {
        const { data, error } = await supabase
          .from('turma')
          .select('nomecurso, logo')
          .eq('idturma', courseKey)
          .single();

        if (data) {
          setTurmaAtual(data);
          setCorTurma(getCorTurma(data.nomecurso));
        }
      };
      fetchTurma();
    } else {
      setTurmaAtual(null);
      setCorTurma({ bg: 'var(--footer)', text: '#ffffff' });
    }
  }, [isCoursePage, courseKey]);

  useEffect(() => {
    if (isCategoryPage && categoryKey) {
      const fetchCategoria = async () => {
        const { data } = await supabase
          .from('categoria') // ATENÇÃO: Confirme o nome da tabela
          .select('nomecategoria') // Confirme o nome da coluna do nome
          .eq('idcategoria', categoryKey) // Confirme o nome da coluna do ID
          .single();

        if (data) setCategoriaAtual(data);
      };
      fetchCategoria();
    } else {
      setCategoriaAtual(null);
    }
  }, [isCategoryPage, categoryKey]);

  let textoParaExibir = "";
  if (isCoursePage && turmaAtual) textoParaExibir = turmaAtual.nomecurso;
  if (isCategoryPage && categoriaAtual) textoParaExibir = categoriaAtual.nomecategoria;

  const tamanhoTexto = textoParaExibir
    ? (textoParaExibir.length > 18 ? 'text-lg md:text-xl' :
      textoParaExibir.length > 12 ? 'text-xl md:text-2xl' :
        'text-2xl md:text-3xl')
    : 'text-xl';

  const shouldWrap = textoParaExibir && textoParaExibir.includes(' ');
  const normalize = (s) =>
    String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  let displayText = textoParaExibir || '';
  const norm = normalize(displayText);
  if (norm && (norm.includes('seguranca') || norm === '1seg' || norm === '1seh' || norm === '2seg')) {
    displayText = 'Segurança';
  }

  const titleRef = useRef(null);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    // reset
    el.style.fontSize = '';
    el.style.whiteSpace = 'nowrap';
    const minSize = 10;
    const computed = parseFloat(getComputedStyle(el).fontSize) || 16;
    let size = computed;
    const fit = () => {
      // ensure one-line and shrink until fits
      while (el.scrollWidth > el.clientWidth && size > minSize) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
    };
    fit();
    const onResize = () => { size = computed; el.style.fontSize = `${computed}px`; fit(); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); el.style.fontSize = ''; el.style.whiteSpace = ''; };
  }, [displayText, tamanhoTexto]);

  return (
    <header
      className={`top-0 left-0 w-full z-50 navbar px-4 md:px-5 flex justify-between items-center h-20 transition-all duration-300 ${isBackMode
        ? "bg-transparent shadow-none fixed"
        : "shadow-sm sticky"
        }`}
      style={{
        backgroundColor: isBackMode ? 'transparent' : corTurma.bg,
        color: corTurma.text
      }}
    >
      <div className="flex-1 min-w-0 flex items-center">
        {isBackMode ? (
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center text-white bg-black/30 hover:bg-black/50 transition-colors p-2 rounded-full"
          >
            <ArrowLeft size={28} />
          </button>
        ) : (
          <Link href="/" className="relative flex items-center gap-2 min-w-0">
            <img
              src={isCoursePage && turmaAtual ? turmaAtual.logo : defaultLogo}
              alt={textoParaExibir || "Logo"}
              className={`${isCoursePage && turmaAtual
                ? 'h-20 w-auto max-w-[160px] md:max-w-[180px]'
                : 'h-24 w-auto max-w-[220px]'
                } object-contain object-left flex-shrink-0`}
            />

            {displayText && (
              <h2 ref={titleRef} className={`font-black text-white leading-tight tracking-tight ${tamanhoTexto} min-w-0 whitespace-nowrap`}> 
                {displayText}
              </h2>
            )}
          </Link>
        )}
      </div>

      <div className="flex-none flex items-center gap-2">
        {!isBackMode && (
          <NavIcon
            href="/cart"
            icon={ShoppingCart}
            showBadge={true}
            count={quantidadeNoCarrinho}
            isDot={false}
            isBackMode={isBackMode}
            theme={theme}
          />
        )}

        <NavIcon
          href="/notification"
          icon={Bell}
          count={notifications}
          isDot={true}
          isBackMode={isBackMode}
          customClass={isBackMode ? "bg-black/30" : ""}
          theme={theme}
        />
      </div>
    </header>
  );
};

export default HeaderBar;