"use client";

import { useState } from "react";
import { CreateClient } from "../lib/supabase/client";
import { redirect } from "next/navigation";
import { FiTrash, FiChevronDown } from "react-icons/fi";

export default function User({ name, phone }) {
  const [image, setImage] = useState(null);
  const [showOrder, setShowOrder] = useState(true);
  const [hasOrder, setHasOrder] = useState(false);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }

  async function UserOut() {
    if (hasOrder) return;

    const supabase = await CreateClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center ">

      <div className="w-full max-w-md bg-[var(--surface)] backdrop-blur-md rounded-[12px] p-6 shadow-lg border border-white/20">

        <h1 className="text-2xl font-bold text-center mb-6">
          Meu Perfil
        </h1>

        {/* FOTO */}
        <div className="flex flex-col items-center mb-6">
          <input
            type="file"
            className="hidden"
            id="profileImageInput"
            onChange={handleImageChange}
          />

          <label htmlFor="profileImageInput" className="cursor-pointer">
            <div className="w-24 h-24 rounded-full border-2 border-text overflow-hidden flex items-center justify-center bg-[var(--bg)]">
              {image ? (
                <img src={image} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-center">
                  Foto
                </span>
              )}
            </div>
          </label>

          <button
            className="mt-2 text-xs bg-card px-3 py-1 rounded"
            onClick={() =>
              document.getElementById("profileImageInput").click()
            }
          >
            Editar
          </button>
        </div>

        {/* INPUTS */}
        <div className="flex flex-col gap-3">
          <input
            value={name}
            readOnly
            className="rounded-xl px-4 py-3 border border-[var(--text)] outline-none"
          />

          <input
            value={phone}
            readOnly
            className="rounded-xl px-4 py-3 placeholder: border border-[var(--text)] outline-none"
          />
        </div>

        {/* STATUS */}
        <button
          onClick={() => setShowOrder(!showOrder)}
          className="w-full mt-6 bg-card text-black py-3 rounded-xl font-semibold flex items-center justify-between px-4"
        >
          <span>Status do Pedido</span>

          <FiChevronDown
            className={`transition-transform ${showOrder ? "rotate-180" : ""}`}
          />
        </button>

        {/* PEDIDO */}
        {showOrder && (
          <div className="mt-6 bg-[var(--bg)] rounded-xl p-4 ">
            <h2 className="font-bold mb-2">Status do Pedido</h2>

            <p><strong>Curso:</strong> Informática</p>
            <p><strong>Item:</strong> Pastel de Queijo</p>
            <p><strong>Quantidade:</strong> 2</p>

            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-[#D97016]"></span>
              <span>Sendo preparado</span>
            </div>

            <p className="mt-2"><strong>Pagamento:</strong> Pix</p>
            <p className="mt-2 font-bold">Total: R$ 10,00</p>
          </div>
        )}
        )}

        {/* LOGOUT */}
        <button
          onClick={UserOut}
          className="flex items-center gap-1 text-xl  hover:text-red-500 transition mt-6"
        >
          <FiTrash />
          <span>Excluir perfil</span>
        </label>
      </div>


      {/* MODAL */}
      <input type="checkbox" id="delete_modal" className="modal-toggle" />

      <div className="modal" role="dialog">
        <div className="modal-box bg-[#F5E6C8] text-[#514442]">
          <h3 className="text-lg font-bold text-[#D95032]">
            Excluir perfil
          </h3>

          <p className="py-4">
            Tem certeza que deseja excluir seu perfil?
          </p>

          {hasOrder && (
            <p className="text-[#D95032] text-sm mb-2">
              Você possui um pedido em andamento.
            </p>
          )}

          <div className="flex justify-end gap-3">
            <label htmlFor="delete_modal" className="btn">
              Cancelar
            </label>

            <button
              onClick={UserOut}
              disabled={hasOrder}
              className="btn bg-[#D95032] text-white"
            >
              Confirmar
            </button>
          </div>
        </div>

        <label className="modal-backdrop" htmlFor="delete_modal" />
      </div>
    </div>
  );
}