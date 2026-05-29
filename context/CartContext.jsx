"use client";
import { createContext, useState, useEffect, useCallback } from "react";

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
        // 1. Calcula quantos deste produto JÁ ESTÃO no carrinho (somando todas as observações)
        const qtdJaNoCarrinho = carrinho
            .filter((item) => item.produto.idproduto === produto.idproduto)
            .reduce((total, item) => total + item.quantidade, 0);

        // 2. Validação Mestre: Bloqueia se a soma ultrapassar o estoque
        if (qtdJaNoCarrinho + quantidade > produto.estoque) {
            alert(`Você não pode adicionar essa quantidade. O estoque máximo é ${produto.estoque} e você já tem ${qtdJaNoCarrinho} no carrinho.`);
            return false; // Retorna falso para avisar a página que a inserção falhou
        }

        const obsLimpa = observacao ? observacao.trim() : "";

        const indexExistente = carrinho.findIndex(
            (item) => item.produto.idproduto === produto.idproduto && item.observacao === obsLimpa
        );

        let novoCarrinho;

        if (indexExistente >= 0) {
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
            const novoItem = {
                idItemCarrinho: Date.now(),
                produto: produto,
                quantidade: quantidade,
                observacao: obsLimpa,
                subtotal: produto.preco * quantidade,
            };
            novoCarrinho = [...carrinho, novoItem];
        }

        setCarrinho(novoCarrinho);
        localStorage.setItem("carrinhoApp", JSON.stringify(novoCarrinho));
        return true; // Retorna verdadeiro indicando sucesso
    };

    const removerDoCarrinho = (idItemCarrinho) => {
        // Filtra o carrinho e mantém apenas os itens que NÃO têm o ID que queremos apagar
        const novoCarrinho = carrinho.filter(item => item.idItemCarrinho !== idItemCarrinho);

        setCarrinho(novoCarrinho);
        localStorage.setItem("carrinhoApp", JSON.stringify(novoCarrinho));
    };

    const limparCarrinho = useCallback(() => {
        setCarrinho([]);
        localStorage.removeItem("carrinhoApp");
    }, []);

    const atualizarCarrinhoTotal = (novoCarrinho) => {
        setCarrinho(novoCarrinho);
        localStorage.setItem("carrinhoApp", JSON.stringify(novoCarrinho));
    };

    return (
        <CartContext.Provider value={{ carrinho, adicionarAoCarrinho, removerDoCarrinho, limparCarrinho, atualizarCarrinhoTotal }}>
            {children}
        </CartContext.Provider>
    )
};