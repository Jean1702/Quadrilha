"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react"
import { ProductContext } from "@/context/ProductContext"
import { Swiper, SwiperSlide } from 'swiper/react';
import { useParams } from "next/navigation";
import 'swiper/css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function CategoriaPage({ produtos, imagem, categorias, turmas, categoria_produto }) {

    const { carregarDados } = useContext(ProductContext)

    const params = useParams();
    const idDaCategoriaAtual = Number(params.id);

    const [page, setPage] = useState(1);
    const itensPorPagina = 10;

    const produto = produtos?.data || []
    const imagens = imagem?.data || []
    const categoriasData = categorias?.data || []

    const relacoes = categoria_produto?.data || []

    const categoriasFiltradas = categoriasData.filter(cat => cat.idcategoria !== idDaCategoriaAtual);


    const idsProdutosDestaCategoria = relacoes
        .filter(rel => rel.idcategoria === idDaCategoriaAtual)
        .map(rel => rel.idproduto);

    const produtosFiltrados = produto.filter(prod => idsProdutosDestaCategoria.includes(prod.idproduto));

    const gruposPorTurma = {};
    produtosFiltrados.forEach(prod => {
        if (!gruposPorTurma[prod.idturma]) {
            gruposPorTurma[prod.idturma] = [];
        }
        gruposPorTurma[prod.idturma].push(prod);
    });

    const produtosOrdenadosJustos = [];
    const idsDasTurmas = Object.keys(gruposPorTurma);
    let indiceAtual = 0;
    let aindaTemProduto = true;

    while (aindaTemProduto) {
        aindaTemProduto = false; // Começamos assumindo que acabou

        idsDasTurmas.forEach(turmaId => {
            // Se essa turma ainda tiver um produto no indiceAtual, nós adicionamos
            if (gruposPorTurma[turmaId][indiceAtual]) {
                produtosOrdenadosJustos.push(gruposPorTurma[turmaId][indiceAtual]);
                aindaTemProduto = true; // Se achamos pelo menos um, o loop continua pra próxima rodada
            }
        });

        indiceAtual++;
    }

   const startIndex = (page - 1) * itensPorPagina;
    const endIndex = startIndex + itensPorPagina;

   const produtosPaginados = produtosOrdenadosJustos.slice(startIndex, endIndex);
    const totalPaginas = Math.ceil(produtosOrdenadosJustos.length / itensPorPagina);

    const handleChangePage = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        if (produtosOrdenadosJustos.length > 0 && imagens) {
            carregarDados(produtosOrdenadosJustos, imagens)
        }
    }, [idDaCategoriaAtual, produto, imagens])

    return (
        <>
            <section className="pl-5 ">
                <h2 className="text-xl font-bold pl-3 mb-3 mt-2">Categorias</h2>
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
                    {categoriasFiltradas.map((cat) => (
                        <SwiperSlide key={cat.idcategoria}>
                            <Link
                                href={`/categoria/${cat.idcategoria}`}
                                className="card card-compact bg-base-100 shadow-xl h-full w-full max-w-35 md:max-w-none hover:-translate-y-1 transition-transform duration-300 overflow-hidden block transform-gpu translate-z-0 will-change-transform"
                            >
                                <figure className="h-32 md:h-40 w-full">
                                    <img
                                        src={cat.img_cat}
                                        alt={cat.nomecategoria}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </figure>
                                <div className="card-body items-center text-center p-2 bg-(--surface)">
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

                        {produtosPaginados.map((prod) => {
                            const imagensDoProduto = imagens.filter(img => img.idproduto === prod.idproduto);
                            const primeiraImagem = imagensDoProduto[0]?.url_imagem;

                            return (
                                <div key={prod.idproduto} className="space-y-4">
                                    <Link
                                        key={prod.idproduto}
                                        href={`/product/${prod.idproduto}`}
                                        className="flex flex-col md:flex-row gap-6 rounded-[2rem] bg-(--surface) p-5 md:p-8 hover:-translate-y-1 transition-transform duration-300 md:h-72"
                                    >
                                        <div className="relative w-full h-56 md:h-full md:w-1/3 shrink-0 rounded-[1.5rem] overflow-hidden border border-[#514442]/10 flex items-center justify-center bg-(--surface)">
                                            <div
                                                className="absolute inset-0 w-full h-full opacity-60 blur-[5px] scale-110"
                                                style={{
                                                    backgroundImage: `url(${primeiraImagem})`,
                                                    backgroundRepeat: 'repeat',
                                                    backgroundSize: 'contain',
                                                    backgroundPosition: 'center',
                                                }}
                                            />
                                            <img
                                                src={primeiraImagem}
                                                alt={prod.nome}
                                                className="relative z-10 h-full w-full object-contain drop-shadow-2xl"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col gap-2 pb-0 justify-center">
                                            <h2 className="text-2xl font-black md:text-3xl">{prod.nome}</h2>
                                            <p className="max-w-3xl text-md leading-7 text-preto md:text-base line-clamp-3">
                                                {prod.descricao}
                                            </p>
                                            <p className="text-xl md:text-2xl font-black text-vermelho mt-4 md:mt-auto">
                                                R$ {prod.preco}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}

                        {totalPaginas > 1 && (
                            <Stack spacing={2} className="items-center mt-10">
                                <Pagination
                                    count={totalPaginas}
                                    page={page}
                                    onChange={handleChangePage}
                                    color="primary"
                                    size="large"
                                />
                            </Stack>
                        )}

                    </div>
                </section>
            </main>
        </>
    )
}