"use client";
import HeaderBar from "../components/HeaderPage";

export default function HomePage() {
    const categorias = [
        { nome: "Hambúrguer", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
        { nome: "Pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop" },
        { nome: "Sushi", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop" },
        { nome: "Batata Frita", img: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=300&fit=crop" },
        { nome: "Salada", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop" },
        { nome: "Macarrão", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop" },
    ];

    const destaques = [
        { titulo: "Combo Especial", desc: "Hambúrguer + Batata + Refri", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop" },
        { titulo: "Festival de Sushi", desc: "30 peças por um preço especial", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=400&fit=crop" },
        { titulo: "Pizza Gigante", desc: "Sabor dobrado, diversão garantida", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop" },
    ];

    return (
        <div className="min-h-screen w-screen overflow-x-hidden ">

            <div className="p-4 md:p-8">

                <h2 className="text-lg font-bold mb-3">Produtos</h2>
                <div className="carousel carousel-center gap-4 w-full scrollbar-hide overflow-x-auto">
                    {categorias.map((cat) => (
                        <div key={cat.nome} className="carousel-item">
                            <div className="card card-compact bg-base-100 shadow-xl w-32 md:w-56">
                                <figure className="h-32 md:h-40">
                                    <img src={cat.img} alt={cat.nome} className="w-full h-full object-cover" />
                                </figure>
                                <div className="card-body items-center text-center p-2">
                                    <h2 className="card-title text-xs md:text-sm">{cat.nome}</h2>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                <h2 className="text-lg font-bold mt-8 mb-3">Restaurantes</h2>
                <div className="flex flex-col gap-4 md:carousel md:carousel-center md:flex-row md:gap-4 md:w-full scrollbar-hide overflow-x-auto">
                    {destaques.map((item) => (
                        <div key={item.titulo} className="md:carousel-item w-full md:w-96">
                            <div className="card card-compact bg-base-100 shadow-xl overflow-hidden ">
                                <figure className="relative h-48 md:h-56">
                                    <img src={item.img} alt={item.titulo} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 left-0 right-0 h-1/4  from-black/70 to-transparent" />
                                </figure>
                                <div className="card-body p-4">
                                    <h2 className="card-title text-lg md:text-xl">{item.titulo}</h2>
                                    <p className="text-sm md:text-base opacity-70">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
