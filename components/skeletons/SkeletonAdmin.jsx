export default function SkeletonAdmin() {
    return (
        <div className="min-h-screen pb-24 w-full overflow-x-hidden">
            
            {/* === SIMULAÇÃO DO ADMIN HEADER === */}
            <div className="h-20 w-full bg-slate-500 dark:bg-slate-700 animate-pulse"></div>
            <div className="h-32"></div>

            <div className="max-w-3xl mx-auto w-full px-4">

                {/* === SKELETON: STATUS DA LOJA === */}
                <div className="bg-(--surface) p-6 rounded-[20px] shadow-lg mb-6 border border-slate-100 dark:border-slate-800">
                    {/* Título */}
                    <div className="h-8 w-48 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-4"></div>
                    
                    <div className="flex flex-col gap-4">
                        {/* Indicador Aberta/Fechada */}
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-500 dark:bg-slate-700 animate-pulse" />
                            <div className="h-4 w-24 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                        </div>
                        
                        {/* Botões Abrir/Fechar */}
                        <div className="flex items-center">
                            <div className="h-10 w-24 bg-slate-400 dark:bg-slate-700 rounded-l-md animate-pulse"></div>
                            <div className="h-10 w-24 bg-slate-500 dark:bg-slate-600 rounded-r-md animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* === SKELETON: FORMULÁRIO DE CADASTRO === */}
                <div className="bg-(--surface) p-6 rounded-[24px] shadow-xl mb-6 border border-slate-100 dark:border-slate-800">
                    {/* Título centralizado */}
                    <div className="h-6 w-56 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mx-auto mb-6"></div>
                    
                    <div className="flex flex-col gap-5">
                        {/* Input: Nome */}
                        <div className="space-y-2">
                            <div className="h-3 w-32 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                            <div className="h-12 w-full rounded-2xl bg-slate-400 dark:bg-slate-700 opacity-50 animate-pulse"></div>
                        </div>

                        {/* Textarea: Descrição */}
                        <div className="space-y-2">
                            <div className="h-3 w-24 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                            <div className="h-24 w-full rounded-2xl bg-slate-400 dark:bg-slate-700 opacity-50 animate-pulse"></div>
                        </div>

                        {/* Grid: Preço e Estoque */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="h-3 w-20 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                <div className="h-12 w-full rounded-2xl bg-slate-400 dark:bg-slate-700 opacity-50 animate-pulse"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 w-20 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                <div className="h-12 w-full rounded-2xl bg-slate-400 dark:bg-slate-700 opacity-50 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Categorias (Pills) */}
                        <div className="space-y-2">
                            <div className="h-3 w-28 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                            <div className="bg-(--bg) p-3 rounded-2xl shadow-inner flex flex-wrap gap-2 opacity-50">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={`catpill-${i}`} className="h-9 w-24 bg-slate-400 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                                ))}
                            </div>
                        </div>

                        {/* Imagens */}
                        <div className="space-y-2">
                            <div className="h-3 w-32 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mx-auto"></div>
                            <div className="bg-(--bg) p-4 rounded-2xl shadow-inner border-2 border-dashed border-slate-400 dark:border-slate-700">
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={`imgbox-${i}`} className="aspect-square rounded-lg bg-slate-500 dark:bg-slate-700 animate-pulse flex items-center justify-center">
                                            <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                            </svg>
                                        </div>
                                    ))}
                                </div>
                                <div className="h-14 w-full rounded-xl bg-slate-400 dark:bg-slate-700 animate-pulse opacity-50"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Botão Submit */}
                    <div className="mt-8 h-14 w-full bg-slate-500 dark:bg-slate-600 rounded-2xl animate-pulse"></div>
                </div>

                {/* === SKELETON: LISTAGEM DE PRODUTOS === */}
                <div className="h-6 w-32 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-4"></div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={`prodlist-${i}`} className="bg-(--surface) rounded-[20px] p-4 shadow-lg border border-slate-100 dark:border-slate-800">
                            {/* Imagem do Produto Cadastrado */}
                            <div className="h-40 w-full bg-slate-500 dark:bg-slate-700 rounded-2xl mb-3 animate-pulse flex items-center justify-center">
                                <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                </svg>
                            </div>
                            
                            {/* Nome, Preço e Estoque */}
                            <div className="h-5 w-3/4 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-2.5"></div>
                            <div className="h-4 w-1/2 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-2.5"></div>
                            <div className="h-3 w-1/3 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-4"></div>
                            
                            {/* Inputs de Edição Rápida */}
                            <div className="flex flex-col gap-2 mb-3">
                                <div className="h-10 w-full bg-slate-400 dark:bg-slate-700 rounded-full opacity-50 animate-pulse"></div>
                                <div className="h-10 w-full bg-slate-400 dark:bg-slate-700 rounded-full opacity-50 animate-pulse"></div>
                            </div>
                            
                            {/* Botão Remover */}
                            <div className="h-10 w-full bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}