import { Loader2 } from "lucide-react";

export default function SkeletonHome() {
    return (
        <div className="min-h-screen w-full overflow-x-hidden p-4 md:p-8">

            <div className="h-6 w-32 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mb-3"></div>

            <div className="flex gap-4 overflow-hidden pb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={`cat-${i}`}
                        className="card card-compact bg-base-100 shadow-xl shrink-0 w-35 md:w-40 overflow-hidden border border-slate-100 dark:border-slate-800"
                    >

                        <div className="h-32 md:h-40 w-full bg-slate-500 dark:bg-slate-700 animate-pulse flex items-center justify-center">
                            <Loader2 className="animate-spin text-neutral-quaternary" size={32} />
                        </div>

                        <div className="p-3 bg-(--surface) flex justify-center items-center">
                            <div className="h-2.5 w-20 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="h-6 w-40 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mt-8 mb-3"></div>

            <div className="flex flex-col gap-6 md:flex-row md:gap-4 md:overflow-hidden">
                {[1, 2, 3].map((i) => (
                    <div
                        key={`turma-${i}`}
                        className="w-full md:w-80 shrink-0 card card-compact bg-base-100 shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800"
                    >
                        <div className="h-48 w-full bg-slate-500 dark:bg-slate-700 animate-pulse flex items-center justify-center">
                            <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/4000/svg" fill="currentColor" viewBox="0 0 20 18">
                                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                            </svg>
                        </div>

                        <div className="p-4 flex flex-col gap-3">

                            <div className="h-4 w-3/4 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>

                            <div className="flex flex-col gap-2 mt-1">
                                <div className="h-2.5 w-full bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                <div className="h-2.5 w-5/6 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                            </div>

                            <div className="h-3 w-1/4 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse mt-2"></div>

                            <div className="flex flex-col gap-2.5 mt-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-500 animate-pulse"></div>
                                    <div className="h-2 w-2/3 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-500 animate-pulse"></div>
                                    <div className="h-2 w-1/2 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-500 dark:bg-slate-500 animate-pulse"></div>
                                    <div className="h-2 w-3/4 bg-slate-400 dark:bg-slate-700 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}