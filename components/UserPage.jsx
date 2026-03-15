"use client";

import { useState } from "react";

export default function User() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showOrder, setShowOrder] = useState(false);

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] flex flex-col items-center p-6">

      {/* FOTO + INPUTS */}
      <div className="w-full max-w-md flex gap-6 mt-10">

        {/* FOTO */}
        <div className="flex flex-col items-center">

          <input
            type="file"
            className="hidden"
            id="profileImageInput"
            onChange={handleImageChange}
          />

          <label htmlFor="profileImageInput" className="cursor-pointer">
            <div className="w-20 h-20 rounded-full border-2 border-[#136066] overflow-hidden flex items-center justify-center bg-white shadow">
              {image ? (
                <img src={image} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-[#382924] text-center">
                  Adicionar Foto
                </span>
              )}
            </div>
          </label>

          <button
            className="mt-2 text-xs bg-[#136066] text-white px-3 py-1 rounded"
            onClick={() =>
              document.getElementById("profileImageInput").click()
            }
          >
            Editar Foto
          </button>

        </div>

        {/* INPUTS */}
        <div className="flex flex-col flex-1 gap-4">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            className="border border-[#136066] rounded-xl px-4 py-3 bg-[#F2F2F2]"
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefone"
            className="border border-[#136066] rounded-xl px-4 py-3 bg-[#F2F2F2]"
          />

        </div>
      </div>

      {/* BOTÃO STATUS (MEIO DA TELA) */}
      <div className="w-full max-w-md mt-30 flex justify-center">
        <button
          onClick={() => setShowOrder(!showOrder)}
          className="bg-[#136066] text-white px-29 py-4 rounded-xl hover:opacity-90 transition"
        >
          Status do Pedido
        </button>
      </div>

      {/* ABA DO PEDIDO */}
      {showOrder && (
        <div className="w-full max-w-md mt-6 border border-[#136066] rounded-xl p-6 bg-white shadow">

          <h2 className="font-bold text-lg mb-3 text-[#382924]">
            Status do Pedido
          </h2>

          <p><strong>Curso:</strong> Informática</p>

          <p><strong>Item:</strong> Pastel de Queijo</p>

          <p><strong>Quantidade:</strong> 2</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span>Sendo preparado</span>
          </div>

          <p className="mt-3">
            <strong>Pagamento:</strong> Pix
          </p>

          <p className="mt-3 font-bold">
            Total: R$ 10,00
          </p>

        </div>
      )}

      {/* ESPAÇO FLEX PARA EMPURRAR O BOTÃO PARA BAIXO */}
      <div className="flex-grow"></div>

      {/* BOTÃO EXCLUIR PERFIL (RODAPÉ) */}
      <button
        className="w-full max-w-md mb-50 bg-[#DB4B23] text-[#382924] py-3 rounded-xl text-lg shadow"
        onClick={() => {
          const confirmDelete = window.confirm(
            "Tem certeza que deseja excluir o perfil?"
          );

          if (confirmDelete) {
            setImage(null);
            setName("");
            setPhone("");
            alert("Perfil excluído com sucesso!");
          }
        }}
      >
        Excluir Perfil
      </button>

    </div>
  );
}