'use client'

import { useState } from 'react';
import { Phone, User, X } from 'lucide-react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { isValidPhoneNumber } from "libphonenumber-js"

export default function RegisterPage({actions, codigoconfirm}) {
  const { control, watch , handleSubmit} = useForm();
  const [openpopup, setOpenpopup] = useState(false);
  const phoneValue = watch("phone")
  const phoneIsValid = validatePhone(phoneValue)

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


  function validatePhone(phone) {
    if(!phone) return false;

    const numbers = phone.replace(/\D/g, "");
    const formmatado = `+55${numbers}`;

    return isValidPhoneNumber(formmatado, 'BR');
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

          <form className="space-y-4" onSubmit={handleSubmit(actions)}>

            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-amarelo group-focus-within:text-white transition-colors" size={20} />

              <Controller
                name='name'
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    placeholder="Nome"
                    type="text"
                    {...field}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-amarelo focus:ring-2 focus:ring-amarelo/50 transition-all duration-300"
                  />
                )}
              />

              
            </div>

            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-amarelo group-focus-within:text-white transition-colors" size={20} />

              <Controller
                name='phone'
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="tel"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(formatPhone(e.target.value))}
                    maxLength={15}
                
                    placeholder="(99) 99999-9999"
                    className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-amarelo focus:ring-2 focus:ring-amarelo/50 transition-all duration-300"
                />
                )}
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

            {phoneValue && !phoneIsValid && (
              <p className="text-red-400 text-sm mt-2">
                Número de telefone inválido
              </p>
            )}

      
            <button
              type="submit"
              onClick={() => setOpenpopup(true)}
              className="relative group w-full py-3 rounded-xl font-semibold text-preto bg-amarelo hover:bg-amarelo-700 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-amarelo/50"
              
            >
              Entrar
            </button>
            


          </form>
            {openpopup && (
              <div className="fixed inset-0 bg-azul/70 rounded-2xl backdrop-blur-md flex items-center justify-center z-50">

                <div className="relative w-full max-w-md mx-4 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8">
                  <form onSubmit={handleSubmit(codigoconfirm)}>

                    <button
                      onClick={() => setOpenpopup(false)}
                      className="absolute top-4 right-4 p-1.5 rounded-full text-red-400 hover:text-red-500 hover:bg-red-500/10 transition"
                    >
                      <X size={22} />
                    </button>

                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-semibold text-white tracking-wide">
                        Verificação de telefone
                      </h2>

                      <p className="text-white/70 text-sm mt-2">
                        Enviamos um código para confirmar seu número
                      </p>
                    </div>

                    <input
                      type="text"
                      placeholder="Digite o código"
                      className="w-full text-center tracking-widest text-lg px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-amarelo focus:ring-2 focus:ring-amarelo/50 transition-all duration-300"
                    />

                    <button
                      type="submit"
                      className="w-full mt-6 py-3 rounded-xl font-semibold text-preto bg-amarelo hover:bg-amarelo-700 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-amarelo/40"
                    >
                      Confirmar código
                    </button>

                    <p className="text-center text-xs text-white/60 mt-4">
                      Não recebeu o código?{" "}
                      <span className="text-amarelo font-medium cursor-pointer hover:underline">
                        Reenviar
                      </span>
                    </p>
                  </form>

                  
                </div>
                  <img
                    src="chapeu.png"
                    alt=""
                    className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 sm:translate-x-28 sm:-translate-y-1 w-40 lg:translate-x-22 md:-top-20 lg:-top-23 lg:-right-11 sm:w-24 md:w-28 lg:w-36 object-contain pointer-events-none rotate-17 sm:rotate-12 sm:scale-x-[-1]"
                  />
              </div>
            )}

       
          
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
