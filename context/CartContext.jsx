"use client";
import { createContext, useState, useEffect } from "react";

// 1. Cria o Contexto
export const CartContext = createContext();

// 2. Cria o Provider
export function CartProvider({ children }) {
    const [carrinho, setCarrinho] = useState([]);

    // Tenta recuperar o carrinho salvo no navegador quando o app inicia
    useEffect(() => {
        const carrinhoSalvo = localStorage.getItem("carrinhoApp");
        if (carrinhoSalvo) {
            setCarrinho(JSON.parse(carrinhoSalvo));
        }
    }, []);

    // Função para adicionar um novo item
    const adicionarAoCarrinho = (produto, quantidade, observacao) => {
        // Criamos um objeto novo contendo as infos da compra
        const novoItem = {
            idItemCarrinho: Date.now(), // Cria um ID único baseado na data/hora atual (importante se ele pedir o mesmo hambúrguer duas vezes, mas um sem cebola e outro normal)
            produto: produto,
            quantidade: quantidade,
            observacao: observacao,
            subtotal: produto.preco * quantidade
        };

        // Pega o carrinho antigo e adiciona o novo item no final
        const novoCarrinho = [...carrinho, novoItem];

        // Atualiza o estado e salva no localStorage
        setCarrinho(novoCarrinho);
        localStorage.setItem("carrinhoApp", JSON.stringify(novoCarrinho));
    };

    const removerDoCarrinho = (idItemCarrinho) => {
        // Filtra o carrinho e mantém apenas os itens que NÃO têm o ID que queremos apagar
        const novoCarrinho = carrinho.filter(item => item.idItemCarrinho !== idItemCarrinho);

        setCarrinho(novoCarrinho);
        localStorage.setItem("carrinhoApp", JSON.stringify(novoCarrinho));
    };

    const limparCarrinho = () => {
        setCarrinho([]);
        localStorage.removeItem("carrinhoApp"); // Remove os dados salvos no navegador
    };

    return ( 
        <CartContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, limparCarrinho }}>
            {children}
        </CartContext.Provider>
    )
};