"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AdminHeaderPage from "@/components/AdminHeaderPage";
import ConfirmationModal from "@/components/ConfirmationModal";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function PedidoFisicoPage({ vendas, admindata, produtos }) {
  const [vendasatual, setVendasatual] = useState(vendas);
  const [produtosLoja, setProdutosLoja] = useState(produtos);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroMetodo, setFiltroMetodo] = useState("todos");
  const idturma = admindata.idturma;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filtroTexto, filtroTipo, filtroMetodo]);

  useEffect(() => {
    const agora = new Date();
    const timezoneOffset = agora.getTimezoneOffset() * 60000;
    const dataLocal = new Date(agora.getTime() - timezoneOffset);
    const formatoExigido = dataLocal.toISOString().slice(0, 16);
    setForm(prev => ({ ...prev, dataehora: formatoExigido }));
  }, []);

  const [form, setForm] = useState({
    dataehora: "",
    metodo: "",
  });

  const [produtoAtual, setProdutoAtual] = useState("");
  const [quantidadeAtual, setQuantidadeAtual] = useState(1);
  const [itensPedido, setItensPedido] = useState([]);

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    pedidoId: null,
    isLoading: false,
  });

  const formatarData = (dataIso) => {
    if (!dataIso) return "";
    const data = new Date(dataIso);
    const formatoBr = data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    return formatoBr.replace(',', ' às');
  };

  const handleAdicionarProduto = () => {
    if (!produtoAtual || quantidadeAtual < 1) return;
    const produtoEncontrado = produtosLoja.find(p => p.idproduto === parseInt(produtoAtual));
    if (produtoEncontrado) {
      const novoItem = {
        id: produtoEncontrado.idproduto,
        nome: produtoEncontrado.nome,
        preco: produtoEncontrado.preco,
        quantidade: parseInt(quantidadeAtual),
        subtotal: produtoEncontrado.preco * parseInt(quantidadeAtual)
      };
      setItensPedido([...itensPedido, novoItem]);
      setProdutoAtual("");
      setQuantidadeAtual(1);
    }
  };

  const handleRemoverProduto = (index) => {
    const novaLista = [...itensPedido];
    novaLista.splice(index, 1);
    setItensPedido(novaLista);
  };

  const valorTotal = itensPedido.reduce((acc, item) => acc + item.subtotal, 0);

  const pedidosFiltrados = vendasatual.filter((pedido) => {
    const nomesProdutos = pedido.venda_produto.map(p => p.produtos?.nome || "").join(" ").toLowerCase();
    const matchTexto =
      nomesProdutos.includes(filtroTexto.toLowerCase()) ||
      pedido.idvenda.toString().includes(filtroTexto);

    const matchTipo =
      filtroTipo === "todos" ||
      (filtroTipo === "online" && pedido.online) ||
      (filtroTipo === "presencial" && !pedido.online);

    const matchMetodo =
      filtroMetodo === "todos" ||
      pedido.metodo_pagamento === filtroMetodo;

    return matchTexto && matchTipo && matchMetodo;
  });

  const totalPages = Math.ceil(pedidosFiltrados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const pedidosPaginados = pedidosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  // Abre modal de confirmação de registro
  const handleRegistrarClick = () => {
    if (!form.metodo || itensPedido.length === 0) return;
    setModalState({ isOpen: true, type: 'add', pedidoId: null, isLoading: false });
  };

  // Confirma e envia o pedido
  const confirmRegistrar = async () => {
    setModalState(prev => ({ ...prev, isLoading: true }));
    const pedidoData = {
      itensPedido,
      dataehora: form.dataehora,
      metodo: form.metodo,
      valor: valorTotal,
    };
    try {
      const response = await fetch(`/api/pedidos/inserir?idturma=${idturma}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoData),
      });
      if (response.ok) {
        setItensPedido([]);
        setForm(prev => ({ ...prev, metodo: "" }));
        setModalState({ isOpen: false, type: null, pedidoId: null, isLoading: false });
      } else {
        setModalState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      console.error(err);
      setModalState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Abre modal de confirmação de exclusão
  const handleExcluirClick = (idvenda) => {
    setModalState({ isOpen: true, type: 'delete', pedidoId: idvenda, isLoading: false });
  };

  // Confirma e deleta o pedido
  const confirmExcluir = async () => {
    setModalState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`/api/pedidos/deletar?id=${modalState.pedidoId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setVendasatual(prev => prev.filter(p => p.idvenda !== modalState.pedidoId));
        setModalState({ isOpen: false, type: null, pedidoId: null, isLoading: false });
      } else {
        setModalState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (err) {
      console.error(err);
      setModalState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen pb-28">
      <AdminHeaderPage titulo="PEDIDOS FÍSICOS" nometurma={admindata.turma?.nomecurso || 'SUPER ADM'} anoturma={admindata.turma?.ano || 'mod'} logo={admindata.turma?.logo || '/hackerman.png'} />
      <div className="h-40"></div>

      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-(--surface) p-6 rounded-[20px] shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-6 tracking-tight">
            Registro de Pedido Físico
          </h2>


          <div className="mb-6 p-4 border border-gray-300/30 rounded-2xl bg-black/10">
            <h3 className="text-sm font-medium mb-3 opacity-80">Adicionar Itens ao Pedido</h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <select
                value={produtoAtual}
                onChange={(e) => setProdutoAtual(e.target.value)}
                className="p-3 rounded-full border bg-(--bg) border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm col-span-1 sm:col-span-3"
              >
                <option value="" disabled>Selecione um produto...</option>
                {produtosLoja.map(produto => (
                  <option key={produto.idproduto} value={produto.idproduto}>
                    {produto.nome} - R$ {produto.preco.toFixed(2)}
                  </option>
                ))}
              </select>

              <input
                className="p-3 rounded-full border bg-(--bg) border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm col-span-1"
                type="number"
                placeholder="Qtd"
                min="1"
                value={quantidadeAtual}
                onChange={(e) => setQuantidadeAtual(e.target.value)}
              />
            </div>

            <button
              onClick={handleAdicionarProduto}
              type="button"
              className="mt-3 w-full sm:w-auto bg-transparent border border-[#D97016] text-[#D97016] hover:bg-[#D97016] hover:text-white px-5 py-2 rounded-full font-medium transition duration-300 text-sm"
            >
              + Adicionar Produto
            </button>
          </div>


          {itensPedido.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2 opacity-80">Itens do Pedido:</h3>
              <ul className="space-y-2">
                {itensPedido.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-(--bg) p-3 rounded-lg border border-gray-300/20 text-sm">
                    <span><span className="font-bold">{item.quantidade}x</span> {item.nome}</span>
                    <div className="flex items-center gap-4">
                      <span>R$ {item.subtotal.toFixed(2)}</span>
                      <button onClick={() => handleRemoverProduto(index)} className="text-red-500 hover:text-red-700 font-bold" title="Remover item">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-300/20">
            <input
              className="p-3 rounded-full border bg-(--bg) border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
              type="datetime-local"
              value={form.dataehora}
              onChange={(e) => setForm({ ...form, dataehora: e.target.value })}
            />

            <select
              value={form.metodo}
              onChange={(e) => setForm({ ...form, metodo: e.target.value })}
              className="p-3 rounded-full border bg-(--bg) border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
            >
              <option value="" disabled>Forma de Pagamento</option>
              <option value="pix">Pix</option>
              <option value="credito">Cartão de Crédito</option>
              <option value="debito">Cartão de Débito</option>
              <option value="dinheiro">Dinheiro</option>
            </select>

            <div className="col-span-1 sm:col-span-2 relative">
              <span className="absolute left-4 top-3 text-(--text) font-medium">Valor Total:</span>
              <input
                className="p-3 pl-24 rounded-full border bg-(--bg) opacity-80 border-gray-300 cursor-not-allowed outline-none shadow-sm w-full font-bold text-[#D97016]"
                type="text"
                readOnly
                value={`R$ ${valorTotal.toFixed(2)}`}
              />
            </div>
          </div>

          <button
            onClick={handleRegistrarClick}
            className="mt-6 w-full bg-[#026A4C] hover:bg-[#037a58] active:scale-95 text-white px-6 py-3 rounded-full font-semibold transition duration-300 shadow-md text-base disabled:opacity-50"
            disabled={itensPedido.length === 0 || !form.metodo}
          >
            Registrar Pedido
          </button>
        </div>

        {vendasatual.length > 0 && (
          <div className="bg-(--surface) p-6 rounded-[20px] shadow-lg mb-6 border border-black/5">
            <h2 className="text-xl font-bold tracking-tight mb-4">Pedidos Registrados</h2>

            {/* --- BARRA DE FILTROS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 bg-(--bg) p-4 rounded-2xl shadow-inner border border-gray-300/20">
              <input
                type="text"
                placeholder="Buscar por produto ou ID..."
                className="p-3 rounded-xl border border-gray-300 bg-(--surface) focus:border-[#D97016] focus:ring-1 focus:ring-[#D97016] outline-none text-sm"
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
              />

              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="p-3 rounded-xl border border-gray-300 bg-(--surface) focus:border-[#D97016] focus:ring-1 focus:ring-[#D97016] outline-none text-sm"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="presencial">Presencial</option>
                <option value="online">Online</option>
              </select>

              <select
                value={filtroMetodo}
                onChange={(e) => setFiltroMetodo(e.target.value)}
                className="p-3 rounded-xl border border-gray-300 bg-(--surface) focus:border-[#D97016] focus:ring-1 focus:ring-[#D97016] outline-none text-sm"
              >
                <option value="todos">Todos os Pagamentos</option>
                <option value="pix">Pix</option>
                <option value="credito">Crédito</option>
                <option value="debito">Débito</option>
                <option value="dinheiro">Dinheiro</option>
              </select>
            </div>

            {pedidosFiltrados.length === 0 ? (
              <p className="text-center opacity-50 py-4 text-sm font-medium">Nenhum pedido encontrado com esses filtros.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {pedidosPaginados.map((pedido) => {
                  const dataformatada = formatarData(pedido.criada_em);
                  const isOnline = pedido.online;

                  return (
                    <div
                      key={pedido.idvenda}
                      className="flex flex-col md:flex-row justify-between md:items-center p-4 bg-(--bg) border border-gray-300/30 rounded-2xl transition-all duration-200"
                    >

                      <div className="flex-1 pr-8 mb-3 md:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black opacity-40">#{pedido.idvenda}</span>
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${isOnline ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                            {isOnline ? "Online" : "Presencial"}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold tracking-tight mb-1 text-(--text)">
                          {pedido.venda_produto.map((p) => p.produtos?.nome).join(', ')}
                        </h3>
                        <p className="text-xs opacity-60 font-medium">{dataformatada}</p>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="text-left md:text-right">
                          <p className="text-[11px] uppercase tracking-wider opacity-50 font-bold mb-0.5">Pagamento</p>
                          <p className="text-sm font-semibold capitalize">{pedido.metodo_pagamento || "N/A"}</p>
                        </div>

                        <div className="text-right">
                          <p className="text-[11px] uppercase tracking-wider opacity-50 font-bold mb-0.5">Total</p>
                          <p className="text-base font-black text-[#026A4C]">R$ {parseFloat(pedido.valor_total).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-300/20">
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: 'var(--text)',
                        fontWeight: 'bold',
                      },
                      '& .Mui-selected': {
                        backgroundColor: '#026A4C !important',
                        color: '#ffffff',
                        boxShadow: '0 4px 6px -1px rgba(2, 106, 76, 0.4)',
                      },
                      '& .MuiPaginationItem-root:hover': {
                        backgroundColor: 'rgba(2, 106, 76, 0.1)',
                      }
                    }}
                  />
                </Stack>
              </div>
            )}
          </div>
        )}

        {vendasatual.length === 0 && (
          <p className="text-center opacity-50 text-sm mt-4">
            Nenhum pedido registrado ainda.
          </p>
        )}
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        type={modalState.type === 'add' ? 'add' : 'delete'}
        title={modalState.type === 'add' ? 'Registrar Pedido' : 'Excluir Pedido'}
        message={
          modalState.type === 'add'
            ? `Confirmar registro de ${itensPedido.length} item(ns) no valor de R$ ${valorTotal.toFixed(2)}?`
            : 'Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.'
        }
        actionType={modalState.type === 'add' ? 'add' : 'delete'}
        onConfirm={modalState.type === 'add' ? confirmRegistrar : confirmExcluir}
        onCancel={() => setModalState({ isOpen: false, type: null, pedidoId: null, isLoading: false })}
        isLoading={modalState.isLoading}
      />
    </div>
  );
}