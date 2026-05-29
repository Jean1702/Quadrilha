'use client'

import { useState, useEffect } from 'react';
import { Phone, User, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm, Controller, set } from 'react-hook-form';
import { isValidPhoneNumber } from "libphonenumber-js"
import { useRouter } from 'next/navigation';

// 1. Colocamos as funções AQUI EM CIMA, fora do componente.
// Assim elas sempre existem antes do código rodar!
function formatPhone(value) {
  if (!value) return "";
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
  if (!phone) return false;

  const numbers = phone.replace(/\D/g, "");
  const formatado = `+55${numbers}`;

  return isValidPhoneNumber(formatado, 'BR');
}


export default function RegisterPage({ enviarWhatsapp, codigoconfirm }) {
  const { control, watch, handleSubmit, getValues } = useForm();
  const router = useRouter();
  const [openpopup, setOpenpopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phone2, setphone2] = useState("")
  const [nome2, setnome2] = useState("")
  const phoneValue = watch("phone");
  const phoneIsValid = validatePhone(phoneValue);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");

  async function handleReenviar() {
    if (!canResend) return;
    try {
      setCanResend(false);
      setCountdown(60);

      const result = await enviarWhatsapp(phone2);

      if (!result.success) {
        alert("Erro ao reenviar o código: " + result.error);
        setCanResend(true);
        setCountdown(0);
      }
    } catch (error) {
      console.error("Erro ao reenviar:", error);
      setCanResend(true);
      setCountdown(0);
    }
  }

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [countdown, canResend]);

  const handleEntrarClick = async () => {
    if (!phoneIsValid) return;

    setIsLoading(true);
    setAlertMessage("");
    const phone = getValues("phone");
    const nome = getValues("name")

    if (!nome || nome.trim() === "") {
      setAlertMessage("Por favor, preencha o seu nome.");
      setIsLoading(false);
      return;
    }

    setnome2(nome)
    setphone2(phone)
    const response = await enviarWhatsapp(phone);

    if (response?.success) {
      setOpenpopup(true);
    } else if (response?.alreadyRegistered) {
      setAlertMessage(response.error);

      setTimeout(() => {
        router.push('/login');
      }, 5000);
    } else {
      setAlertMessage(response?.error || "Erro ao enviar o código pelo WhatsApp.");
    }

    setIsLoading(false);
  };

  async function handleConfirmarCodigo(formData) {
    setIsLoading(true); // Liga o loading

    try {
      // 4. Aqui você chama a PROP que veio do componente pai!
      await codigoconfirm(formData);
    } catch (error) {
      console.error("Erro ao confirmar:", error);
    } finally {
      // Desliga o loading independente do resultado
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      <div className="absolute size-100 sm:size-150 bg-amarelo rounded-full blur-3xl opacity-30 -top-40 -left-40 animate-pulse"></div>

      <div className="relative w-full bg-[var(--surface)] rounded-[30px] max-w-sm mx-4">
        <div className="backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl p-8 transition-all duration-500 hover:scale-[1.02]">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-wide">
              Bem-vindo
            </h1>
            <p className="text-sm mt-2">
              Faça Registro para continuar
            </p>
          </div>

          <form className="space-y-4">

            <div className="relative group">
              <User className="absolute text-card left-4 top-1/2 -translate-y-1/2 text-card group-focus-within:text-white transition-colors" size={20} />
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
              <Phone className="absolute text-card left-4 top-1/2 -translate-y-1/2 text-amarelo group-focus-within:text-white transition-colors" size={20} />
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
                    className="w-full pl-12 pr-4 py-3 rounded-[6px] h-full placeholder:text-[var(--text)]) outline-none border border-text focus:border-[var(--card)] focus:ring-2 focus:ring-amarelo/50 transition-all duration-300"
                  />
                )}
              />
            </div>

            <Link
              href="/login"
              className="group relative mb-5 flex justify-center text-sm transition-all duration-300"
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

            {alertMessage && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center p-3 rounded-xl mt-2">
                {alertMessage}
              </div>
            )}

            <button
              type="button"
              onClick={handleEntrarClick}
              disabled={!phoneIsValid || isLoading}
              className="w-full py-3 rounded-xl font-semibold bg-[var(--bg)] active:scale-95 transition-all duration-300 shadow-lg hover:shadow-card disabled:opacity-50"
            >
              {isLoading ? "Enviando..." : "Cadastrar"}
            </button>
          </form>

          {openpopup && (
            <div className="fixed inset-0 bg-(--surface)  rounded-[30px]  flex items-center justify-center z-50">
              <div className="relative w-full max-w-md mx-4 backdrop-blur-xl border border-white/20 shadow-2xl  rounded-[40px] p-8">

                <form action={handleConfirmarCodigo}>
                  <button
                    type="button"
                    onClick={() => setOpenpopup(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-red-400 hover:text-red-500 hover:bg-red-500/10 transition"
                  >
                    <X size={22} />
                  </button>

                  <input type="hidden" name='phonesalvo' value={phone2} />
                  <input type='hidden' name='nomesalvo' value={nome2} />
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-(--text) tracking-wide">
                      Verificação de telefone
                    </h2>
                    <p className="text-(--text) text-sm mt-2">
                      Enviamos um código para confirmar seu número
                    </p>
                  </div>


                  <Controller
                    name="codigo"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, ...fieldConfig } }) => (
                      <input
                        {...fieldConfig}
                        value={value}
                        onChange={(e) => {
                          const apenasNumeros = e.target.value.replace(/\D/g, "");

                          e.target.value = apenasNumeros;

                          onChange(apenasNumeros);
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        placeholder="000000"
                        className="w-full text-center tracking-[0.5em] text-2xl font-bold px-4 py-4 rounded-xl bg-(--bg) text-(--text) placeholder-(--text) outline-none border border-white/20 focus:border-amarelo focus:ring-2 focus:ring-amarelo/50 focus:bg-(--bg)/70 transition-all duration-300"
                      />
                    )}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3.5 mt-3 rounded-xl font-bold text-black flex items-center justify-center transition-all duration-300 shadow-lg ${isLoading
                      ? "bg-amarelo/70 cursor-not-allowed shadow-none"
                      : "bg-amarelo/90 hover:bg-yellow-600 active:scale-95 shadow-amarelo/20"
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={20} />
                        Verificando...
                      </>
                    ) : (
                      "Confirmar Código"
                    )}
                  </button>

                  <p className="text-center text-sm text-(--text) mt-6">
                    Não recebeu o código?{" "}
                    <button
                      type="button"
                      disabled={!canResend} // Bloqueia o clique nativamente no HTML
                      onClick={handleReenviar}
                      className={`font-semibold transition-colors ${canResend
                        ? "text-amarelo cursor-pointer hover:text-yellow-400 hover:underline"
                        : "text-(--text)/80 cursor-not-allowed" // Estilo visual de desativado
                        }`}
                    >
                      {canResend ? "Reenviar" : `Reenviar em ${countdown}s`}
                    </button>
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