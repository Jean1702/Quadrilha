'use client'
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { Minus, Plus } from "lucide-react"
import Link from 'next/link';
import { ProductContext } from "@/context/ProductContext"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/context/CartContext';

export default function ProdutoPage() {

    const { id } = useParams()
    const { produtosGlobais, imagensGlobais } = useContext(ProductContext)

    const router = useRouter();
    const { adicionarAoCarrinho } = useContext(CartContext);

    const [itemquantity, setItemquantity] = useState(1);
    const [observacao, setObservacao] = useState('');


    const produtoSelecionado = produtosGlobais.find(p => String(p.idproduto) === String(id))
    const imagensDesteProduto = imagensGlobais.filter(img => String(img.idproduto) == String(id))


    if (!produtoSelecionado) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p>Carregando informações do produto...</p>
                <Link href="/" className="text-vermelho underline mt-4">Voltar para a listagem</Link>
            </div>
        );
    }

    const handleIncrease = () => {
        setItemquantity(prev => (prev < produtoSelecionado.estoque ? prev + 1 : prev));
    };

    const handleDecrease = () => setItemquantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {

        if (produtoSelecionado.estoque === 0) return;

        adicionarAoCarrinho(produtoSelecionado, itemquantity, observacao);

        router.push('/cart');
    };

    return (
        <div className="min-h-screen font-sans">

            <div className="w-full max-w-2xl mx-auto overflow-hidden sm:rounded-b-3xl shadow-lg" >
                <Swiper
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    spaceBetween={0}
                    slidesPerView={1}
                    className="w-full h-72"
                >
                    {imagensDesteProduto.length === 0 && (
                        <SwiperSlide>
                            <img className="w-full h-full object-cover" src="/placeholder.png" alt="Sem imagem" />
                        </SwiperSlide>
                    )}

                    {imagensDesteProduto.map((img) => (
                        <SwiperSlide key={img.idimagem}>
                            <img
                                className="w-full h-full object-cover"
                                src={img.url_imagem}
                                alt={produtoSelecionado.nome}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <main className="container max-w-lg mx-auto p-6 flex flex-col gap-8">

                <section className="text-center space-y-4">
                    <h1 className="text-4xl font-black uppercase tracking-tighter ">
                        {produtoSelecionado.nome}
                    </h1>
                    <p className='text-sm leading-relaxed '>
                        {produtoSelecionado.descricao}
                    </p>
                </section>

                <section className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase  ml-1">Observações</label>
                    <TextareaAutosize
                        maxLength={255}
                        minRows={3}
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        placeholder="Ex: Sem cebola, ponto da carne, etc..."
                        className='w-full bg-[var(--surface)] text-[var(--text)] border-2 border-[#514442]/20 p-4 rounded-xl focus:border-[#D95032] outline-none transition-colors placeholder:text-[var(--text)]'
                    />
                </section>

                <div className="mt-2 flex items-center">
                    <span
                        // AUMENTADO: w-full para ocupar tudo, px-6 py-3.5 para ficar mais alto, text-sm md:text-base para fonte maior
                        className={`inline-flex w-full justify-center items-center gap-3 px-6 py-3.5 text-sm md:text-base font-bold uppercase tracking-widest rounded-xl border-2 transition-colors ${produtoSelecionado.estoque > 5
                            // Estoque Alto
                            ? "bg-[var(--surface)] border-[#514442]/20 text-[var(--text)]"
                            : produtoSelecionado.estoque > 0
                                // Estoque Baixo
                                ? "bg-[#D95032]/10 border-[#D95032]/30 text-[#D95032]"
                                // Esgotado
                                : "bg-[var(--surface)] border-[#514442]/10 text-[#514442]/50"
                            }`}
                    >
                        {/* AUMENTADO: Bolinha passou de h-2.5 para h-3.5 para acompanhar o texto maior */}
                        {produtoSelecionado.estoque > 0 && produtoSelecionado.estoque <= 5 && (
                            <span className="relative flex h-3.5 w-3.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D95032] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#D95032]"></span>
                            </span>
                        )}

                        {produtoSelecionado.estoque > 5
                            ? `Estoque: ${produtoSelecionado.estoque} unidades`
                            : produtoSelecionado.estoque > 0
                                ? `Últimas ${produtoSelecionado.estoque} unidades!`
                                : "Produto Esgotado"}
                    </span>
                </div>

                <footer className="flex flex-col gap-6 mt-auto">
                    <div className="flex items-center justify-between bg-[var(--surface)] border border-[#514442]/10 p-4 rounded-2xl shadow-sm">

                        <div className="flex items-center border-2 border-[#514442] rounded-lg overflow-hidden">
                            <button onClick={handleDecrease} className="p-2 hover:bg-[#514442]/10 transition-colors cursor-pointer">
                                <Minus size={18} />
                            </button>
                            <span className="w-12 text-center font-bold text-lg">{itemquantity}</span>
                            <button onClick={handleIncrease} className="p-2 hover:bg-[#514442]/10 transition-colors cursor-pointer">
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="text-right">
                            <p className="text-xs uppercase font-bold ">Subtotal</p>
                            <p className="text-2xl font-black text-[var(--card)]">
                                R$ {(produtoSelecionado.preco * itemquantity).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <button className="w-full bg-[var(--surface)] hover:bg-[#D95032]  font-bold py-4 rounded-full uppercase tracking-widest transition-all transform active:scale-95 cursor-pointer"
                        onClick={handleAddToCart}>
                        Adicionar ao Carrinho
                    </button>
                </footer>
            </main>
        </div>
    )
}