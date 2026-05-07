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


    // console.log("ID da URL:", id);
    // console.log("Produtos no Contexto:", produtosGlobais);

    if (!produtoSelecionado) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p>Carregando informações do produto...</p>
                <Link href="/" className="text-vermelho underline mt-4">Voltar para a listagem</Link>
            </div>
        );
    }

    const handleIncrease = () => setItemquantity(prev => prev + 1);
    const handleDecrease = () => setItemquantity(prev => (prev > 1 ? prev - 1 : 1));
    const handleChangePage = (event, value) => {
        setPage(value);
    }

    const handleAddToCart = () => {
        // 1. Envia os dados para o nosso "Cofre" do carrinho
        adicionarAoCarrinho(produtoSelecionado, itemquantity, observacao);

        // 2. Redireciona o utilizador para a página do carrinho
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
                        minRows={3}
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        placeholder="Ex: Sem cebola, ponto da carne, etc..."
                        className='w-full bg-[var(--surface)] text-[var(--text)] border-2 border-[#514442]/20 p-4 rounded-xl focus:border-[#D95032] outline-none transition-colors placeholder:text-[var(--text)]'
                    />
                </section>

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