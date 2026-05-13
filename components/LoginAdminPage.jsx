'use client'

import { KeyRound, User } from 'lucide-react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';

export default function LoginAdminPage({action}) {
  const { control, watch , handleSubmit} = useForm();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden ">

      <div className="absolute size-100 sm:size-150 bg-amarelo rounded-full blur-3xl opacity-30 -top-40 -left-40 animate-pulse"></div>

      <div className="relative w-full bg-(--surface)  rounded-[30px] max-w-sm mx-4">

        <div className="backdrop-blur-xl  border border-white/20 rounded-[30px] shadow-2xl  p-8 transition-all duration-500 hover:scale-[1.02]">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-wide">
              Bem-vindo Admin
            </h1>
            <p className=" text-sm mt-2">
              Faça login para acessar o painel de controle
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(action)}>

            <div className="relative group ">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-card group-focus-within:text-white transition-colors" size={20} />

              <Controller
                name='name'
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    placeholder="Nome"
                    type="text"
                    {...field}
                    className="w-full pl-12 pr-4 py-3 rounded-[6px] h-full placeholder:text-[var(--text)]) outline-none border border-text focus:border-[var(--card)] focus:ring-2 focus:ring-amarelo/50 transition-all duration-300"
                  />
                )}
              />
            </div>

            <div className="relative group">
              <KeyRound className="absolute text-card left-4 top-1/2 -translate-y-1/2 text-amarelo group-focus-within:text-white transition-colors" size={20} />

              
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    value={field.value || ""}
                    maxLength={6}
                
                    placeholder="Sua senha"
                    className="w-full pl-12 pr-4 py-3 rounded-[6px] h-full placeholder:text-[var(--text)]) outline-none border border-text focus:border-[var(--card)] focus:ring-2 focus:ring-amarelo/50 transition-all duration-300"
                />
                )}
              />
                
            </div>
            
          
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold  bg-[var(--bg)] active:scale-95 transition-all duration-300 shadow-lg hover:shadow-card"
            >
              Entrar
            </button>
  

          </form>

       
          
            <img
              src="chapeu.png"
              alt=""
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 sm:translate-x-28 sm:-translate-y-1 w-40 lg:translate-x-22 md:-top-20 lg:-top-23 lg:-right-11 sm:w-24 md:w-28 lg:w-36 object-contain pointer-events-none rotate-17 sm:rotate-12 sm:scale-x-[-1]"
            />
    
        </div>
      </div>
    </div>
  )
}
