export default function SkeletonPedidosFisicos() {
    return (
        <div className="min-h-screen pb-24 w-full overflow-x-hidden">
            
            {/* === SIMULAÇÃO DO ADMIN HEADER === */}
            <div className="h-20 w-full bg-slate-500 dark:bg-slate-700 animate-pulse"></div>
            <div className="h-32"></div>

            <div className="max-w-3xl mx-auto w-full px-4">
                
                {/* === CAIXA DE REGISTRO DO PEDIDO === */}
                <div className="bg-(--surface) p-6 rounded-[20px] shadow-lg mb-6 border border-slate-100 dark:border-slate-800">
                    {/* Título Principal */}
                    <div className="h-6 w-56 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-6"></div>

                    {/* Sessão 1: Adicionar Itens */}
                    <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-black/5 dark:bg-white/5">
                        <div className="h-4 w-40 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-4"></div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            {/* Select Produto */}
                            <div className="col-span-1 sm:col-span-3 h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse"></div>
                            {/* Input Qtd */}
                            <div className="col-span-1 h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse"></div>
                        </div>

                        {/* Botão Adicionar */}
                        <div className="mt-4 h-10 w-full sm:w-40 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                    </div>

                    {/* Sessão 2: Lista de Itens Adicionados (Simulando 2 itens no carrinho) */}
                    <div className="mb-6">
                        <div className="h-4 w-32 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-3"></div>
                        <ul className="space-y-2">
                            {[1, 2].map((i) => (
                                <li key={`item-${i}`} className="flex justify-between items-center bg-(--bg) p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                                    <div className="h-4 w-1/3 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-4 w-16 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                        <div className="h-4 w-4 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sessão 3: Pagamento e Finalização */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                        {/* Data e Hora */}
                        <div className="h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse"></div>
                        {/* Método de Pagamento */}
                        <div className="h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse"></div>
                        {/* Valor Total */}
                        <div className="col-span-1 sm:col-span-2 h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse mt-2"></div>
                    </div>

                    {/* Botão Registrar Pedido */}
                    <div className="mt-6 h-12 w-full bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                </div>

                {/* === CAIXA DE PEDIDOS REGISTRADOS === */}
                <div className="h-6 w-48 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-6 mt-4"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={`pedido-${i}`} className="relative bg-(--surface) rounded-[20px] p-4 shadow-lg border border-slate-100 dark:border-slate-800">
                            
                            {/* Botão X (Excluir) */}
                            <div className="absolute top-3 right-3 h-4 w-4 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>

                            {/* Detalhes do Pedido Físico */}
                            <div className="pr-7 space-y-2.5">
                                {/* Nome dos Produtos */}
                                <div className="h-5 w-3/4 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse mb-3"></div>
                                
                                {/* Linhas: Hora, Quantidade, Tipo, Método */}
                                <div className="h-3 w-full bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                <div className="h-3 w-2/3 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                <div className="h-3 w-4/5 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                <div className="h-3 w-5/6 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                
                                {/* Valor em Destaque */}
                                <div className="h-5 w-24 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse mt-3"></div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}