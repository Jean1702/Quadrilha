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

        // 🚨 === NOVA TRAVA: VALIDAÇÃO DE TURMA ÚNICA ===
        if (carrinho.length > 0) {
            const idTurmaNoCarrinho = carrinho[0].produto.idturma;

            if (idTurmaNoCarrinho !== produto.idturma) {
                alert("Você só pode adicionar produtos de uma mesma turma/loja por vez no carrinho. Finalize a compra atual ou limpe o seu carrinho para comprar desta outra turma.");
                return false; // Retorna falso e barra a inserção de forma limpa
            }
        }

        // 1. Calcula quantos deste produto JÁ ESTÃO no carrinho (somando todas as observações)
        const qtdJaNoCarrinho = carrinho
            .filter((item) => item.produto.idproduto === produto.idproduto)
            .reduce((total, item) => total + item.quantidade, 0);

        // 2. Validação Mestre: Bloqueia se a soma ultrapassar o estoque
        if (qtdJaNoCarrinho + quantidade > produto.estoque) {
            alert(`Você não pode adicionar essa quantidade. O estoque máximo é ${produto.estoque} e você já tem ${qtdJaNoCarrinho} no carrinho.`);
            return false;
        }

        const obsLimpa = observacao ? observacao.trim() : "";

        // Verificação se o produto com a MESMA observação já existe para agrupar
        const itemExistenteIndex = carrinho.findIndex(
            (item) => item.produto.idproduto === produto.idproduto && item.observacao === obsLimpa
        );

        let novoCarrinho;

        if (itemExistenteIndex > -1) {
            novoCarrinho = [...carrinho];
            const novaQuantidade = novoCarrinho[itemExistenteIndex].quantidade + quantidade;
            novoCarrinho[itemExistenteIndex] = {
                ...novoCarrinho[itemExistenteIndex],
                quantidade: novaQuantidade,
                subtotal: produto.preco * novaQuantidade
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
        return true;
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