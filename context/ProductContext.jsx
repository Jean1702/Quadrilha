"use client";
import { createContext, useState, useEffect } from "react";
import { CreateClient } from "@/lib/supabase/client";

// 1. Cria o Contexto
export const ProductContext = createContext();

// 2. Cria o Provider (Provedor) que vai envolver a aplicação
export function ProductProvider({ children }) {
    // Vamos guardar os produtos e as imagens aqui
    const [produtosGlobais, setProdutosGlobais] = useState([]);
    const [imagensGlobais, setImagensGlobais] = useState([]);

    const supabase = CreateClient();

    // 1. RECUPERAR: Assim que o App abre, tentamos buscar dados antigos do localStorage
    useEffect(() => {
        // ETAPA A: Recupera imediatamente os dados do localStorage (Interface abre na hora!)
        const produtosSalvos = localStorage.getItem("produtosApp");
        const imagensSalvas = localStorage.getItem("imagensApp");

        if (produtosSalvos && imagensSalvas) {
            setProdutosGlobais(JSON.parse(produtosSalvos));
            setImagensGlobais(JSON.parse(imagensSalvas));
        }

        // ETAPA B: Busca os dados em tempo real no Supabase para atualizar o app (Garante segurança)
        const sincronizarBancoDeDados = async () => {
            try {
                // Busca a lista mais recente de produtos diretamente do banco
                const { data: produtosBanco, error: errProd } = await supabase
                    .from("produtos")
                    .select("*");

                // Busca as imagens diretamente do banco (ajuste o nome 'imagens' se sua tabela for diferente, ex: 'imagens_produto')
                const { data: imagensBanco, error: errImg } = await supabase
                    .from("imagens")
                    .select("*");

                if (!errProd && !errImg && produtosBanco && imagensBanco) {
                    // Atualiza o estado global com os preços e estoques REAIS de agora
                    setProdutosGlobais(produtosBanco);
                    setImagensGlobais(imagensBanco);

                    // Atualiza o localStorage para o próximo carregamento já vir mais atualizado
                    localStorage.setItem("produtosApp", JSON.stringify(produtosBanco));
                    localStorage.setItem("imagensApp", JSON.stringify(imagensBanco));
                    // console.log("Catálogo sincronizado com o Supabase com sucesso!");
                }
            } catch (error) {
                console.error("Erro crítico ao sincronizar dados com o Supabase:", error);
            }
        };

        sincronizarBancoDeDados();
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