"use client";

import { useState } from "react";
import AdminFooterPage from "@/components/AdminFooterPage";
import AdminHeaderPage from "@/components/AdminHeaderPage";
import { ChefHat, Check, X } from "lucide-react";

const pedidosIniciais = [
  {
    id: 1,
    nomePedido: "Pedido #001",
    cliente: "João Silva",
    quantidade: 2,
    itens: ["X-Burguer", "Batata Frita"],
    status: "pendente"
  },
  {
    id: 2,
    nomePedido: "Pedido #002",
    cliente: "Maria Santos",
    quantidade: 3,
    itens: ["Pizza Margherita", "Refrigerante", "Sobremesa"],
    status: "pendente"
  },
  {
    id: 3,
    nomePedido: "Pedido #003",
    cliente: "Pedro Oliveira",
    quantidade: 1,
    itens: ["Salada Caesar"],
    status: "pendente"
  },
];

const statusConfig = {
  pendente:    { label: "Pendente",   cor: "#D97016" },
  preparando:  { label: "Preparando", cor: "#026A4C" },
  pronto:      { label: "Pronto",     cor: "#026A4C" },
  cancelado:   { label: "Cancelado",  cor: "#D95032" },
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState(pedidosIniciais);

  const atualizarStatus = (id, novoStatus) => {
    setPedidos(pedidos.map((p) => p.id === id ? { ...p, status: novoStatus } : p));
  };

  return (
    <main className="min-h-screen pb-24">
      <AdminHeaderPage titulo="PEDIDOS" />
      <div className="h-32"></div>

      <div className="p-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pedidos.map((pedido) => {
            const st = statusConfig[pedido.status];
            const cancelado = pedido.status === "cancelado";

            return (
              <div
                key={pedido.id}
                className="bg-[var(--surface)] rounded-[20px] p-4 shadow-lg hover:shadow-xl transition duration-300"
              >
                {/* Cabeçalho com nome e badge de status */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold tracking-tight">{pedido.nomePedido}</h3>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: st.cor }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: st.cor }}
                    >
                      {st.label}
                    </span>
                  </div>
                </div>

                {/* Detalhes do pedido */}
                <div className="space-y-1 mb-4 text-sm">
                  <p><span className="font-semibold">Cliente:</span> {pedido.cliente}</p>
                  <p><span className="font-semibold">Quantidade:</span> {pedido.quantidade}</p>
                  <div>
                    <span className="font-semibold">Itens:</span>
                    <ul className="list-disc list-inside ml-2 opacity-60">
                      {pedido.itens.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Botões de ação */}
                {!cancelado && (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => atualizarStatus(pedido.id, "preparando")}
                        disabled={pedido.status === "preparando" || pedido.status === "pronto"}
                        className="flex-1 flex items-center justify-center gap-1 bg-[#026A4C] hover:bg-[#037a58] active:scale-95 text-white py-2 px-3 rounded-full font-medium transition duration-300 shadow-md text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                      >
                        <ChefHat className="h-4 w-4" />
                        Preparar
                      </button>
                      <button
                        onClick={() => atualizarStatus(pedido.id, "pronto")}
                        disabled={pedido.status === "pendente" || pedido.status === "pronto"}
                        className="flex-1 flex items-center justify-center gap-1 bg-[#026A4C] hover:bg-[#037a58] active:scale-95 text-white py-2 px-3 rounded-full font-medium transition duration-300 shadow-md text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                      >
                        <Check className="h-4 w-4" />
                        Pronto
                      </button>
                    </div>
                    <button
                      onClick={() => atualizarStatus(pedido.id, "cancelado")}
                      className="w-full flex items-center justify-center gap-1 bg-[#D95032] hover:bg-[#E05A3F] active:scale-95 text-white py-2 rounded-full font-medium transition duration-300 shadow-md text-sm"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AdminFooterPage />
    </main>
  );
}
