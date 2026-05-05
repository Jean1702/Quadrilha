"use client"; // Necessário no Next.js (App Router) porque Context é um recurso de cliente
import { createContext, useState, useEffect } from "react";

// 1. Cria o Contexto
export const ProductContext = createContext();

// 2. Cria o Provider (Provedor) que vai envolver a aplicação
export function ProductProvider({ children }) {
    // Vamos guardar os produtos e as imagens aqui
    const [produtosGlobais, setProdutosGlobais] = useState([]);
    const [imagensGlobais, setImagensGlobais] = useState([]);

// 1. RECUPERAR: Assim que o App abre, tentamos buscar dados antigos do localStorage
    useEffect(() => {
        const produtosSalvos = localStorage.getItem("produtosApp");
        const imagensSalvas = localStorage.getItem("imagensApp");

        if (produtosSalvos && imagensSalvas) {
            setProdutosGlobais(JSON.parse(produtosSalvos));
            setImagensGlobais(JSON.parse(imagensSalvas));
        }
    }, []);
    // Essa função vai ajudar a popular o contexto quando a API carregar na página principal
    const carregarDados = (produtosDaApi, imagensDaApi) => {
        setProdutosGlobais(produtosDaApi);
        setImagensGlobais(imagensDaApi);

        // Converte os dados em texto (String) para poder salvar no navegador
        localStorage.setItem("produtosApp", JSON.stringify(produtosDaApi));
        localStorage.setItem("imagensApp", JSON.stringify(imagensDaApi));
    };

    return (
        <ProductContext.Provider
            value={{
                produtosGlobais,
                imagensGlobais,
                carregarDados
            }}
        >
            {children}
        </ProductContext.Provider>
    );
}