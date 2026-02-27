'use client'

import { useState } from 'react'
import { User, Lock, Eye, EyeOff } from 'lucide-react'

export default function AdminPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#6F9196]">

      {/* Background decorativo */}
      <div className="absolute size-100 sm:size-150 bg-[#E4C424] rounded-full blur-3xl opacity-30 -top-40 -left-40 animate-pulse"></div>
      <div className="absolute size-95 sm:size-125 bg-[#9BAEB3] rounded-full blur-3xl opacity-30 -bottom-40 -right-40 animate-pulse"></div>

      {/* Card */}
      <div className="relative w-full max-w-sm mx-4">

        <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02]">

          {/* Logo / Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Bem-vindo
            </h1>
            <p className="text-white/70 text-sm mt-2">
              Faça login para continuar
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">

            {/* Username */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E4C424] group-focus-within:text-white transition-colors" size={20} />

              <input
                type="text"
                placeholder="Username"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none border border-white/20 focus:border-[#E4C424] focus:ring-2 focus:ring-[#E4C424]/50 transition-all duration-300"
              />
            </div>

            {/* Password */}
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

            {/* Botão */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-[#7A6808] bg-[#E4C424] hover:bg-[#D6B620] active:scale-95 transition-all duration-300 shadow-lg hover:shadow-[#E4C424]/50"
            >
              Entrar
            </button>

          </form>
          
          <img src="chapeu.png" aria-hidden='true' className="absolute -top-6 -right-3 sm:-top-12 sm:-right-5 md:-top-19 md:-right-8 w-12 sm:w-20 md:w-28 lg:w-36 lg:-top-23 lg:-right-11 transform -scale-x-100 sm:rotate-12 object-contain pointer-events-none" />
        </div>
      </div>
    </div>
  )
}
