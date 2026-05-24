import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
    return (
        // O min-h-screen garante que a tela inteira seja coberta
        // flex, items-center e justify-center garantem que tudo fique no exato centro
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">

            {/* O ícone do spinner girando. 
                Usei a cor #D95032 (que vi no seu código anterior) para dar o tom da sua marca, 
                mas você pode trocar por text-neutral-quaternary se preferir mais neutro */}
            <Loader2 className="animate-spin text-[#D95032]" size={48} />

            {/* Um texto de apoio piscando suavemente */}
            <p className="mt-4 text-fg-disabled font-medium animate-pulse">
                Carregando...
            </p>

        </div>
    );
}