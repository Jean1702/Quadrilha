"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AdminHeaderPage from "@/components/AdminHeaderPage";

export default function PedidoFisicoPage({ vendas, admindata, produtos }) { 
  const [vendasatual, setVendasatual] = useState(vendas);
  const [produtosLoja, setProdutosLoja] = useState(produtos);
  const idturma = admindata.idturma;
  useEffect(() => {
    const agora = new Date();
    
    const timezoneOffset = agora.getTimezoneOffset() * 60000;
    
    const dataLocal = new Date(agora.getTime() - timezoneOffset);
    
    const formatoExigido = dataLocal.toISOString().slice(0, 16);
    
    setForm({ ...form, dataehora: formatoExigido });
  }, []);
  
  const [form, setForm] = useState({
    dataehora: "",
    metodo: "",
  });
  const [pedidos, setPedidos] = useState([]);
 
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


  const handleEnviar = () => {
    if (!form.produto || !form.dataehora || !form.valor || !form.quantidade) return;

    setPedidos([
      { ...form, id: Date.now() },
      ...pedidos,
    ]);
    setForm({ produto: "", dataehora: dataehora, valor: "", quantidade: "" });
  };

  const handleExcluir = (id) => {
    setPedidos(pedidos.filter((p) => p.id !== id));
  };
 
  // Estados para gerenciar o formulário
  

  // Estados para o item atual sendo adicionado
  const [produtoAtual, setProdutoAtual] = useState("");
  const [quantidadeAtual, setQuantidadeAtual] = useState(1);
  
  // Estado para a lista de produtos no pedido
  const [itensPedido, setItensPedido] = useState([]);

  // Função visual para adicionar o item na lista
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
      // Reseta os campos após adicionar
      setProdutoAtual("");
      setQuantidadeAtual(1);
    }
  };

  // Função visual para remover um item da lista
  const handleRemoverProduto = (index) => {
    const novaLista = [...itensPedido];
    novaLista.splice(index, 1);
    setItensPedido(novaLista);
  };

  // Cálculo automático do valor total
  const valorTotal = itensPedido.reduce((acc, item) => acc + item.subtotal, 0);

  const handleEnviard = async () => {
    const pedidoData = {
      itensPedido,
      dataehora: form.dataehora,
      metodo: form.metodo,
      valor: valorTotal,
    };
    const response = await fetch(`/api/pedidos/inserir?idturma=${idturma}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedidoData),
    });
    
    if (response.ok) {

      setItensPedido([]);
    }else{
    }
      
  };

  return (
    <div className="min-h-screen pb-24">
     <AdminHeaderPage titulo="PEDIDOS FÍSICOS" nometurma={admindata.turma.nomecurso} anoturma={admindata.turma.ano} logo={admindata.turma.logo}  />
      <div className="h-32"></div>

      <div className="max-w-3xl mx-auto w-full">
        <div className="bg-[var(--surface)] p-6 rounded-[20px] shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-6 tracking-tight">
            Registro de Pedido Físico
          </h2>

          {/* SESSÃO 1: ADIÇÃO DE PRODUTOS */}
          <div className="mb-6 p-4 border border-gray-300/30 rounded-2xl bg-black/10">
            <h3 className="text-sm font-medium mb-3 opacity-80">Adicionar Itens ao Pedido</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {/* Select de Produtos */}
              <select
                value={produtoAtual}
                onChange={(e) => setProdutoAtual(e.target.value)}
                className="p-3 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm col-span-1 sm:col-span-3"
              >
                <option value="" disabled>Selecione um produto...</option>
                {produtosLoja.map(produto => (
                  <option key={produto.idproduto} value={produto.idproduto}>
                    {produto.nome} - R$ {produto.preco.toFixed(2)}
                  </option>
                ))}
              </select>

              {/* Input de Quantidade */}
              <input
                className="p-3 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm col-span-1"
                type="number"
                placeholder="Qtd"
                min="1"
                value={quantidadeAtual}
                onChange={(e) => setQuantidadeAtual(e.target.value)}
              />
            </div>

            {/* Botão Adicionar Produto */}
            <button
              onClick={handleAdicionarProduto}
              type="button"
              className="mt-3 w-full sm:w-auto bg-transparent border border-[#D97016] text-[#D97016] hover:bg-[#D97016] hover:text-white px-5 py-2 rounded-full font-medium transition duration-300 text-sm"
            >
              + Adicionar Produto
            </button>
          </div>

          {/* SESSÃO 2: LISTA DE ITENS ADICIONADOS (Visível apenas se houver itens) */}
          {itensPedido.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2 opacity-80">Itens do Pedido:</h3>
              <ul className="space-y-2">
                {itensPedido.map((item, index) => (
                  <li key={index} className="flex justify-between items-center bg-[var(--bg)] p-3 rounded-lg border border-gray-300/20 text-sm">
                    <span><span className="font-bold">{item.quantidade}x</span> {item.nome}</span>
                    <div className="flex items-center gap-4">
                      <span>R$ {item.subtotal.toFixed(2)}</span>
                      <button onClick={() => handleRemoverProduto(index)} className="text-red-500 hover:text-red-700 font-bold" title="Remover item">
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* SESSÃO 3: DADOS DO PAGAMENTO E FINALIZAÇÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-300/20">
            <input
              className="p-3 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
              type="datetime-local"
              value={form.dataehora}
              onChange={(e) => setForm({ ...form, dataehora: e.target.value })}
            />

            <select
              id="pagamento"
              value={form.metodo}
              onChange={(e) => setForm({ ...form, metodo: e.target.value })}
              className="p-3 rounded-full border bg-[var(--bg)] border-gray-300 focus:border-[#D97016] focus:ring-2 focus:ring-[#D97016]/30 outline-none transition duration-300 shadow-sm"
            >
              <option value="" disabled>Forma de Pagamento</option>
              <option value="pix">Pix</option>
              <option value="credito">Cartão de Crédito</option>
              <option value="debito">Cartão de Débito</option>
              <option value="dinheiro">Dinheiro</option>
            </select>

            {/* Input de Valor Total (Calculado Automaticamente e Bloqueado para edição) */}
            <div className="col-span-1 sm:col-span-2 relative">
              <span className="absolute left-4 top-3 text-[var(--text)] font-medium">Valor Total:</span>
              <input
                className="p-3 pl-24 rounded-full border bg-[var(--bg)] opacity-80 border-gray-300 cursor-not-allowed outline-none shadow-sm w-full font-bold text-[#D97016]"
                type="text"
                readOnly
                value={`R$ ${valorTotal.toFixed(2)}`}
              />
            </div>
          </div>

          <button
            onClick={handleEnviard}
            className="mt-6 w-full bg-[#026A4C] hover:bg-[#037a58] active:scale-95 text-white px-6 py-3 rounded-full font-semibold transition duration-300 shadow-md text-base"
          >
            Registrar Pedido
          </button>
        </div>

        {vendasatual.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 tracking-tight">
              Pedidos Registrados
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendasatual.map((pedido) => {
                const dataformatada = formatarData(pedido.criada_em);
                return (
                <div
                  key={pedido.idvenda}
                  className="relative bg-[var(--surface)] rounded-[20px] p-4 shadow-lg hover:shadow-xl transition duration-300"
                >
                  <button
                    onClick={() => handleExcluir(pedido.id)}
                    style={{ position: "absolute", top: "12px", right: "12px" }}
                    className="text-black dark:text-white hover:opacity-60 active:scale-95 transition duration-300"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="pr-7 space-y-1 text-sm">
                    <h3 className="text-base font-bold tracking-tight mb-2">
                      {pedido.venda_produto.map((pedidosc)=> {
                        return `${pedidosc.produtos.nome} `
                      })}
                    </h3>
                    <p><span className="font-semibold">Hora:</span> {dataformatada}</p>
                    <p><span className="font-semibold">Quantidade:</span> {pedido.venda_produto[0]?.quantidade || 0}</p>
                    <p><span className="font-semibold">Tipo de venda:</span> {pedido.online ? "Online" : "Presencial"}</p>
                    <p><span className="font-semibold">Método de pagamento:</span>  {pedido.metodo_pagamento || "Não informado"}</p>
                    <p className="text-[#026A4C] font-semibold text-base mt-1">
                      R$ {parseFloat(pedido.valor_total).toFixed(2)}
                    </p>
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}

        {vendasatual.length === 0 && (
          <p className="text-center opacity-50 text-sm mt-4">
            Nenhum pedido registrado ainda.
          </p>
        )}

      </div>
    </div>
  );
}