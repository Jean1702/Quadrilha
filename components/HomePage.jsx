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
    const [turmaDataNOVO, setTurmaData] = useState(turmasData);

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

        setTurmaData((turmasData) => {
            let novaLista = []; 

            if (lojaAtualizada.is_active) {
                const lojaJaExiste = turmasData.some(loja => loja.idturma === lojaAtualizada.idturma);
                
                if (lojaJaExiste) {
                novaLista = turmasData.map(loja => loja.idturma === lojaAtualizada.idturma ? lojaAtualizada : loja);
                } else {
                novaLista = [...turmasData, lojaAtualizada];
                }
            } else {
                novaLista = turmasData.filter(loja => loja.idturma !== lojaAtualizada.idturma);
            }

            return novaLista.sort((a, b) => a.idturma - b.idturma); 
            
          
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channelTodasAsLojas);
  };
}, []); // O array vazio [] significa que esse canal vai ser criado uma vez só quando a Home carregar
    // const cursos = [
    //     {
    //         id: "info-1",
    //         titulo: "Informática 1º ano",
    //         desc: "Introdução à criatividade digital para animar a festa com tecnologia.",
    //         subDesc: "Nossa barraca oferece:",
    //         itens: ["Pastel", "Pipoca", "Bolo de milho", "Bebidas"],
    //         img: "/conectados.jpg"
    //     },
    //     {
    //         id: "info-2",
    //         titulo: "Informática 2º ano",
    //         desc: "Diversão digital e interação para envolver todos na quadrilha.",
    //         subDesc: "Você encontra:",
    //         itens: ["Caldo de cana", "Espetinho", "Algodão doce", "Suco natural"],
    //         img: "/conectados.jpg"
    //     },
    //     {
    //         id: "info-3",
    //         titulo: "Informática 3º ano",
    //         desc: "Experiências digitais completas que animam a festa junina.",
    //         subDesc: "Oferecemos:",
    //         itens: ["Cachorro-quente", "Pipoca doce", "Biscoitos juninos", "Bebidas geladas"],
    //         img: "/conectados.jpg"
    //     },

    //     {
    //         id: "auto-1",
    //         titulo: "Automação 1º ano",
    //         desc: "Brincadeiras automatizadas para tornar a festa mais divertida e moderna.",
    //         subDesc: "Experimente nossas delícias:",
    //         itens: ["Espetinho de carne", "Pastel frito", "Suco natural", "Pipoca"],
    //         img: "/automacao.jpg"
    //     },
    //     {
    //         id: "auto-2",
    //         titulo: "Automação 2º ano",
    //         desc: "Tecnologia que transforma cada atração em momentos únicos e interativos.",
    //         subDesc: "Servimos:",
    //         itens: ["Caldo de feijão", "Pipoca salgada", "Bolo de milho", "Refrigerante"],
    //         img: "/automacao.jpg"
    //     },
    //     {
    //         id: "auto-3",
    //         titulo: "Automação 3º ano",
    //         desc: "Inovação em cada detalhe para entreter todos os participantes.",
    //         subDesc: "Aproveite nossas opções:",
    //         itens: ["Hambúrguer artesanal", "Pastel", "Espetinho de frango", "Bebidas variadas"],
    //         img: "/automacao.jpg"
    //     },

    //     {
    //         id: "edif-1",
    //         titulo: "Edificações 1º ano",
    //         desc: "Decoração e estrutura criativa para ambientar a festa junina.",
    //         subDesc: "No nosso espaço, você encontra:",
    //         itens: ["Bolo de fubá", "Pipoca doce", "Biscoito amanteigado", "Suco natural"],
    //         img: "/edificacoes.jpg"
    //     },
    //     {
    //         id: "edif-2",
    //         titulo: "Edificações 2º ano",
    //         desc: "Ambientes temáticos que deixam a festa ainda mais bonita e acolhedora.",
    //         subDesc: "Servimos:",
    //         itens: ["Espetinho", "Pastel de carne", "Cachorro-quente", "Refrigerante"],
    //         img: "/edificacoes.jpg"
    //     },
    //     {
    //         id: "edif-3",
    //         titulo: "Edificações 3º ano",
    //         desc: "Grandes estruturas que proporcionam uma experiência completa da festa junina.",
    //         subDesc: "Você vai encontrar:",
    //         itens: ["Caldo verde", "Bolo de milho", "Pipoca salgada", "Bebidas geladas"],
    //         img: "/edificacoes.jpg"
    //     },

    //     {
    //         id: "eletro-1",
    //         titulo: "Eletrotécnica 1º ano",
    //         desc: "Iluminação e energia para deixar a festa animada e segura.",
    //         subDesc: "Nossa barraca oferece:",
    //         itens: ["Pipoca doce", "Bolo de milho", "Espetinho de carne", "Suco natural"],
    //         img: "/eletro.jpg"
    //     },
    //     {
    //         id: "eletro-2",
    //         titulo: "Eletrotécnica 2º ano",
    //         desc: "Efeitos elétricos que destacam a festa e encantam os visitantes.",
    //         subDesc: "Servimos:",
    //         itens: ["Pastel de queijo", "Cachorro-quente", "Refrigerante", "Pipoca salgada"],
    //         img: "/eletro.jpg"
    //     },
    //     {
    //         id: "eletro-3",
    //         titulo: "Eletrotécnica 3º ano",
    //         desc: "Energia e tecnologia garantindo iluminação e efeitos especiais na festa.",
    //         subDesc: "Aproveite nossas opções:",
    //         itens: ["Hambúrguer artesanal", "Bolo de fubá", "Espetinho de frango", "Bebidas variadas"],
    //         img: "/eletro.jpg"
    //     },

    //     {
    //         id: "seg-1",
    //         titulo: "Segurança do Trabalho 1º ano",
    //         desc: "Garantindo a diversão com segurança para todos os participantes.",
    //         subDesc: "Oferecemos:",
    //         itens: ["Pipoca", "Pastel", "Suco natural", "Bolo de milho"],
    //         img: "/seguranca.jpg"
    //     },
    //     {
    //         id: "seg-2",
    //         titulo: "Segurança do Trabalho 2º ano",
    //         desc: "Acompanhando a festa para que todos aproveitem com tranquilidade.",
    //         subDesc: "Servimos:",
    //         itens: ["Espetinho", "Cachorro-quente", "Refrigerante", "Pipoca doce"],
    //         img: "/seguranca.jpg"
    //     }
    // ];


    return (
        <div className="min-h-screen w-full overflow-x-hidden">

            <div className="p-4 md:p-8">

                <h2 className="text-lg font-bold mb-3">Produtos</h2>
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
                                href={`/product`}
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

                <h2 className="text-lg font-bold mt-8 mb-3">Restaurantes</h2>

                <div className="flex flex-col gap-6 md:carousel md:carousel-center md:flex-row md:gap-4 md:overflow-x-auto">

                    {turmaDataNOVO.map((item) => (
                        <div key={item.idturma} className="w-full md:w-80 md:carousel-item md:shrink-0">
                            <div className="card card-compact bg-base-100 shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300 outline-0">

                                <figure className="relative h-48">
                                    <Link href="/course" className="block w-full h-full">
                                        <img
                                            src={item.imagemcurso}
                                            alt={item.nomeres}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                    </Link>
                                </figure>

                                <div className="card-body p-4">
                                    <h2 className="card-title text-lg">{item.ano} {item.nomecurso}</h2>

                                    <p className="text-sm opacity-70">{item.descricao}</p>

                                    {item.subDesc && (
                                        <p className="text-sm text-primary font-semibold">{item.subDesc}</p>
                                    )}

                                    {item.itens && (
                                        <ul className="mt-2 text-sm list-disc list-inside opacity-80 space-y-1">
                                            {item.itens.map((it, index) => (
                                                <li key={index}>{it}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}
