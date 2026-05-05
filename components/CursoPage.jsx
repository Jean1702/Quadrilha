"use client";
import Link from "next/link";
import { useContext, useEffect } from "react"
import { ProductContext } from "@/context/ProductContext"
export default function CursoPage({ categoria, imagem }) {

    const { carregarDados } = useContext(ProductContext)

    const produto = categoria.data
    const imagens = imagem.data

    useEffect(() => {
        if (produto && imagens) {
            carregarDados(produto, imagens)
        }
    }, [produto, imagens])

    const curso = {
        nome: "Informatíca",
        chamada: "Venha saborear os melhores hamburgueres artesanais da região.",
    };

    const categorias = [
        { nome: "Hambúrguer", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
        { nome: "Pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" },
        { nome: "Sushi", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop" },
        { nome: "Batata Frita", img: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop" },
        { nome: "Salada", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop" },
        { nome: "Macarrão", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop" },
    ];

    return (
        <>
            <section className="pl-10 ">
                <h2 className="text-xl font-bold pl-10 mb-3 mt-2">Produtos</h2>
                <div className="carousel carousel-center gap-4 w-full scrollbar-hide overflow-x-auto">
                    {categorias.map((cat) => (
                        <div key={cat.nome} className="carousel-item">
                            <Link href="/product" className="card card-compact bg-base-100 shadow-xl w-32 md:w-56 hover:-translate-y-1 transition-transform duration-300">
                                <figure className="h-32 md:h-40">
                                    <img src={cat.img} alt={cat.nome} className="w-full h-full object-cover" />
                                </figure>
                                <div className="card-body items-center text-center p-2">
                                    <h2 className="card-title text-xs md:text-sm">{cat.nome}</h2>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
            <main className="min-h-screen ">

                <section className="px-4 pb-16 md:px-8 mt-10 lg:px-12">
                    <div className="mx-auto max-w-6xl b space-y-10">

                        {produto.map((prod) => {
                            // 1. Procuramos na tabela de imagens apenas as fotos que tem o mesmo idproduto
                            const imagensDoProduto = imagens.filter(img => img.idproduto === prod.idproduto);

                            // 2. Pegamos só a primeira foto do array (posição 0). 
                            // Se não tiver foto nenhuma, ele não quebra.
                            const primeiraImagem = imagensDoProduto[0]?.url_imagem;

                            return (
                                <div key={prod.idproduto} className="space-y-4">

                                    {/* === CAIXA DE TEXTO DO PRODUTO === */}
                                    <Link
                                        key={prod.idproduto}
                                        href={`/product/${prod.idproduto}`}
                                        // Adicionamos md:h-72 para travar a altura no computador. Todos terão o mesmo tamanho.
                                        className="flex flex-col md:flex-row gap-6 rounded-[2rem] bg-[var(--surface)] p-5 md:p-8 hover:-translate-y-1 transition-transform duration-300 md:h-72"
                                    >
                                        {/* IMAGEM: No PC, ela ocupa 100% da altura fixa do card (md:h-full). Adicionado flex e center para centralizar a imagem */}
                                        <div className="w-full h-56 md:h-full md:w-1/3 shrink-0 rounded-[1.5rem] overflow-hidden border border-black/5 flex items-center justify-center">
                                            <img
                                                src={primeiraImagem}
                                                alt={prod.nome}
                                                // Mudamos de object-cover para object-contain: a foto não é mais cortada
                                                className="max-h-full max-w-full object-cover"
                                            />
                                        </div>

                                        {/* INFORMAÇÕES: Mantidas as suas cores, mas agora ele se adapta à altura travada */}
                                        <div className="flex flex-1 flex-col gap-2 pb-0 justify-center">
                                            <p className="text-md font-semibold uppercase tracking-[0.25em] text-vermelho">Produtos</p>
                                            <h2 className="text-2xl font-black md:text-3xl">{prod.nome}</h2>
                                            <p className="max-w-3xl text-md leading-7 text-preto md:text-base line-clamp-3">
                                                {prod.descricao}
                                            </p>

                                            {/* mt-auto garante que o preço cole lá no fundo do card, alinhando todos os preços na mesma linha invisível */}
                                            <p className="text-xl md:text-2xl font-black text-vermelho mt-4 md:mt-auto">
                                                R$ {prod.preco}
                                            </p>
                                        </div>
                                    </Link>

                                </div>
                            );
                        })}
                        {/* {produto.map((categoria) => (
                            <div key={categoria.idproduto} className="space-y-5 rounded-[2rem] bg-[var(--surface)] p-5  md:p-8">
                                <div className="flex flex-col gap-2 pb-4">
                                    <p className="text-md font-semibold uppercase tracking-[0.25em] text-vermelho">Produtos</p>
                                    <h2 className="text-2xl font-black md:text-3xl">{categoria.nome}</h2>
                                    <p className="max-w-3xl text-md leading-7 text-preto md:text-base">{categoria.descricao}</p>
                                </div>

                            </div>
                        ))}
                        <div className="space-y-4">
                            {imagens.map((imagem) => (
                                <Link
                                    key={imagem.idimagem}
                                    href={`/product/${imagem.idproduto}`}
                                    className="flex flex-col rounded-[1.5rem] bg-[var(--card)] md:min-h-44 md:flex-row  hover:-translate-y-1 transition-transform duration-300"
                                >
                                    <div className="h-48 md:h-auto md:w-1/5">
                                        <img src={imagem.url_imagem} className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="flex flex-1 flex-col justify-center gap-3 px-5 py-5 md:px-7">
                                        <h3 className="text-xl font-black  md:text-2xl">{imagem.nome}</h3>
                                         <p className="max-w-3xl text-md leading-7  md:text-base">
                                            {produto.descricao}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div> */}
                    </div>
                </section>
            </main>
        </>
    )
}