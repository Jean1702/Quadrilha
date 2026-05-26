export default function SkeletonNotificacoes() {
    return (
        <main className="min-h-screen px-4 py-6 pb-24 w-full overflow-x-hidden">
            <div className="max-w-3xl mx-auto space-y-4">

                {/* === CABEÇALHO (Resumo das Notificações) === */}
                <section className="bg-(--surface) rounded-[24px] p-5 shadow-lg border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        {/* Simulação da caixa do ícone de Sino */}
                        <div className="w-11 h-11 rounded-2xl bg-slate-500 dark:bg-slate-700 animate-pulse shrink-0"></div>

                        {/* Textos do título */}
                        <div className="flex flex-col gap-2 w-full">
                            <div className="h-6 w-48 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                            <div className="h-3 w-64 md:w-3/4 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-70"></div>
                        </div>
                    </div>

                    {/* Grid de Resumo (Em andamento / Prontos) */}
                    <div className="grid grid-cols-2 gap-3 mt-5">
                        <div className="rounded-2xl bg-(--bg) p-4 border border-slate-100 dark:border-slate-800">
                            <div className="h-2.5 w-24 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-60 mb-3"></div>
                            <div className="h-6 w-10 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                        </div>
                        <div className="rounded-2xl bg-(--bg) p-4 border border-slate-100 dark:border-slate-800">
                            <div className="h-2.5 w-16 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-60 mb-3"></div>
                            <div className="h-6 w-10 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </section>

                {/* === LISTA DE PEDIDOS (Simulando 2 notificações) === */}
                <section className="space-y-3">
                    {[1, 2].map((i) => (
                        <article key={`skeleton-notif-${i}`} className="bg-(--surface) rounded-[24px] p-5 shadow-lg border border-slate-100 dark:border-slate-800">

                            {/* Topo do Card (Pedido #ID e Status) */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex flex-col gap-2">
                                    <div className="h-2 w-14 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-50"></div>
                                    <div className="h-5 w-20 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                                </div>

                                {/* Badge de Status */}
                                <div className="h-8 w-24 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-50"></div>
                            </div>

                            {/* Descrição do status */}
                            <div className="h-3 w-4/5 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-80"></div>

                            {/* Detalhes Internos (Itens, Pagamento, Total) */}
                            <div className="mt-4 grid gap-3 text-sm">

                                {/* Caixa de Itens */}
                                <div className="rounded-2xl bg-(--bg) p-4 border border-slate-100 dark:border-slate-800">
                                    <div className="h-2 w-10 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-60 mb-3"></div>

                                    {/* Lista de Itens (Simulando 2 linhas) */}
                                    <ul className="space-y-2">
                                        <li className="flex items-center justify-between gap-3">
                                            <div className="h-3 w-1/2 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                            <div className="h-3 w-6 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-70"></div>
                                        </li>
                                        <li className="flex items-center justify-between gap-3">
                                            <div className="h-3 w-2/3 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                            <div className="h-3 w-6 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-70"></div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Caixa de Pagamento e Total */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl bg-(--bg) p-4 border border-slate-100 dark:border-slate-800">
                                        <div className="h-2 w-20 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-60 mb-3"></div>
                                        <div className="h-4 w-24 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                    </div>
                                    <div className="rounded-2xl bg-(--bg) p-4 border border-slate-100 dark:border-slate-800">
                                        <div className="h-2 w-10 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-60 mb-3"></div>
                                        <div className="h-4 w-16 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                                    </div>
                                </div>

                            </div>
                        </article>
                    ))}
                </section>

            </div>
        </main>
    );
}