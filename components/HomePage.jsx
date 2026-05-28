"use client";
import Link from "next/link";
import HeaderBar from "../components/HeaderPage";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { CreateClient } from "../lib/supabase/client";

export default function HomePage({ categorias, turmas }) {

    const categoriasData = categorias?.data || []
    const turmasData = turmas || []
    const supabase = CreateClient();
    const [turmaDataNOVO, setTurmaData] = useState(() => {
        const turmasIniciais = turmas || [];

        return turmasIniciais.filter(turma => turma.is_active !== false);
    });

    useEffect(() => {
        const channelTodasAsLojas = supabase
            .channel('home_todas_turmas')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'turma'
                },
                (payload) => {
                    const lojaAtualizada = payload.new;

                    if (lojaAtualizada.is_active === false) {
                        setTurmaData(prev => prev.filter(loja => String(loja.idturma) !== String(lojaAtualizada.idturma)));
                        return;
                    }

                    setTurmaData(prev => {
                        const lojaJaExiste = prev.some(loja => String(loja.idturma) === String(lojaAtualizada.idturma));
                        if (lojaJaExiste) {
                            return prev.map(loja => String(loja.idturma) === String(lojaAtualizada.idturma) ? lojaAtualizada : loja);
                        } else {
                            return [...prev, lojaAtualizada].sort((a, b) => Number(a.idturma) - Number(b.idturma));
                        }
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'turma'
                },
                (payload) => {

                    setTurmaData(prev => prev.filter(loja => String(loja.idturma) !== String(payload.old.idturma)));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channelTodasAsLojas);
        };
    }, [supabase]);

    return (
        <div className="min-h-screen w-full overflow-x-hidden">

            <div className="p-4 md:p-8">

                <h2 className="text-lg font-bold mb-3">Categorias</h2>
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
                    className="w-full pb-4"
                >
                    {categoriasData.map((cat) => (
                        <SwiperSlide key={cat.idcategoria}>
                            <Link
                                href={`/categoria/${cat.idcategoria}`}
                                className="card card-compact bg-base-100 shadow-xl h-full w-full max-w-[140px] md:max-w-none hover:-translate-y-1 transition-transform duration-300 overflow-hidden block transform-gpu translate-z-0 will-change-transform"
                            >
                                <figure className="h-32 md:h-40 w-full">
                                    <img src={cat.img_cat} alt={cat.nomecategoria} className="w-full h-full object-cover object-top" loading="lazy" />
                                </figure>
                                <div className="card-body items-center text-center p-2 bg-[var(--surface)]">
                                    <h2 className="card-title text-xs md:text-sm m-0">{cat.nomecategoria}</h2>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <h2 className="text-lg font-bold mt-8 mb-3">Restaurantes</h2>

                <div className="flex flex-col gap-6 md:carousel md:carousel-center md:flex-row md:gap-4 md:overflow-x-auto">

                    {turmaDataNOVO.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 opacity-60 text-center">
                            <p className="font-bold text-lg">Nenhum restaurante aberto no momento</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 md:carousel md:carousel-center md:flex-row md:gap-4 md:overflow-x-auto">

                            {turmaDataNOVO.map((item) => (
                                <div key={item.idturma} className="w-full md:w-80 md:carousel-item md:shrink-0">
                                    <div className="card card-compact bg-base-100 shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300 outline-0">

                                        <figure className="relative h-48">
                                            <Link href={`/course/${item.idturma}`} className="block w-full h-full">
                                                <img
                                                    src={item.imagemcurso}
                                                    alt={item.nomeres}
                                                    className="w-full h-full object-cover "
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                            </Link>
                                        </figure>

                                        <div className="card-body grow-0 p-4">
                                            <h2 className="card-title text-lg">{item.ano}° {item.nomecurso}</h2>

                                            <p className="text-sm opacity-90">{item.descricao}</p>

                                            <p className="text-sm h-5 text-(--text) font-semibold">Servimos:</p>

                                            {item.resumoprodutos && (
                                                <ul className=" text-sm flex flex-col justify-start list-disc list-inside opacity-80 space-y-1">
                                                    {item.resumoprodutos.map((e) => (
                                                        <li key={e.idresumo}>{e.nome}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
