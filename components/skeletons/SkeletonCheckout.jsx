export default function SkeletonCheckout() {
    return (
        <main className="max-w-4xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-5 gap-8 mt-2 w-full overflow-x-hidden">
            
            {/* === COLUNA ESQUERDA: ITENS DO CARRINHO (Ocupa 3 colunas) === */}
            <div className="lg:col-span-3 space-y-4">
                <section className="bg-(--surface) p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    
                    {/* Cabeçalho "Itens do carrinho" */}
                    <div className="flex items-center gap-3 mb-8">
                        {/* Simula o ícone laranja */}
                        <div className="w-10 h-10 bg-slate-500 dark:bg-slate-600 rounded-lg animate-pulse shrink-0"></div>
                        {/* Texto do título */}
                        <div className="h-6 w-48 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                    </div>

                    {/* Lista de Itens (Simulando 3 produtos) */}
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={`item-${i}`} className="flex justify-between items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        {/* Badge de Quantidade (Ex: 2x) */}
                                        <div className="w-8 h-6 bg-slate-400 dark:bg-slate-700 rounded-lg shrink-0 animate-pulse"></div>
                                        
                                        {/* Nome e Observação */}
                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="h-4 w-3/4 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                                            {/* Linha menor simulando a observação */}
                                            <div className="h-2 w-1/2 bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Preço do Item */}
                                <div className="h-4 w-20 bg-slate-500 dark:bg-slate-600 rounded-full shrink-0 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* === COLUNA DIREITA: PAGAMENTO E FINALIZAÇÃO (Ocupa 2 colunas) === */}
            <div className="lg:col-span-2">
                <section className="bg-(--surface) p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm sticky top-8">
                    
                    {/* Cabeçalho "Pagamento" */}
                    <div className="h-6 w-32 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse mb-6"></div>

                    {/* Lista de Opções de Pagamento (Pix, Cartões, Dinheiro) */}
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={`pagamento-${i}`} className="w-full flex items-center p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                                {/* Quadrado do ícone do método */}
                                <div className="w-10 h-10 rounded-xl bg-slate-400 dark:bg-slate-700 mr-4 shrink-0 animate-pulse"></div>
                                
                                {/* Textos do método */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <div className="h-3 w-24 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                                    <div className="h-2 w-16 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-60"></div>
                                </div>
                                
                                {/* Bolinha lateral (Checkbox) */}
                                <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 animate-pulse"></div>
                            </div>
                        ))}
                    </div>

                    {/* Rodapé: Valor Total e Botão */}
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col gap-3 mb-6">
                            {/* Texto "Valor total da compra" */}
                            <div className="h-2.5 w-32 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                            {/* Valor Gigante */}
                            <div className="h-8 w-48 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                        </div>

                        {/* Botão PAGAR AGORA */}
                        <div className="w-full h-14 bg-slate-500 dark:bg-slate-600 rounded-[40px] animate-pulse"></div>
                    </div>
                </section>
            </div>
            
        </main>
    );
}