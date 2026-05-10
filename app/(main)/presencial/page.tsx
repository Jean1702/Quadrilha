"use client";

import { useState } from "react";
import { X } from "lucide-react";
import AdminHeaderPage from "@/components/AdminHeaderPage";
import AdminFooterPage from "@/components/AdminFooterPage";

export default function PedidoFisicoPage() {
  const [form, setForm] = useState({
    produto: "",
    hora: "",
    valor: "",
    quantidade: "",
  });

  const [pedidos, setPedidos] = useState([]);

  const handleEnviar = () => {
    if (!form.produto || !form.hora || !form.valor || !form.quantidade) return;

    setPedidos([
      { ...form, id: Date.now() },
      ...pedidos,
    ]);
    setForm({ produto: "", hora: "", valor: "", quantidade: "" });
  };

  const handleExcluir = (id) => {
    setPedidos(pedidos.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen p-4 overflow-x-hidden">
          <AdminHeaderPage titulo="controle de pedidos " />
      <div className="bg-[var(--surface)] p-6 rounded-[20px] shadow-lg mb-6 py-10 pt-100"></div>

      <div className="max-w-3xl mx-auto w-full">

        {/* Formulário */}
        <div className="bg-[var(--surface)] p-6 rounded-[20px] shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 tracking-tight">
            Registro de Pedido Físico
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="p-3 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm col-span-1 sm:col-span-2"
              placeholder="Nome do produto"
              value={form.produto}
              onChange={(e) => setForm({ ...form, produto: e.target.value })}
            />

            <input
              className="p-3 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
              type="time"
              placeholder="Hora da compra"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
            />

            <input
              className="p-3 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
              type="number"
              placeholder="Quantidade"
              min="1"
              value={form.quantidade}
              onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
            />

            <input
              className="p-3 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm col-span-1 sm:col-span-2"
              type="number"
              placeholder="Valor (R$)"
              step="0.01"
              min="0"
              value={form.valor}
              onChange={(e) => setForm({ ...form, valor: e.target.value })}
            />
          </div>

          <button
            onClick={handleEnviar}
            className="mt-4 w-full bg-[#026A4C] hover:bg-[#037a58] active:scale-95 text-white px-6 py-3 rounded-full font-semibold transition duration-300 shadow-md text-base"
          >
            Registrar Pedido
          </button>
        </div>

        {/* Cards de pedidos */}
        {pedidos.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 tracking-tight">
              Pedidos Registrados
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="relative bg-[var(--surface)] rounded-[20px] p-4 shadow-lg hover:shadow-xl transition duration-300"
                >
                  {/* Botão excluir */}
                  <button
                    onClick={() => handleExcluir(pedido.id)}
                    style={{ position: "absolute", top: "12px", right: "12px" }}
                    className="text-black dark:text-white hover:opacity-60 active:scale-95 transition duration-300"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Conteúdo */}
                  <div className="pr-7 space-y-1 text-sm">
                    <h3 className="text-base font-bold tracking-tight mb-2">
                      {pedido.produto}
                    </h3>
                    <p>
                      <span className="font-semibold">Hora:</span> {pedido.hora}
                    </p>
                    <p>
                      <span className="font-semibold">Quantidade:</span> {pedido.quantidade}
                    </p>
                    <p className="text-[#026A4C] font-semibold text-base mt-1">
                      R$ {parseFloat(pedido.valor).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pedidos.length === 0 && (
          <p className="text-center opacity-50 text-sm mt-4">
            Nenhum pedido registrado ainda.
          </p>
        )}

      </div>
       <AdminFooterPage />
    </div>
  );
}
