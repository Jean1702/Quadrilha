'use client'

import { useState } from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link';
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#6F9196]">

      <div className="absolute size-100 sm:size-150 bg-[#E4C424] rounded-full blur-3xl opacity-30 -top-40 -left-40 animate-pulse"></div>
      <div className="absolute size-95 sm:size-125 bg-[#9BAEB3] rounded-full blur-3xl opacity-30 -bottom-40 -right-40 animate-pulse"></div>

      <div className="relative w-full max-w-sm mx-4">

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02]">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Bem-vindo
            </h1>
            <p className="text-white/70 text-sm mt-2">
              Faça login para continuar
            </p>
          </div>

          <form className="space-y-6">

            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E4C424] group-focus-within:text-white transition-colors" size={20} />

              <input
                type="text"
                placeholder="Username"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-[#E4C424] focus:ring-2 focus:ring-[#E4C424]/50 transition-all duration-300"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E4C424] group-focus-within:text-white transition-colors" size={20} />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-[#E4C424] focus:ring-2 focus:ring-[#E4C424]/50 transition-all duration-300"
              />
             
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E4C424] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Link href={'/admin'}>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold text-[#7A6808] bg-[#E4C424] hover:bg-[#D6B620] active:scale-95 transition-all duration-300 shadow-lg hover:shadow-[#E4C424]/50"
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
