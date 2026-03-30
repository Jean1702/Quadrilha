"use client";

import { useState } from "react";
import { CreateClient } from "../lib/supabase/client";
import { redirect } from "next/navigation";
import { FiTrash, FiChevronDown } from "react-icons/fi";

export default function User({ name, phone }) {
  const [image, setImage] = useState(null);
  const [showOrder, setShowOrder] = useState(true);
  const [hasOrder, setHasOrder] = useState(true);

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
    <div className="min-h-screen flex flex-col items-center justify-center">

      {/* CARD */}
      <div className="w-full max-w-sm bg-(--surface) rounded-[12px] p-6 shadow-lg border border-[#000]/5">

        <h1 className="text-2xl font-bold  text-center mb-6">
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
            <div className="w-24 h-24 rounded-full border-2 border-card overflow-hidden flex items-center justify-center bg-[var(--bg)] shadow">
              {image ? (
                <img src={image} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-[#514442]">Foto</span>
              )}
            </div>
          </label>

          <button
            className="mt-2 text-xs bg-card px-3 py-1 rounded-md hover:opacity-90"
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
            className="rounded-md px-4 py-3 bg-[var(--bg)] outline-none"
          />

          <input
            value={phone}
            readOnly
            className="rounded-md px-4 py-3 bg-[var(--bg)]  outline-none"
          />
        </div>

        {/* STATUS */}
        <button
          onClick={() => setShowOrder(!showOrder)}
          className="w-full mt-5 bg-card  py-3 rounded-md font-semibold flex items-center justify-between px-4"
        >
          <span>Status do Pedido</span>

          <FiChevronDown
            className={`transition-transform ${showOrder ? "rotate-180" : ""}`}
          />
        </button>

        {/* PEDIDO */}
        {hasOrder && showOrder && (
          <div className="mt-4 bg-[var(--bg)] rounded-md p-4 shadow-sm">
            <h2 className="font-bold mb-2 text-primary">
              Status do Pedido
            </h2>

            <p><strong>Curso:</strong> Informática</p>
            <p><strong>Item:</strong> Pastel de Queijo</p>
            <p><strong>Quantidade:</strong> 2</p>

            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-card"></span>
              <span>Sendo preparado</span>
            </div>

            <p className="mt-2"><strong>Pagamento:</strong> Pix</p>
            <p className="mt-2 font-bold">Total: R$ 10,00</p>
          </div>
        )}

        {/* EXCLUIR */}
        <label
          htmlFor="delete_modal"
          className="flex items-center justify-center gap-2  hover:text-[#D95032] transition mt-6 cursor-pointer"
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