"use client";

import { useState } from "react";
import { CreateClient } from "../lib/supabase/client";
import { redirect } from "next/navigation";
import { FiTrash } from "react-icons/fi";

export default function User({ name, phone }) {
  const [image, setImage] = useState(null);
  const [showOrder, setShowOrder] = useState(true);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }

async function UserOut() {
  const confirmDelete = confirm("Tem certeza que deseja excluir seu perfil?");

  if (!confirmDelete) return;

  // 🔒 verifica pedido pendente
  const hasPendingOrder = showOrder; // usando seu estado atual

  if (hasPendingOrder) {
    alert("Você possui um pedido em andamento e não pode excluir o perfil.");
    return;
  }

  const supabase = await CreateClient();
  await supabase.auth.signOut();
  redirect("/login");
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#5E7A5F] to-[#136066]">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">

        <h1 className="text-2xl font-bold text-white text-center mb-6">
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
            <div className="w-24 h-24 rounded-full border-2 border-white overflow-hidden flex items-center justify-center bg-white/20">
              {image ? (
                <img src={image} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-white text-center">
                  Foto
                </span>
              )}
            </div>
          </label>

          <button
            className="mt-2 text-xs bg-[#F2A007] text-black px-3 py-1 rounded"
            onClick={() =>
              document.getElementById("profileImageInput").click()
            }
          >
            Editar
          </button>
        </div>

        {/* INPUTS */}
        <div className="flex flex-col gap-4">
          <input
            value={name}
            readOnly
            className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white outline-none"
          />

          <input
            value={phone}
            readOnly
            className="rounded-xl px-4 py-3 bg-white/20 text-white placeholder-white outline-none"
          />
        </div>

        {/* BOTÃO STATUS */}
        <button
          onClick={() => setShowOrder(!showOrder)}
          className="w-full mt-6 bg-[#F2A007] text-black py-3 rounded-xl font-semibold flex items-center justify-between px-4"
        >
          <span>Status do Pedido</span>
          <span className={`transition-transform ${showOrder ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>

        {/* PEDIDO */}
        {/* {showOrder && (
          <div className="mt-6 bg-white rounded-xl p-4 text-[#382924]">
            <h2 className="font-bold mb-2">Status do Pedido</h2>

            <p><strong>Curso:</strong> Informática</p>
            <p><strong>Item:</strong> Pastel de Queijo</p>
            <p><strong>Quantidade:</strong> 2</p>

            <div className="flex items-center gap-2 mt-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span>Sendo preparado</span>
            </div>

            <p className="mt-2"><strong>Pagamento:</strong> Pix</p>
            <p className="mt-2 font-bold">Total: R$ 10,00</p>
          </div>
        )} */}

        {/* LOGOUT */}
        <button
          onClick={UserOut}
          className="flex items-center gap-1 text-xl text-white hover:text-red-500 transition mt-6"
        >
          <FiTrash />
          <span>Excluir perfil</span>
        </button>
      </div>
    </div>
  );
}