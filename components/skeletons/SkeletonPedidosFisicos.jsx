export default function SkeletonPedidosFisicos() {
    return (
        <div className="min-h-screen pb-24 w-full overflow-x-hidden">

            <div className="h-20 w-full bg-slate-500 dark:bg-slate-700 animate-pulse"></div>
            <div className="h-32"></div>

            <div className="max-w-3xl mx-auto w-full px-4">

                <div className="bg-(--surface) p-6 rounded-[20px] shadow-lg mb-6 border border-slate-100 dark:border-slate-800">
                    <div className="h-6 w-56 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-6"></div>

                    <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-black/5 dark:bg-white/5">
                        <div className="h-4 w-40 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-4"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <div className="col-span-1 sm:col-span-3 h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse"></div>
                            <div className="col-span-1 h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse"></div>
                        </div>
                        <div className="mt-4 h-10 w-full sm:w-40 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                    </div>

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <div className="h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse"></div>
                        <div className="h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse"></div>
                        <div className="col-span-1 sm:col-span-2 h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-full animate-pulse mt-2"></div>
                    </div>

                    <div className="mt-6 h-12 w-full bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                </div>

                <div className="bg-(--surface) p-6 rounded-[20px] shadow-lg mb-6 border border-slate-100 dark:border-slate-800">
                    <div className="h-6 w-48 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-4"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 bg-(--bg) p-4 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-700">
                        <div className="h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-xl animate-pulse"></div>
                        <div className="h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-xl animate-pulse"></div>
                        <div className="h-12 w-full bg-slate-400 dark:bg-slate-700 opacity-50 rounded-xl animate-pulse"></div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {[1, 2, 3].map((i) => (
                            <div key={`pedido-skeleton-${i}`} className="flex flex-col md:flex-row justify-between md:items-center p-4 bg-(--bg) border border-slate-200 dark:border-slate-700 rounded-2xl">

                                <div className="flex-1 pr-8 mb-3 md:mb-0 space-y-2.5">
                                    <div className="h-3 w-20 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-60"></div>
                                    <div className="h-4 w-3/4 md:w-1/2 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                                    <div className="h-3 w-32 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-50"></div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <div className="space-y-1.5">
                                        <div className="h-2 w-16 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-50"></div>
                                        <div className="h-4 w-20 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                    </div>
                                    <div className="space-y-1.5 text-right">
                                        <div className="h-2 w-10 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse opacity-50 ml-auto"></div>
                                        <div className="h-5 w-20 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex gap-2">
                            <div className="h-8 w-8 bg-slate-400 dark:bg-slate-700 opacity-30 rounded-full animate-pulse"></div>
                            <div className="h-8 w-8 bg-slate-500 dark:bg-slate-600 rounded-full animate-pulse"></div>
                            <div className="h-8 w-8 bg-slate-400 dark:bg-slate-700 opacity-30 rounded-full animate-pulse"></div>
                            <div className="h-8 w-8 bg-slate-400 dark:bg-slate-700 opacity-30 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}