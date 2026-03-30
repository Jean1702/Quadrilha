"use client";
import Link from "next/link";
export default function CursoPage() {

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

    const produto = [
        {
            nome: "Hamburguer artesanal",
            descricao: "Hamburguers saborosos e suculentos.",
            produtos: [
                {
                    nome: "Hamburguer Classico",
                    descricao: "Pão brioche, hamburguer 160g, queijo cheddar, cebola, alface, tomate e maionese da casa.",
                    imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
                },
                {
                    nome: "Hamburguer com Bacon",
                    descricao: "Pao brioche, hamburguer 160g, queijo cheddar, bacon, cebola, alface, tomate e maionese da casa.",
                    imagem: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80",
                },

                {
                    nome: "Hamburguer Duplo",
                    descricao: "Pão brioche, 2 hamburguers 160g, queijo cheddar duplo, cebola, alface, tomate e maionese da casa.",
                    imagem: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=900&q=80",
                },
            ],
        }
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

        <main className="min-h-screen ">
            
            <section className="px-4 pb-16 md:px-8 mt-10 lg:px-12">
                <div className="mx-auto max-w-6xl b space-y-10">
                    {produto.map((categoria) => (
                        <div key={categoria.nome} className="space-y-5 rounded-[2rem] bg-[var(--surface)] p-5  md:p-8">
                            <div className="flex flex-col gap-2 pb-4">
                                <p className="text-md font-semibold uppercase tracking-[0.25em] text-vermelho">Produtos</p>
                                <h2 className="text-2xl font-black md:text-3xl">{categoria.nome}</h2>
                                <p className="max-w-3xl text-md leading-7 text-preto md:text-base">{categoria.descricao}</p>
                            </div>

                            <div className="space-y-4">
                                {categoria.produtos.map((produto) => (
                                    <Link
                                        key={produto.nome}
                                        href="/product"
                                        className="flex flex-col rounded-[1.5rem] bg-[var(--card)] md:min-h-44 md:flex-row  hover:-translate-y-1 transition-transform duration-300"
                                    >
                                        <div className="h-48 md:h-auto md:w-1/5">
                                            <img src={produto.imagem} className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col justify-center gap-3 px-5 py-5 md:px-7">
                                            <h3 className="text-xl font-black  md:text-2xl">{produto.nome}</h3>
                                            <p className="max-w-3xl text-md leading-7  md:text-base">
                                                {produto.descricao}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
        </>
    )
}