import { AlertTriangle } from "lucide-react";

export default function MaintenancePage() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center bg-(--bg) text-(--text)">
            <div className="bg-slate-800 p-6 rounded-full mb-6">
                <AlertTriangle className="text-[#D95032]" size={64} />
            </div>
            <h1 className="text-3xl font-black mb-4">Estamos em Manutenção</h1>
            <p className="text-gray-400 max-w-md text-lg leading-relaxed mb-8">
                Nosso sistema está passando por uma atualização de emergência. Voltaremos em breve!
            </p>
        </div>
    );
}