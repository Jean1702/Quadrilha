"use client";

import { useEffect, useState } from "react";
import AdminHeaderPage from "@/components/AdminHeaderPage";
import ConfirmationModal from "@/components/ConfirmationModal";
import { CreateClient } from "@/lib/supabase/client";
import { ChefHat, Check, X, PackageCheck } from "lucide-react";

const statusConfig = {
  pago:        { label: "Pendente",   cor: "#D97016" },
  sendo_feito: { label: "Preparando", cor: "#026A4C" },
  pronto:      { label: "Pronto",     cor: "#026A4C" },
  entregue:    { label: "Entregue",   cor: "#026A4C" },
  cancelado:   { label: "Cancelado",  cor: "#D95032" },
};

export default function PedidosPage({ vendas, adminData }) {
  const [pedidosatual, setPedidosatual] = useState(vendas);
  const supabase = CreateClient();

  const [modalState, setModalState] = useState({
    isOpen: false,
    pedidoId: null,
    isLoading: false,
  });

  useEffect(() => {
    if (!adminData) return;

    const configvendas = {
      event: '*',
      schema: 'public',
      table: 'venda',
    };

    if (!adminData.is_superadmin && adminData.idturma) {
      configvendas.filter = `idturma=eq.${adminData.idturma}`;
    }

    const channel = supabase
      .channel('realtime_pedidos')
      .on('postgres_changes', configvendas, (payload) => {
        const updatedPedido = payload.new;
        setPedidosatual((prev) => {
          const index = prev.findIndex((p) => p.idvenda === updatedPedido.idvenda);
          if (index !== -1) {
            const updatedPedidos = [...prev];
            updatedPedidos[index] = { ...updatedPedidos[index], ...updatedPedido };
            return updatedPedidos;
          }
          return prev;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [vendas]);

  const atualizarStatus = async (id, novoStatus, user) => {
    const response = await fetch(`/api/pedidos/atualizacao_status?id=${id}&status=${novoStatus}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({phone: user.phone, name: user.name })
    });
    if (!response.ok) {
      console.error("Erro ao atualizar status do pedido:", response.statusText);
    } else {
      await response.json();
      const statusParaTela = novoStatus === "preparando" ? "sendo_feito" : novoStatus;
      setPedidosatual(prev => prev.map((p) => p.idvenda === id ? { ...p, status: statusParaTela } : p));
    }
  };

  const handleCancelarClick = (idvenda) => {
    setModalState({ isOpen: true, pedidoId: idvenda, isLoading: false });
  };

  const confirmCancelar = async () => {
    setModalState(prev => ({ ...prev, isLoading: true }));
    await atualizarStatus(modalState.pedidoId, "cancelado");
    setModalState({ isOpen: false, pedidoId: null, isLoading: false });
  };

  return (
    <main className="min-h-screen pb-28">
      <AdminHeaderPage titulo="PEDIDOS"  nometurma={adminData.turma?.nomecurso || `SUPER ADM`} anoturma={adminData.turma?.ano || 'mod'} logo={adminData.turma?.logo || '/hackerman.png'}  />
      <div className="h-40"></div>

      <div className="p-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pedidosatual.map((pedido) => {
            const st = statusConfig[pedido.status];
            const cancelado = pedido.status === "cancelado";
            const entregue = pedido.status === "entregue";
            return (
              <div
                key={pedido.idvenda}
                className="bg-(--surface) rounded-[20px] p-4 shadow-lg hover:shadow-xl transition duration-300"
              >
                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold tracking-tight">Pedido #{pedido.idvenda}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: st.cor }} />
                    <span className="text-xs font-semibold" style={{ color: st.cor }}>
                      {st.label}
                    </span>
                  </div>
                </div>

                {/* Detalhes */}
                <div className="space-y-1 mb-4 text-sm">
                  <p><span className="font-semibold">Cliente:</span> {pedido.usuarios?.name || 'Administrador'}</p>
                  <p><span className="font-semibold">Quantidade:</span> {pedido.venda_produto?.[0]?.quantidade ?? 0}</p>
                  <div>
                    <span className="font-semibold">Itens:</span>
                    <ul className="list-disc list-inside ml-2 opacity-60">
                      {pedido.venda_produto?.map((item) => (
                        <li key={item.produtos.idproduto}>{item.produtos?.nome} {item.observacao ? `(${item.observacao})`: ""}</li>
                      ))}
                      
                    </ul>
                  </div>
                </div>

                {/* Botões de ação */}
                {!cancelado && !entregue && (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => atualizarStatus(pedido.idvenda, "preparando", pedido.usuarios)}
                        disabled={pedido.status === "sendo_feito" || pedido.status === "pronto" || pedido.status === "entregue"}
                        className="flex-1 flex items-center justify-center gap-1 bg-[#026A4C] hover:bg-[#037a58] active:scale-95 text-white py-2 px-3 rounded-full font-medium transition duration-300 shadow-md text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                      >
                        <ChefHat className="h-4 w-4" />
                        Preparar
                      </button>
                      <button
                        onClick={() => atualizarStatus(pedido.idvenda, "pronto", pedido.usuarios)}
                        disabled={pedido.status === "pago" || pedido.status === "pronto" || pedido.status === "entregue"}
                        className="flex-1 flex items-center justify-center gap-1 bg-[#026A4C] hover:bg-[#037a58] active:scale-95 text-white py-2 px-3 rounded-full font-medium transition duration-300 shadow-md text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                      >
                        <Check className="h-4 w-4" />
                        Pronto
                      </button>
                    </div>
                    <button 
                      onClick={() => atualizarStatus(pedido.idvenda, "entregue", pedido.usuarios)}
                      disabled={pedido.status !== "pronto"}
                      className="flex-1 flex items-center justify-center gap-1 bg-[#026A4C] hover:bg-[#037a58] active:scale-95 text-white py-2 px-3 rounded-full font-medium transition duration-300 shadow-md text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                      <PackageCheck />
                      Entregue
                    </button>
                    <button
                      onClick={() => atualizarStatus(pedido.idvenda, "cancelado", pedido.usuarios)}
                      disabled={pedido.status === "entregue"}
                      className="w-full flex items-center justify-center gap-1 bg-[#D95032] hover:bg-[#E05A3F] active:scale-95 text-white py-2 rounded-full font-medium transition duration-300 shadow-md text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                      <X className="h-4 w-4" />
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {pedidosatual.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">Nenhum pedido encontrado.</p>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        title="Cancelar Pedido"
        message={`Tem certeza que deseja cancelar o Pedido #${modalState.pedidoId}? Esta ação não pode ser desfeita.`}
        actionType="cancel"
        onConfirm={confirmCancelar}
        onCancel={() => setModalState({ isOpen: false, pedidoId: null, isLoading: false })}
        isLoading={modalState.isLoading}
      />
    </main>
  );
}