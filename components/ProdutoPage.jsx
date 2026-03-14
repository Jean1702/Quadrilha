'use client'
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useState } from 'react';
import { Minus, Plus } from "lucide-react"

export default function ProdutoPage() {


    const [page, setPage] = useState(1)
    const [itemquantity, setItemquantity] = useState(1);
    const precoUnitario = 39.99;


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

    const handleIncrease = () => setItemquantity(prev => prev + 1);
    const handleDecrease = () => setItemquantity(prev => (prev > 1 ? prev - 1 : 1));
    const handleChangePage = (event, value) => {
        setPage(value);
    }

    return (
        <div className="min-h-screen bg-[#F2F2F2] text-[#0D0D0D] font-sans">


            <div className="w-full max-w-2xl mx-auto overflow-hidden sm:rounded-b-3xl shadow-lg">
                <img className="w-full h-72 object-cover"
                    src={products[page - 1]?.url}
                    alt={products[page - 1]?.nome} />
            </div>
            <div className="flex justify-center -mt-6 relative z-10">
                <Stack spacing={2} className='bg-[#0D0D0D]/10 backdrop-blur-md border border-[#0D0D0D]/10 rounded-full px-2 py-1'>
                    <Pagination
                        count={products.length}
                        page={page}
                        size="small"
                        onChange={handleChangePage}
                        sx={{
                            '& .MuiPaginationItem-root': { color: '#0D0D0D' },
                            '& .Mui-selected': { backgroundColor: '#D95032 !important', color: '#F2F2F2' }
                        }}
                    />
                </Stack>
            </div>

            <main className="container max-w-lg mx-auto p-6 flex flex-col gap-8">

                <section className="text-center space-y-4">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-[#0D0D0D]">
                        {products[page - 1]?.nome}
                    </h1>
                    <p className='text-sm leading-relaxed text-[#0D0D0D]/80'>
                        {products[page - 1]?.descricao}
                    </p>
                </section>

                <section className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase text-[#0D0D0D]/60 ml-1">Observações</label>
                    <TextareaAutosize
                        minRows={3}
                        placeholder="Ex: Sem cebola, ponto da carne, etc..."
                        className='w-full bg-white text-[#0D0D0D] border-2 border-[#0D0D0D]/10 p-4 rounded-xl focus:border-[#D95032] outline-none transition-colors'
                    />
                </section>

                <footer className="flex flex-col gap-6 mt-auto">
                    <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm">

                        <div className="flex items-center border-2 border-[#0D0D0D] rounded-lg overflow-hidden">
                            <button onClick={handleDecrease} className="p-2 hover:bg-[#F2F2F2] transition-colors cursor-pointer">
                                <Minus size={18} />
                            </button>
                            <span className="w-12 text-center font-bold text-lg">{itemquantity}</span>
                            <button onClick={handleIncrease} className="p-2 hover:bg-[#F2F2F2] transition-colors cursor-pointer">
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="text-right">
                            <p className="text-xs uppercase font-bold text-[#0D0D0D]/50">Subtotal</p>
                            <p className="text-2xl font-black text-[#D95032]">
                                R$ {(precoUnitario * itemquantity).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <button className="w-full bg-[#0D0D0D] hover:bg-[#D95032] text-[#F2F2F2] font-bold py-4 rounded-2xl uppercase tracking-widest transition-all transform active:scale-95 cursor-pointer">
                        Adicionar ao Carrinho
                    </button>
                </footer>
            </main>
        </div>
    )
}