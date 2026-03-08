'use client'

import { useState } from 'react';
import { Phone, User } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [phone, setPhone] = useState("");

  function formatPhone(value) {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 10) {
      return numbers
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return numbers
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  function handleChange(e) {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-azul">

      <div className="absolute size-100 sm:size-150 bg-amarelo rounded-full blur-3xl opacity-30 -top-40 -left-40 animate-pulse"></div>
      <div className="absolute size-95 sm:size-125 bg-bege rounded-full blur-3xl opacity-30 -bottom-40 -right-40 animate-pulse"></div>

      <div className="relative w-full max-w-sm mx-4">

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02]">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Bem-vindo
            </h1>
            <p className="text-white/70 text-sm mt-2">
              Faça Registro para continuar
            </p>
          </div>

          <form className="space-y-4">

            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-amarelo group-focus-within:text-white transition-colors" size={20} />

              <input
                type="text"
                placeholder="Nome"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-amarelo focus:ring-2 focus:ring-amarelo/50 transition-all duration-300"
              />
            </div>

            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-amarelo group-focus-within:text-white transition-colors" size={20} />

              
              <input
                type="tel"
                value={phone}
                onChange={handleChange}
                maxlength={15}
                placeholder="(99) 99999-9999"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-amarelo focus:ring-2 focus:ring-amarelo/50 transition-all duration-300"
              />
                
            </div>

            <Link
                href="/login"
                className="group relative mb-5 flex justify-center text-sm text-white/70 transition-all duration-300 hover:text-white"
              >
                <span className="flex items-center gap-1">
                  Já tem cadastro?
                  <span className="font-semibold relative">
                    Login
                    <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </span>
                </span>
            </Link>
      
            <Link href={'/admin'}>
              <button
                type="submit"
                className="relative group w-full py-3 rounded-xl font-semibold text-preto bg-amarelo hover:bg-amarelo-700 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-amarelo/50"
              >
                Entrar
              </button>
            </Link>

          </form>

       
          
            <img
              src="chapeu.png"
              alt=""
              className="absolute left-1/2 -top-0 -translate-x-1/2 -translate-y-1/2 sm:translate-x-28 sm:-translate-y-1 w-40 lg:translate-x-22 md:-top-20 lg:-top-23 lg:-right-11 sm:w-24 md:w-28 lg:w-36 object-contain pointer-events-none rotate-17 sm:rotate-12 sm:scale-x-[-1]"
            />
    
        </div>
      </div>
    </div>
  )
}
