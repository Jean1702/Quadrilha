"use client";

import React, { useState, useContext } from 'react';
import { CreditCard, Banknote, ShoppingBasket, ArrowLeft, QrCode, ChevronDown, Info } from 'lucide-react';
import { CartContext } from '@/context/CartContext';
import { CreateClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function MethodPaymentPage() {

    const { carrinho, limparCarrinho } = useContext(CartContext);
    const router = useRouter();
    const supabase = CreateClient();

    const [paymentMethod, setPaymentMethod] = useState('credito');
    const [isLoading, setIsLoading] = useState(false);

    const [cardData, setCardData] = useState({
        number: '',
        name: '',
        expiry: '',
        security_code: '',
        CPF: ''
    });

    const total = carrinho.reduce((acc, item) => acc + item.subtotal, 0);

    const handlePaymentMethodClick = (methodId) => {
        setPaymentMethod(prev => prev === methodId ? null : methodId);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));
    };

    const paymentOptions = [
        { id: 'credito', label: 'Cartão de Crédito', icon: <CreditCard size={25} />, desc: 'Pague pelo site' },
        { id: 'debito', label: 'Cartão de Débito', icon: <Banknote size={25} />, desc: 'Pague pelo site' },
        { id: 'pix', label: 'Pix', icon: <QrCode size={25} />, desc: 'Aprovação instantânea' },
    ];

    // 4. A MÁGICA: Função para processar o Split e Enviar pro Supabase
    const handleFinalizarCompra = async () => {
        if (!paymentMethod) {
            alert("Selecione um método de pagamento!");
            return;
        }

        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        setIsLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert("Você precisa estar logado para finalizar o pedido.");
                return;
            }

            const { data: usuario, error: usuarioError } = await supabase
                .from("usuarios")
                .select("id")
                .eq("user_id", user.id)
                .single();

            if (usuarioError && usuarioError.code !== "PGRST116") {
                throw usuarioError;
            }

            const idUsuarioPedido = usuario?.id || user.id;

            // PASSO A: Agrupar os produtos por Turma (Restaurante/Barraca)
            const pedidosPorTurma = carrinho.reduce((acc, item) => {
                const idTurma = item.produto.idturma;
                // Se a turma ainda não existe no acumulador, cria um espaço pra ela
                if (!acc[idTurma]) {
                    acc[idTurma] = { totalDaTurma: 0, itens: [] };
                }
                // Adiciona o item e soma o valor no total específico DESSA turma
                acc[idTurma].itens.push(item);
                acc[idTurma].totalDaTurma += item.subtotal;
                return acc;
            }, {});

            for (const idTurmaString in pedidosPorTurma) {
                const pacote = pedidosPorTurma[idTurmaString];

                // 1. Cria a venda (Nota Fiscal) para a Turma específica
                const { data: novaVenda, error: erroVenda } = await supabase
                    .from('venda')
                    .insert([{
                        iduser: idUsuarioPedido,
                        status: 'aguardando_pagamento',
                        valor_total: pacote.totalDaTurma,
                        metodo_pagamento: paymentMethod, // 'credito', 'debito' ou 'pix'
                        idturma: parseInt(idTurmaString),
                        online: true,
                    }])
                    .select()
                    .single();

                if (erroVenda) throw erroVenda;

                // 2. Prepara os itens para vincular com a Venda que acabou de ser criada
                const itensParaInserir = pacote.itens.map(item => ({
                    idvenda: novaVenda.idvenda,
                    idproduto: item.produto.idproduto,
                    quantidade: item.quantidade,
                    observacao: item.observacao || null
                }));

                // 3. Insere todos os itens da turma na tabela venda_produto
                const { error: erroItens } = await supabase
                    .from('venda_produto')
                    .insert(itensParaInserir);

                if (erroItens) throw erroItens;
            }
            limparCarrinho();
            alert("Pedido realizado com sucesso!");
            router.push('/'); // Ou mande para uma página de "Sucesso"

        } catch (error) {
            console.error("Erro ao salvar pedido:", error);
            alert("Houve um erro ao processar o seu pedido. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (


        <main className="max-w-4xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-5 gap-8 mt-2">
            <div className="lg:col-span-3 space-y-4">
                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-[var(--color-laranja)] p-2 rounded-lg">
                            <ShoppingBasket className="text-white" size={20} />
                        </div>
                        <h2 className="font-bold text-gray-900 text-xl tracking-tight">Itens do carrinho</h2>
                    </div>

                    <div className="space-y-6">
                        {carrinho.map((item) => (
                            <div key={item.idItemCarrinho} className="flex justify-between items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-800 font-bold text-sm bg-gray-50 px-2 py-0.5 rounded-lg shrink-0">
                                            {item.quantidade}x
                                        </span>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold text-gray-900 leading-tight">{item.produto.nome}</p>
                                            {item.observacao && (
                                                <span className="text-[11px] text-gray-400 italic line-clamp-1 mt-0.5">Obs: {item.observacao}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-gray-600 shrink-0">
                                    R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="lg:col-span-2">
                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-8">
                    <h2 className="text-lg font-extrabold mb-6 text-gray-900">Pagamento</h2>

                    <div className="space-y-3">
                        {paymentOptions.map((option) => {
                            const isSelected = paymentMethod === option.id;
                            const isCard = option.id === 'credito' || option.id === 'debito';

                            return (
                                <div key={option.id} className="overflow-hidden">
                                    <button
                                        onClick={() => handlePaymentMethodClick(option.id)}
                                        className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all text-left
                                                ${isSelected ? 'border-gray-600' : 'border-gray-50 hover:border-gray-200 bg-gray-50/30'}
                                            `}
                                    >
                                        <div className={`mr-4 p-2 rounded-xl ${isSelected ? 'bg-[var(--color-laranja)] text-white' : 'bg-white text-gray-400 border border-gray-100'}`}>
                                            {option.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-[13px] font-bold ${isSelected ? 'text-black-600' : 'text-gray-700'}`}>
                                                {option.label}
                                            </p>
                                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{option.desc}</p>
                                        </div>

                                        <div className={`transition-transform duration-300 ${isSelected ? 'rotate-180' : ''}`}>
                                            {isCard ? (
                                                <ChevronDown size={18} className="text-gray-400" />
                                            ) : (
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-gray-500' : 'border-gray-200'}`}>
                                                    {isSelected && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                                                </div>
                                            )}
                                        </div>
                                    </button>

                                    <div className={`transition-all duration-300 ease-in-out ${isSelected && isCard ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                        <div className="p-4 bg-gray-50 rounded-2xl space-y-3 border border-gray-100">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Número do Cartão</label>
                                                <input
                                                    type="text"
                                                    name="number"
                                                    placeholder="0000 0000 0000 0000"
                                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nome no Cartão</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="João Carlos da Silva"
                                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Vencimento</label>
                                                    <input
                                                        type="text"
                                                        name="expiry"
                                                        placeholder="MM/AA"
                                                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Código de segurança</label>
                                                    <input
                                                        type="text"
                                                        name="security_code"
                                                        placeholder="123"
                                                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className='col-span-2 flex flex-col'>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">CPF/RG</label>
                                                    <input
                                                        type="text"
                                                        name="CPF"
                                                        placeholder="999.999.999-99"
                                                        className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                        onChange={handleInputChange}
                                                    />

                                                    <div className='flex items-start gap-2 mt-5'>
                                                        <Info size={15} className="text-gray-400 shrink-0 mt-0.5" />
                                                        <p className='text-[10px] text-gray-500 leading-tight flex-1'>
                                                            Nenhum dado será armazenado em nossa base de dados.
                                                            Todos os dados bancários serão utilizados apenas para a efetuação do pagamento.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex flex-col mb-6">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Valor total da compra</span>
                            <span className="text-3xl font-black text-gray-900 leading-tight">
                                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <button
                            onClick={handleFinalizarCompra}
                            disabled={isLoading || carrinho.length === 0}
                            className="w-full bg-[var(--color-laranja)] hover:brightness-95 text-black font-bold py-4 rounded-[40px] transition-all active:scale-95 shadow-lg shadow-yellow-900/10 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'PROCESSANDO...' : 'PAGAR AGORA'}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}