"use client";
import Link from "next/link";
import { useContext, useEffect, useState } from "react"
import { ProductContext } from "@/context/ProductContext"
import { Swiper, SwiperSlide } from 'swiper/react';
import { useParams } from "next/navigation";
import 'swiper/css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { CreateClient } from "@/lib/supabase/client";

export default function CategoriaPage({ produtos, imagem, categorias, turmas, categoria_produto }) {

    const { carregarDados } = useContext(ProductContext)

    const params = useParams();
    const idDaCategoriaAtual = Number(params.id);

    const [page, setPage] = useState(1);
    const itensPorPagina = 10;

    const [listaProdutos, setListaProdutos] = useState(() => {
        const prod = produtos?.data || produtos || [];
        return prod.filter(p => p.isActivy !== false);
    });

    const [turmasAtivas, setTurmasAtivas] = useState(() => {
        const turm = turmas?.data || turmas || [];
        return turm.filter(t => t.is_active !== false).map(t => String(t.idturma));
    });

    const imagens = imagem?.data || []
    const categoriasData = categorias?.data || []
    const relacoes = categoria_produto?.data || []

    const categoriasFiltradas = categoriasData.filter(cat => cat.idcategoria !== idDaCategoriaAtual);

    useEffect(() => {
        const supabase = CreateClient();

        const channelProdutos = supabase
            .channel('categoria_page_produtos')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'produtos' },
                (payload) => {
                    const atualizado = payload.new;
                    if (atualizado.isActivy === false) {
                        setListaProdutos(prev => prev.filter(p => String(p.idproduto) !== String(atualizado.idproduto)));
                    } else {
                        setListaProdutos(prev => prev.map(p => String(p.idproduto) === String(atualizado.idproduto) ? { ...p, ...atualizado } : p));
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'produtos' },
                (payload) => {
                    setListaProdutos(prev => prev.filter(p => String(p.idproduto) !== String(payload.old.idproduto)));
                }
            )
            .subscribe();

        const channelTurmas = supabase
            .channel('categoria_page_turmas')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'turma' },
                (payload) => {
                    const atualizada = payload.new;
                    if (atualizada.is_active === false) {
                        setTurmasAtivas(prev => prev.filter(id => id !== String(atualizada.idturma)));
                    } else {
                        setTurmasAtivas(prev => {
                            const idStr = String(atualizada.idturma);
                            return prev.includes(idStr) ? prev : [...prev, idStr];
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channelProdutos);
            supabase.removeChannel(channelTurmas);
        };
    }, []);

    const idsProdutosDestaCategoria = relacoes
        .filter(rel => Number(rel.idcategoria) === idDaCategoriaAtual)
        .map(rel => String(rel.idproduto));

    const produtosFiltrados = listaProdutos.filter(prod => {
        const pertenceCategoria = idsProdutosDestaCategoria.includes(String(prod.idproduto));
        const turmaAberta = turmasAtivas.includes(String(prod.idturma));
        return pertenceCategoria && turmaAberta;
    });

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
        aindaTemProduto = false;

        idsDasTurmas.forEach(turmaId => {
            if (gruposPorTurma[turmaId][indiceAtual]) {
                produtosOrdenadosJustos.push(gruposPorTurma[turmaId][indiceAtual]);
                aindaTemProduto = true;
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
    }, [idDaCategoriaAtual, listaProdutos, turmasAtivas, imagens])

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
            <main className="min-h-screen">
                <section className="px-4 pb-16 md:px-8 mt-10 lg:px-12">
                    <div className="mx-auto max-w-6xl space-y-10">

                        {produtosFiltrados.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <h3 className="text-2xl font-bold opacity-80">Nenhum produto encontrado</h3>
                                <p className="text-lg opacity-60 max-w-sm mt-3">
                                    Ainda não temos itens cadastrados nesta categoria. Que tal explorar outras?
                                </p>
                                <Link
                                    href="/"
                                    className="mt-6 px-8 py-3 bg-[#D97016] hover:bg-[#D98025] text-white rounded-full font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300"
                                >
                                    Voltar para o Início
                                </Link>
                            </div>
                        ) : (
                            <>
                                {produtosPaginados.map((prod) => {
                                    const imagensDoProduto = imagens.filter(img => img.idproduto === prod.idproduto);
                                    const primeiraImagem = imagensDoProduto[0]?.url_imagem;

                                    return (
                                        <div key={prod.idproduto} className="space-y-4">
                                            <Link
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
                                                    <p className="max-w-3xl text-md leading-7 text-(--text) md:text-base line-clamp-3">
                                                        {prod.descricao}
                                                    </p>
                                                    <p className="text-xl md:text-2xl font-black text-[#10a379] mt-4 md:mt-auto">
                                                        R$ {prod.preco.toFixed(2)}
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
                                            size="large"
                                            sx={{
                                                '& .MuiPaginationItem-root': {
                                                    color: 'var(--text)',
                                                    fontWeight: 'bold',
                                                },
                                                '& .Mui-selected': {
                                                    backgroundColor: '#026A4C !important',
                                                    color: '#fff',
                                                    boxShadow: '0 4px 6px -1px rgba(2, 106, 76, 0.4)',
                                                },
                                                '& .MuiPaginationItem-root:hover': {
                                                    backgroundColor: 'rgba(2, 106, 76, 0.1)',
                                                }
                                            }}
                                        />
                                    </Stack>
                                )}
                            </>
                        )}

                    </div>
                </section>
            </main>
        </>
    )
}