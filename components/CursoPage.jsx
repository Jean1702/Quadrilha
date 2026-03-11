export default function CursoPage() {

    const curso = {
        nome: "Informatíca",
        chamada: "Venha saborear os melhores hamburgueres artesanais da região.",
    };

    const categorias = [
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
        <main className="min-h-screen bg-preto text-preto">
            <section className="px-4 pb-10 pt-6 md:px-8 lg:px-12">
                <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[2rem]  bg-bege text-white">
                    <div className="flex flex-col gap-8 px-6 py-8 md:px-10 md:py-12 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl space-y-4 text-shadow-lg">

                            <h1 className="text-4xl font-black md:text-5xl lg:text-6xl">
                                {curso.nome}
                            </h1>
                            <p className="max-w-2xl text-md leading-7 text-preto md:text-lg">
                                {curso.chamada}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="px-4 pb-16 md:px-8 lg:px-12">
                <div className="mx-auto max-w-6xl space-y-10">
                    {categorias.map((categoria) => (
                        <div key={categoria.nome} className="space-y-5 rounded-[2rem] bg-bege p-5  md:p-8">
                            <div className="flex flex-col gap-2 pb-4">
                                <p className="text-md font-semibold uppercase tracking-[0.25em] text-vermelho">Produtos</p>
                                <h2 className="text-2xl font-black md:text-3xl">{categoria.nome}</h2>
                                <p className="max-w-3xl text-md leading-7 text-preto md:text-base">{categoria.descricao}</p>
                            </div>

                            <div className="space-y-4">
                                {categoria.produtos.map((produto) => (
                                    <div
                                        key={produto.nome}
                                        className="flex flex-col rounded-[1.5rem] bg-amarelo-900 md:min-h-44 md:flex-row  hover:-translate-y-1 transition-transform duration-300"
                                    >
                                        <div className="h-48 md:h-auto md:w-1/5">
                                            <img src={produto.imagem} className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-1 flex-col justify-center gap-3 px-5 py-5 md:px-7">
                                            <h3 className="text-xl font-black text-preto md:text-2xl">{produto.nome}</h3>
                                            <p className="max-w-3xl text-md leading-7 text-preto/70 md:text-base">
                                                {produto.descricao}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}