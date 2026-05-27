"use client";

import { useState, useEffect } from "react";
import { CreateClient } from "../lib/supabase/client"; 
import { useRouter } from "next/navigation"; 
import { FiLogOut, FiChevronDown } from "react-icons/fi"; 

const statusConfig = {
  aguardando_pagamento: { label: "Aguardando pagamento", color: "#D97016" },
  pago: { label: "Recebido", color: "#D97016" },
  sendo_feito: { label: "Em andamento", color: "#D95032" },
  pronto: { label: "Pronto", color: "#059b70" },
  entregue: { label: "Entregue", color: "#026A4C" }, 
  cancelado: { label: "Cancelado", color: "#D95032" },
};

export default function User({ name, phone, userId }) {
  // --- DECLARAÇÃO DE ESTADOS ---
  const [image, setImage] = useState(null); 
  const [pedidos, setPedidos] = useState([]); 
  const [expandedPedidos, setExpandedPedidos] = useState({}); 
  const [loading, setLoading] = useState(true); 
  const [showOrder, setShowOrder] = useState(true); 
  
  const router = useRouter(); 
  const supabase = CreateClient(); 

  // --- EFEITOS (USEEFFECT) ---
  useEffect(() => {
    const savedImage = localStorage.getItem("user_profile_image");
    if (savedImage) setImage(savedImage);

    let isMounted = true;

    // --- FUNÇÃO: BUSCAR PEDIDOS IGUAL AO NOTIFICATION ---
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        
        // 1. Pega o usuário autenticado no Supabase Auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error("Usuário não autenticado no Auth");
          if (isMounted) {
            setPedidos([]);
            setLoading(false);
          }
          return;
        }

        // 2. Busca o ID vinculado na tabela customizada 'usuarios' (igual feito na notification)
        const { data: usuario, error: usuarioError } = await supabase
          .from("usuarios")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (usuarioError && usuarioError.code !== "PGRST116") {
          console.error("Erro ao carregar usuário vinculado:", usuarioError);
        }

        // Se achar o id customizado usa ele, senão usa o do auth direto
        const idUsuarioPedido = usuario?.id || user.id;

        if (!isMounted) return;

        // 3. Faz a busca única trazendo a venda e os produtos associados
        const { data: vendasComProdutos, error } = await supabase
          .from("venda")
          .select(`
            idvenda,
            valor_total,
            metodo_pagamento,
            status,
            criada_em,
            atualizada_em,
            idturma,
            venda_produto (
              quantidade,
              produtos (*)
            )
          `)
          .eq("iduser", idUsuarioPedido) // Usa o ID correto aqui!
          .order("criada_em", { ascending: false });

        if (!isMounted) return;

        if (error) {
          console.error("Erro ao buscar vendas do usuário:", error?.message || error);
          return;
        }

        // 4. Formata os dados para o padrão que o seu JSX espera (.itens)
        const formatados = (vendasComProdutos || []).map(venda => {
          const itensFormatados = (venda.venda_produto || []).map(item => ({
            quantidade: item.quantidade,
            // Alinhado com a estrutura da tabela 'produtos' da sua página de notificação
            produto: item.produtos || { nome: "Item do pedido", preco: 0 }
          }));

          return {
            ...venda,
            itens: itensFormatados
          };
        });

        setPedidos(formatados);
      } catch (error) {
        console.error("Erro no fluxo de busca do usuário:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPedidos();
    
    // --- OUVINTE REALTIME ---
    const channel = supabase
      .channel("pedidos_usuario")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "venda" },
        () => {
          fetchPedidos();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // --- FUNÇÃO: ALTERAR E SALVAR FOTO DE PERFIL ---
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

  // --- FUNÇÃO: ABRIR / FECHAR UM CARD DE PEDIDO ---
  function togglePedido(id) {
    setExpandedPedidos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  // --- FUNÇÕES AUXILIARES ---
  function calcularTotalItens(itens) {
    return itens.reduce((total, item) => total + item.quantidade, 0);
  }

  function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // --- FUNÇÃO: SAIR DA CONTA ---
  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("user_profile_image");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
      alert("Erro ao tentar desconectar. Tente novamente.");
    }
  }

  // --- RENDERIZAÇÃO DA INTERFACE ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-(--surface) rounded-[12px] p-6 shadow-lg border border-black/5">
        
        <h1 className="text-2xl font-bold text-center mb-6 text-(--text)">
          Meu Perfil
        </h1>
        

        <table className="w-full border-collapse mb-6">
          <tbody>
            <tr>
              <td className="w-24 align-middle pr-4 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <input
                    type="file"
                    className="hidden"
                    id="profileImageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <label htmlFor="profileImageInput" className="cursor-pointer group">
                    <div className="w-21 h-21 rounded-full border-2 border-card overflow-hidden flex items-center justify-center bg-(--bg) shadow-inner relative">
                      {image ? (
                        <img src={image} className="w-full h-full object-cover" alt="Perfil" />
                      ) : (
                        <span className="text-xs text-(--text) opacity-70 font-medium">Sem Foto</span>
                      )}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </label>

                  <button
                    className="mt-1 text-[10px] bg-card px-3 py-1 rounded-full hover:opacity-80 transition font-medium whitespace-nowrap"
                    onClick={() => document.getElementById("profileImageInput").click()}
                  >
                    Alterar Foto
                  </button>
                </div>
              </td>

              <td className="align-middle">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase ml-1 font-bold text-(--text) opacity-50">Nome</label>
                    <input value={name} readOnly className="w-full rounded-full px-3 py-3 bg-(--bg) text-(--text) outline-none border border-transparent" />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase ml-1 font-bold text-(--text) opacity-50">Telefone</label>
                    <input value={phone} readOnly className="w-full rounded-full px-3 py-3 bg-(--bg) text-(--text) outline-none border border-transparent" />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <button
          onClick={() => setShowOrder(!showOrder)}
          className="w-full mt-6 bg-card py-3 rounded-md font-bold flex items-center justify-between px-4 hover:brightness-95 transition"
        >
          <span>Status dos Pedidos</span>
          <FiChevronDown className={`transition-transform duration-300 ${showOrder ? "rotate-180" : ""}`} />
        </button>

        {showOrder && (
          <div className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-card"></div>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="bg-(--bg) rounded-md p-6 text-center border border-black/5">
                <p className="text-(--text) opacity-70">Você ainda não fez nenhum pedido.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pedidos.map((pedido) => {
                  const st = statusConfig[pedido.status] || statusConfig.pago;
                  const isExpanded = expandedPedidos[pedido.idvenda];
                  const totalItens = calcularTotalItens(pedido.itens);

                  return (
                    <div key={pedido.idvenda} className="bg-(--bg) rounded-md border border-black/5 overflow-hidden shadow-sm">
                      <button
                        onClick={() => togglePedido(pedido.idvenda)}
                        className="w-full p-4 flex items-center justify-between hover:bg-black/2 transition"
                      >
                        <div className="flex items-center gap-3 text-left flex-1">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: st.color }}></div>
                            <span className="text-xs font-bold text-(--text) opacity-60">#{pedido.idvenda}</span>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-(--text)">{st.label}</span>
                              <span className="text-xs text-(--text) opacity-60">
                                ({totalItens} {totalItens === 1 ? "item" : "itens"})
                              </span>
                            </div>
                            <p className="text-xs text-(--text) opacity-60">{formatarData(pedido.criada_em)}</p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-primary">R$ {parseFloat(pedido.valor_total).toFixed(2)}</p>
                            <p className="text-xs text-(--text) opacity-60">{pedido.metodo_pagamento}</p>
                          </div>
                        </div>

                        <FiChevronDown className={`ml-2 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      {isExpanded && (
                        <div className="border-t border-black/5 bg-black/2 p-4 space-y-3">
                          <div>
                            <h4 className="font-bold text-sm mb-2 text-(--text)">Itens</h4>
                            <div className="space-y-2">
                              {pedido.itens.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm bg-(--surface) p-2 rounded">
                                  <div>
                                    <p className="font-medium text-(--text)">
                                      {item.produto?.nome || "Produto não encontrado"}
                                    </p>
                                    <p className="text-xs text-(--text) opacity-60">Qtd: {item.quantidade}</p>
                                  </div>
                                  <p className="font-bold text-primary">
                                    {item.produto?.preco 
                                      ? `R$ ${(item.produto.preco * item.quantidade).toFixed(2)}` 
                                      : "—"
                                    }
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-black/5">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: st.color }}></div>
                              <span className="text-xs font-bold uppercase text-(--text) opacity-70">{st.label}</span>
                            </div>
                            <p className="text-xs text-(--text) opacity-60 mt-1">
                              Atualizado em {formatarData(pedido.atualizada_em || pedido.criada_em)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-red-500 transition mt-8 opacity-80"
        >
          <FiLogOut size={16} />
          <span>Sair da conta</span>
        </button>

      </div>
    </div>
  );
}