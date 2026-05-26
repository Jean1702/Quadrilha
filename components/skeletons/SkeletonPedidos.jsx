export default function SkeletonPedidos() {
    return (
        <main className="min-h-screen pb-24 w-full overflow-x-hidden">
            
            {/* === HEADER === */}
            <div className="h-20 w-full bg-slate-500 dark:bg-slate-700 animate-pulse"></div>
            <div className="h-32"></div>

            <div className="p-4 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* Gerando 6 cards falsos compostos APENAS de linhas de texto e botões */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={`pedido-${i}`}
                            className="bg-(--surface) rounded-[20px] p-4 shadow-lg border border-slate-100 dark:border-slate-800"
                        >
                            {/* CABEÇALHO: Pedido # e Status */}
                            <div className="flex items-center justify-between mb-3">
                                {/* Título "Pedido #ID" */}
                                <div className="h-5 w-24 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                {/* Badge de Status */}
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-700 animate-pulse"></div>
                                    <div className="h-3 w-16 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            {/* DETALHES DO PEDIDO: Cliente, Quantidade e Itens */}
                            <div className="space-y-2 mb-4 mt-2">
                                {/* Linha: Cliente */}
                                <div className="h-4 w-3/4 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                {/* Linha: Quantidade */}
                                <div className="h-4 w-1/2 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                
                                {/* Linha: Itens (Título e lista simulada) */}
                                <div className="h-4 w-1/4 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mt-3"></div>
                                <div className="flex flex-col gap-1.5 ml-2 mt-1">
                                    <div className="h-3 w-2/3 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                    <div className="h-3 w-1/2 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            {/* BOTÕES DE AÇÃO */}
                            <div className="flex flex-col gap-2 mt-4">
                                {/* Linha 1: Preparar / Pronto */}
                                <div className="flex gap-2">
                                    <div className="h-9 flex-1 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-50"></div>
                                    <div className="h-9 flex-1 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-50"></div>
                                </div>
                                {/* Linha 2: Entregue */}
                                <div className="h-9 w-full bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-50"></div>
                                {/* Linha 3: Cancelar */}
                                <div className="h-9 w-full bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-50"></div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </main>
    );
}