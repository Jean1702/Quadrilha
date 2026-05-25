export default function SkeletonPerfil() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 w-full overflow-x-hidden">

            {/* === CARD PRINCIPAL DO PERFIL === */}
            <div className="w-full max-w-sm bg-(--surface) rounded-[12px] p-6 shadow-lg border border-slate-100 dark:border-slate-800">

                {/* TÍTULO "Meu Perfil" */}
                <div className="h-8 w-32 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mx-auto mb-6"></div>

                {/* TABELA PRINCIPAL (Foto + Info) */}
                <div className="flex w-full mb-6">

                    {/* Lado Esquerdo: Foto de Perfil */}
                    <div className="w-24 pr-4 flex flex-col items-center justify-center gap-2">
                        {/* Círculo da Foto */}
                        <div className="w-20 h-20 md:w-21 md:h-21 rounded-full bg-slate-500 dark:bg-slate-700 animate-pulse border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                            {/* Ícone sutil para indicar imagem */}
                            <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                            </svg>
                        </div>
                        {/* Botão Alterar Foto */}
                        <div className="h-5 w-16 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mt-1"></div>
                    </div>

                    {/* Lado Direito: Informações (Inputs) */}
                    <div className="flex-1 flex flex-col gap-3 justify-center">
                        {/* Input Nome */}
                        <div className="flex flex-col gap-1">
                            <div className="h-3 w-10 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse ml-1"></div>
                            <div className="h-10 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse"></div>
                        </div>

                        {/* Input Telefone */}
                        <div className="flex flex-col gap-1">
                            <div className="h-3 w-14 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse ml-1"></div>
                            <div className="h-10 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* BOTÃO ABRIR/FECHAR STATUS DO PEDIDO */}
                <div className="w-full mt-6 h-12 bg-slate-500 dark:bg-slate-600 rounded-md animate-pulse"></div>

                {/* CAIXA DE PEDIDO ATIVO (Simulação de aberto) */}
                <div className="mt-2 bg-(--bg) rounded-md p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                    {/* Título Pedido Ativo */}
                    <div className="h-5 w-28 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-3"></div>

                    {/* Detalhes (Curso, Item, Qtd) */}
                    <div className="space-y-2 mb-3">
                        <div className="h-3 w-3/4 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                        <div className="h-3 w-5/6 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                        <div className="h-3 w-1/2 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                    </div>

                    {/* Status Piscando */}
                    <div className="flex items-center gap-2 mt-3 w-fit px-2 py-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-700 animate-pulse"></div>
                        <div className="h-3 w-24 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                    </div>

                    {/* Pagamento e Total */}
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="h-3 w-1/3 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                        <div className="h-5 w-1/2 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* BOTÃO EXCLUIR PERFIL (Lixeira) */}
                <div className="flex justify-center mt-8">
                    <div className="h-4 w-32 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-70"></div>
                </div>

            </div>
        </div>
    );
}