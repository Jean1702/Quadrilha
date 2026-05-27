"use client";

import { useEffect, useState } from "react";
import { Bell, ChefHat, Clock3, PackageCheck, CircleAlert } from "lucide-react";
import { CreateClient } from "@/lib/supabase/client";

  

const statusConfig = {
  aguardando_pagamento: {
    label: "Aguardando pagamento",
    description: "O pagamento ainda está sendo confirmado.",
    icon: Clock3,
    color: "#D97016",
  },
  pago: {
    label: "Recebido",
    description: "Seu pedido entrou na fila de preparo.",
    icon: Clock3,
    color: "#D97016",
  },
  sendo_feito: {
    label: "Em andamento",
    description: "O pedido já está sendo preparado.",
    icon: ChefHat,
    color: "#026A4C",
  },
  pronto: {
    label: "Pronto para retirada",
    description: "Seu pedido já pode ser retirado.",
    icon: PackageCheck,
    color: "#026A4C",
  },
  entregue: {
    label: "Entregue",
    description: "Esse pedido já foi finalizado.",
    icon: PackageCheck,
    color: "#D95032",
  },
  cancelado: {
    label: "Cancelado",
    description: "Esse pedido foi cancelado.",
    icon: CircleAlert,
    color: "#D95032",
  },
};

const orderStatus = ["sendo_feito", "pronto", "pago", "aguardando_pagamento", "entregue", "cancelado"];

export default function NotificationPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = CreateClient();
    let isMounted = true;

    const carregarPedidos = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (!user) {
        setPedidos([]);
        setLoading(false);
        return;
      }

      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (usuarioError && usuarioError.code !== "PGRST116") {
        console.error("Erro ao carregar usuário vinculado:", usuarioError);
      }

      const idUsuarioPedido = usuario?.id || user.id;

      const { data: pedidosVinculados, error: errorVinculado } = await supabase
        .from("venda")
        .select(`
          idvenda,
          iduser,
          status,
          criada_em,
          atualizada_em,
          valor_total,
          metodo_pagamento,
          online,
          usuarios (*),
          venda_produto (
            quantidade,
            observacao,
            produtos (*)
          )
        `)
        .eq("iduser", idUsuarioPedido)
        .order("criada_em", { ascending: false })
        .neq('status', 'entregue');

      const { data: pedidosLegados, error: errorLegado } = await supabase
        .from("venda")
        .select(`
          idvenda,
          iduser,
          status,
          criada_em,
          atualizada_em,
          valor_total,
          metodo_pagamento,
          online,
          usuarios (*),
          venda_produto (
            quantidade,
            observacao,
            produtos (*)
          )
        `)
        .eq("iduser", user.id)
        .order("criada_em", { ascending: false });

      if (!isMounted) return;

      if (errorVinculado) {
        console.error("Erro ao carregar notificações:", error);
      }

      if (errorLegado) {
        console.error("Erro ao carregar notificações legadas:", errorLegado);
      }

      const pedidosCombinados = [...(pedidosVinculados || []), ...(pedidosLegados || [])].filter(
        (pedido, index, array) => index === array.findIndex((item) => item.idvenda === pedido.idvenda)
      );

      setPedidos(pedidosCombinados);

      setLoading(false);
    };

    carregarPedidos();

    const channel = supabase
      .channel("notification_pedidos")
      .on("postgres_changes", { event: "*", schema: "public", table: "venda" }, () => {
        carregarPedidos();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const pedidosAtivos = pedidos.filter((pedido) => orderStatus.includes(pedido.status));

  const pedidosEmAndamento = pedidosAtivos.filter((pedido) => pedido.status === "sendo_feito");
  const pedidosProntos = pedidosAtivos.filter((pedido) => pedido.status === "pronto");

  return (
    <main className="min-h-screen px-4 py-6 pb-24">
      <div className="max-w-3xl mx-auto space-y-4">
        <section className="bg-(--surface) rounded-[24px] p-5 shadow-lg border border-black/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-(--bg) flex items-center justify-center shadow-inner">
              <Bell className="text-(--footer)" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Notificações do pedido</h1>
              <p className="text-sm opacity-70">Acompanhe quando o pedido estiver em andamento e pronto para retirada.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-2xl bg-(--bg) p-4">
              <p className="text-[11px] uppercase tracking-wider opacity-60 font-bold">Em andamento</p>
              <p className="text-2xl font-black mt-1">{pedidosEmAndamento.length}</p>
            </div>
            <div className="rounded-2xl bg-(--bg) p-4">
              <p className="text-[11px] uppercase tracking-wider opacity-60 font-bold">Prontos</p>
              <p className="text-2xl font-black mt-1">{pedidosProntos.length}</p>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="bg-(--surface) rounded-[24px] p-5 shadow-lg border border-black/5">
            <p className="text-sm opacity-70">Carregando pedidos...</p>
          </section>
        ) : pedidosAtivos.length === 0 ? (
          <section className="bg-(--surface) rounded-[24px] p-5 shadow-lg border border-black/5">
            <p className="font-semibold">Nenhuma notificação no momento.</p>
            <p className="text-sm opacity-70 mt-1">Se o pedido já foi enviado, ele aparecerá aqui com o status correto.</p>
          </section>
        ) : (
          <section className="space-y-3">
            {pedidosAtivos.map((pedido) => {
              const statusInfo = statusConfig[pedido.status] || statusConfig.pago;
              const StatusIcon = statusInfo.icon;
              const itens = pedido.venda_produto || [];

              return (
                <article key={pedido.idvenda} className="bg-(--surface) rounded-[24px] p-5 shadow-lg border border-black/5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] opacity-50 font-bold">Pedido</p>
                      <h2 className="text-xl font-bold tracking-tight">#{pedido.idvenda}</h2>
                    </div>

                    <div className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-(--bg)">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusInfo.color }} />
                      <StatusIcon size={14} style={{ color: statusInfo.color }} />
                      <span className="text-xs font-bold" style={{ color: statusInfo.color }}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm opacity-80">{statusInfo.description}</p>

                  <div className="mt-4 grid gap-3 text-sm">
                    <div className="rounded-2xl bg-(--bg) p-4">
                      <p className="text-[11px] uppercase tracking-wider opacity-60 font-bold mb-1">Itens</p>
                      <ul className="space-y-1">
                        {itens.map((item, index) => (
                          <li key={`${pedido.idvenda}-${index}`} className="flex items-center justify-between gap-3">
                            <span className="font-medium">{item.produtos?.nome || "Item do pedido"}</span>
                            <span className="opacity-70">x{item.quantidade || 1}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-(--bg) p-4">
                        <p className="text-[11px] uppercase tracking-wider opacity-60 font-bold">Pagamento</p>
                        <p className="font-semibold mt-1">{pedido.metodo_pagamento || "Não informado"}</p>
                      </div>
                      <div className="rounded-2xl bg-(--bg) p-4">
                        <p className="text-[11px] uppercase tracking-wider opacity-60 font-bold">Total</p>
                        <p className="font-semibold mt-1">R$ {Number(pedido.valor_total || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}