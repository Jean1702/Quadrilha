"use client";
import Link from "next/link";
import { useContext, useEffect } from "react"
import { ProductContext } from "@/context/ProductContext"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
export default function CursoPage({ produtos, imagem, categorias }) {

    const { carregarDados } = useContext(ProductContext)

    const produto = produtos?.data || []
    const imagens = imagem?.data || []
    const categoriasData = categorias?.data || []

    useEffect(() => {
        if (produto && imagens) {
            carregarDados(produto, imagens)
        }
    }, [produto, imagens])

    const curso = {
        nome: "Informatíca",
        chamada: "Venha saborear os melhores hamburgueres artesanais da região.",
    };

    return (
        <>
            <section className="pl-5 ">
                <h2 className="text-xl font-bold pl-3 mb-3 mt-2">Produtos</h2>
                <Swiper
                    spaceBetween={16}
                    slidesPerView={2.5}
                    touchEventsTarget="container"
                    preventClicks={true}
                    breakpoints={{
                        640: { slidesPerView: 3.5 },
                        768: { slidesPerView: 4.5 },
                        1024: { slidesPerView: 6.5 },
                    }}
                    className="w-full pb-4 pr-4"
                >
                    {categoriasData.map((cat) => (
                        <SwiperSlide key={cat.idcategoria}>
                            <Link
                                href="/product"
                                className="card card-compact bg-base-100 shadow-xl h-full w-full hover:-translate-y-1 transition-transform duration-300 overflow-hidden block transform-gpu translate-z-0 will-change-transform"
                            >
                                <figure className="h-32 md:h-40 w-full">
                                    <img src={cat.img_cat} alt={cat.nomecategoria} className="w-full h-full object-cover" loading="lazy" />
                                </figure>
                                <div className="card-body items-center text-center p-2 bg-[var(--surface)]">
                                    <h2 className="card-title text-xs md:text-sm m-0">{cat.nomecategoria}</h2>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
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
                                        {/* IMAGEM: Container pai (relative e overflow-hidden) */}
                                        <div className="relative w-full h-56 md:h-full md:w-1/3 shrink-0 rounded-[1.5rem] overflow-hidden border border-[#514442]/10 flex items-center justify-center bg-[var(--surface)]">

                                            {/* 1. Imagem de Fundo (Repetida e Borrada) */}
                                            <div
                                                className="absolute inset-0 w-full h-full opacity-60 blur-[5px] scale-110"
                                                style={{
                                                    // Aqui está o truque: usamos a imagem como background e mandamos repetir
                                                    backgroundImage: `url(${primeiraImagem})`,
                                                    backgroundRepeat: 'repeat',
                                                    backgroundSize: 'contain', // ou '100px 100px' se quiser forçar um tamanho menor para as repetições
                                                    backgroundPosition: 'center',
                                                }}
                                            />

                                            {/* 2. Imagem Principal (Frente - Única, Centralizada e Nítida) */}
                                            <img
                                                src={primeiraImagem}
                                                alt={prod.nome}
                                                // object-contain faz a imagem caber certinho no centro, e o z-10 coloca ela por cima do fundo repetido
                                                className="relative z-10 h-full w-full object-contain drop-shadow-2xl"
                                            />
                                        </div>

                                        {/* INFORMAÇÕES: Mantidas as suas cores, mas agora ele se adapta à altura travada */}
                                        <div className="flex flex-1 flex-col gap-2 pb-0 justify-center">
                                            {/*<p className="text-md font-semibold uppercase tracking-[0.25em] text-vermelho">Produtos</p>*/}
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