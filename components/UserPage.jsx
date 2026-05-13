"use client";

import { useState, useEffect } from "react";
import { CreateClient } from "../lib/supabase/client";
import { useRouter } from "next/navigation";
import { FiTrash, FiChevronDown } from "react-icons/fi";

export default function User({ name, phone }) {
  const [image, setImage] = useState(null);
  const [showOrder, setShowOrder] = useState(true);
  const [hasOrder, setHasOrder] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedImage = localStorage.getItem("user_profile_image");
    if (savedImage) setImage(savedImage);
  }, []);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem é muito grande! Escolha uma de até 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImage(base64String);
      localStorage.setItem("user_profile_image", base64String);
    };
    reader.readAsDataURL(file);
  }

  async function UserOut() {
    if (hasOrder) {
      alert("Você não pode excluir o perfil com um pedido em andamento!");
      return;
    }
    const supabase = await CreateClient();
    await supabase.auth.signOut();
    localStorage.removeItem("user_profile_image");
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* CARD PRINCIPAL */}
      <div className="w-full max-w-sm bg-[var(--surface)] rounded-[12px] p-6 shadow-lg border border-[#000]/5">
        <h1 className="text-2xl font-bold text-center mb-6 text-[var(--text)]">Meu Perfil</h1>

        {/* SEÇÃO: FOTO À ESQUERDA, INFORMAÇÕES À DIREITA */}
        <div className="flex w-full items-start gap-4 mb-6">
          <div className="flex flex-col items-center gap-2">
            <input
              type="file"
              className="hidden"
              id="profileImageInput"
              accept="image/*"
              onChange={handleImageChange}
            />

            <label htmlFor="profileImageInput" className="cursor-pointer group">
              <div className="w-21 h-21 rounded-full border-2 border-card overflow-hidden flex items-center justify-center bg-[var(--bg)] shadow-inner relative">
                {image ? (
                  <img src={image} className="w-full h-full object-cover" alt="Perfil" />
                ) : (
                  <span className="text-xs text-[#514442] font-medium">Sem Foto</span>
                )}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </label>

            <button
              className="mt-2 text-[10px] bg-card px-3 py-1 rounded-full hover:opacity-80 transition font-medium"
              onClick={() => document.getElementById("profileImageInput").click()}
            >
              Alterar Foto
            </button>
          </div>

          <div className="flex flex-col flex-1 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase ml-1 font-bold text-[#514442]/50">Nome</label>
              <input
                value={name}
                readOnly
                className="rounded-full px-3 py-3 bg-[var(--bg)] outline-none border border-transparent focus:border-card transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase ml-1 font-bold text-[#514442]/50">Telefone</label>
              <input
                value={phone}
                readOnly
                className="rounded-full px-3 py-3 bg-[var(--bg)] outline-none border border-transparent focus:border-card transition"
              />
            </div>
          </div>
        </div>

        {/* BOTÃO STATUS DO PEDIDO */}
        <button
          onClick={() => setShowOrder(!showOrder)}
          className="w-full mt-6 bg-card py-3 rounded-md font-bold flex items-center justify-between px-4 hover:brightness-95 transition"
        >
          <span>Status do Pedido</span>
          <FiChevronDown className={`transition-transform duration-300 ${showOrder ? "rotate-180" : ""}`} />
        </button>

        {/* DETALHES DO PEDIDO */}
        {hasOrder && showOrder && (
          <div className="mt-2 bg-[var(--bg)] rounded-md p-4 shadow-sm border border-black/5 animate-in fade-in slide-in-from-top-2">
            <h2 className="font-bold mb-2 text-primary border-b border-black/5 pb-1">Pedido Ativo</h2>

            <div className="text-sm space-y-1">
              <p>
                <strong>Curso:</strong> Informática
              </p>
              <p>
                <strong>Item:</strong> Pastel de Queijo
              </p>
              <p>
                <strong>Quantidade:</strong> 2
              </p>

              <div className="flex items-center gap-2 mt-3 bg-white/50 w-fit px-2 py-1 rounded-full">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse"></span>
                <span className="text-xs font-bold uppercase">Sendo preparado</span>
              </div>

              <div className="mt-3 pt-2 border-t border-black/5">
                <p>
                  <strong>Pagamento:</strong> Pix
                </p>
                <p className="text-lg font-bold text-primary">Total: R$ 10,00</p>
              </div>
            </div>
          </div>
        )}

        {/* BOTÃO EXCLUIR */}
        <label htmlFor="delete_modal" className="flex items-center justify-center gap-2 text-sm font-medium hover:text-[#D95032] transition mt-8 cursor-pointer opacity-70 hover:opacity-100">
          <FiTrash size={14} />
          <span>Excluir meu perfil</span>
        </label>
      </div>

      {/* MODAL DE CONFIRMAÇÃO (DaisyUI) */}
      <input type="checkbox" id="delete_modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box bg-[#F5E6C8] text-[#514442] border-2 border-[#D95032]/20">
          <h3 className="text-xl font-bold text-[#D95032]">Atenção!</h3>

          <p className="py-4 font-medium">Você tem certeza que deseja excluir seu perfil permanentemente? Esta ação não pode ser desfeita.</p>

          {hasOrder && (
            <div className="bg-[#D95032]/10 p-3 rounded-lg border border-[#D95032]/20 mb-4">
              <p className="text-[#D95032] text-sm font-bold">⚠️ Bloqueado: Você possui um pedido em andamento e não pode excluir a conta agora.</p>
            </div>
          )}

          <div className="modal-action">
            <label htmlFor="delete_modal" className="btn btn-ghost">Voltar</label>

            <button
              onClick={UserOut}
              disabled={hasOrder}
              className={`btn ${hasOrder ? "btn-disabled opacity-50" : "bg-[#D95032] hover:bg-[#b04028] text-white border-none"}`}
            >
              Confirmar Exclusão
            </button>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="delete_modal">Close</label>
      </div>
    </div>
  );
}
