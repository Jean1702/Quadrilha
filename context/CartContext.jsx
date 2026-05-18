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
        // 1. Limpamos a observação para evitar que um espaço extra crie um item novo (ex: " " vs "")
        const obsLimpa = observacao ? observacao.trim() : "";

        // 2. Procuramos no carrinho se já existe uma linha com o MESMO produto E a MESMA observação
        const indexExistente = carrinho.findIndex(
            (item) => item.produto.idproduto === produto.idproduto && item.observacao === obsLimpa
        );

        let novoCarrinho;

        if (indexExistente >= 0) {
            // CENÁRIO A: O item já existe! Vamos apenas somar a quantidade e o subtotal
            novoCarrinho = [...carrinho];
            const itemAtual = novoCarrinho[indexExistente];

            const novaQuantidade = itemAtual.quantidade + quantidade;
            const novoSubtotal = novaQuantidade * produto.preco;

            novoCarrinho[indexExistente] = {
                ...itemAtual,
                quantidade: novaQuantidade,
                subtotal: novoSubtotal
            };

        } else {
            // CENÁRIO B: É um item novo (ou o mesmo produto, mas com observação diferente)
            const novoItem = {
                idItemCarrinho: Date.now(), // Gera um ID único para esta linha do carrinho
                produto: produto,
                quantidade: quantidade,
                observacao: obsLimpa,
                subtotal: produto.preco * quantidade,
            };

            novoCarrinho = [...carrinho, novoItem];
        }

        // 3. Salva no estado e na memória do navegador
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