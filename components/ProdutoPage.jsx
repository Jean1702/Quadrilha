'use client'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { Minus, Plus } from "lucide-react"
import Link from 'next/link';
import { ProductContext } from "@/context/ProductContext"


export default function ProdutoPage() {

    const { id } = useParams()
    const { produtosGlobais, imagensGlobais } = useContext(ProductContext)

    const [page, setPage] = useState(1)
    const [itemquantity, setItemquantity] = useState(1);

    const produtoSelecionado = produtosGlobais.find(p => String(p.idproduto) === String(id))
    const imagensDesteProduto = imagensGlobais.filter(img => String(img.idproduto) == String(id))


    // console.log("ID da URL:", id);
    // console.log("Produtos no Contexto:", produtosGlobais);

    const products = [
        {
            nome: 'Clássico Burger',
            url: 'hamburguer.png',
            descricao: 'Suculento blend bovino de 160g, queijo cheddar derretido, alface fresca e tomate no pão brioche tostado.'
        },
        {
            nome: 'Bacon Blast',
            url: 'hamburguer2.png',
            descricao: 'Hambúrguer artesanal com generosas fatias de bacon crocante, cebola caramelizada e molho barbecue especial.'
        },
        {
            nome: 'Double Cheese Trufado',
            url: 'hamburguer3.png',
            descricao: 'Dois blends de carne, camada dupla de queijo prato, picles de pepino e um toque de maionese trufada.'
        }
    ];


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

    const imagemAtual = imagensDesteProduto[page - 1]?.url_imagem || `${products.find((e) => e.url === 'hamburguer2.png')}`;

    return (
        <div className="min-h-screen font-sans">

            <div className="w-full max-w-2xl mx-auto overflow-hidden sm:rounded-b-3xl shadow-lg">
                <img className="w-full h-72 object-cover"
                    src={imagemAtual}
                    alt={`${produtoSelecionado.nome} - Imagem ${page}`} />
            </div>
            <div className="flex justify-center -mt-6 relative z-10">
                <Stack spacing={2} className='bg-[var(--bg)] shadow-md border border-[#514442]/10 rounded-full px-4 py-2'>
                    <Pagination
                        count={imagensDesteProduto.length}
                        page={page}
                        hidePrevButton 
                        hideNextButton 
                        onChange={handleChangePage}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: 'transparent', // Esconde os números
                                minWidth: '8px',      // Força a largura
                                width: '10px',
                                height: '12px',        // Força a altura
                                borderRadius: '50%',  // Deixa perfeitamente redondo
                                backgroundColor: 'rgba(255, 255, 255, 0.3)', // Cor da bolinha inativa (branca com transparência)
                                margin: '0 4px',
                            },
                            '& .Mui-selected': {
                                backgroundColor: '#ffffff !important', // Cor da bolinha ativa (branca sólida)
                            }
                        }}
                    />
                </Stack>
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

                    <button className="w-full bg-[var(--surface)] hover:bg-[#D95032]  font-bold py-4 rounded-full uppercase tracking-widest transition-all transform active:scale-95 cursor-pointer">
                        <Link href={'/cart'}>
                            Adicionar ao Carrinho
                        </Link>
                    </button>
                </footer>
            </main>
        </div>
    )
}