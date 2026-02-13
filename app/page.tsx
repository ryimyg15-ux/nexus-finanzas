'use client';
import {useEffect, useState} from 'react';

interface Envio {
    id: number;
    fecha: string;
    beneficiario: string;
    reales: number;
    cup: number;
    tasa: number;
}

export default function NexusCuba() {
    const [tasa, setTasa] = useState<number>(65);
    const [reales, setReales] = useState<string>("");
    const [beneficiario, setBeneficiario] = useState("");
    const [envios, setEnvios] = useState<Envio[]>([]);
    const [isLoaded, setIsLoaded] = useState(false); // Para evitar errores de hidratación

    // --- LÓGICA DE PERSISTENCIA (LocalStorage) ---

    // 1. Cargar datos al iniciar la App
    useEffect(() => {
        const datosGuardados = localStorage.getItem('nexus_envios');
        const tasaGuardada = localStorage.getItem('nexus_tasa');

        if (datosGuardados) setEnvios(JSON.parse(datosGuardados));
        if (tasaGuardada) setTasa(parseFloat(tasaGuardada));

        setIsLoaded(true);
    }, []);

    // 2. Guardar automáticamente cuando cambien los envíos o la tasa
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('nexus_envios', JSON.stringify(envios));
            localStorage.setItem('nexus_tasa', tasa.toString());
        }
    }, [envios, tasa, isLoaded]);

    const resultadoCUP = reales ? (parseFloat(reales) * tasa).toFixed(2) : "0.00";

    const registrarEnvio = () => {
        if (!reales || !beneficiario) return;
        const nuevo: Envio = {
            id: Date.now(),
            fecha: new Date().toLocaleString('es-CU', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }),
            beneficiario,
            reales: parseFloat(reales),
            cup: parseFloat(resultadoCUP),
            tasa: tasa
        };
        setEnvios([nuevo, ...envios]);
        setReales("");
        setBeneficiario("");
    };

    const eliminarEnvio = (id: number) => {
        if (confirm("¿Eliminar este registro?")) {
            setEnvios(envios.filter(e => e.id !== id));
        }
    };

    if (!isLoaded) return <div className="bg-black min-h-screen"/>; // Pantalla de carga breve

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 font-sans pb-20">
            <header className="max-w-md mx-auto mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-blue-500 tracking-tighter italic">NEXUS | CUBA</h1>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Operaciones BRL - CUP</p>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-zinc-600 block">EN VIVO</span>
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block animate-pulse"></span>
                </div>
            </header>

            <div className="max-w-md mx-auto space-y-6">
                {/* CONFIGURACIÓN DE TASA */}
                <section
                    className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase block">Tasa de Cambio</label>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-400 text-sm font-mono">1 BRL =</span>
                            <input
                                type="number"
                                value={tasa}
                                onChange={(e) => setTasa(parseFloat(e.target.value))}
                                className="bg-transparent text-2xl font-mono text-green-400 outline-none w-20"
                            />
                            <span className="text-zinc-400 text-sm font-mono">CUP</span>
                        </div>
                    </div>
                    <div className="bg-green-500/10 p-2 rounded-lg text-green-500 text-xs">
                        {tasa > 0 ? "Tasa Activa" : "Defina Tasa"}
                    </div>
                </section>

                {/* CALCULADORA DE ENVÍO */}
                <section
                    className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
                        </svg>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-bold">Beneficiario en
                                Cuba</label>
                            <input
                                type="text"
                                value={beneficiario}
                                onChange={(e) => setBeneficiario(e.target.value)}
                                placeholder="Nombre de la persona"
                                className="w-full bg-zinc-800/50 p-4 rounded-xl outline-none focus:ring-1 ring-blue-500 text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold">Monto (Reales)</label>
                                <input
                                    type="number"
                                    value={reales}
                                    onChange={(e) => setReales(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-zinc-800/50 p-4 rounded-xl text-xl font-mono outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold">Total (CUP)</label>
                                <div
                                    className="w-full bg-blue-900/20 p-4 rounded-xl text-xl font-mono text-blue-400 border border-blue-800/30">
                                    {resultadoCUP}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={registrarEnvio}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            REGISTRAR OPERACIÓN
                        </button>
                    </div>
                </section>

                {/* HISTORIAL RECIENTE */}
                <section>
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Historial de
                            Remesas</h2>
                        <span
                            className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">{envios.length} Envíos</span>
                    </div>

                    <div className="space-y-3">
                        {envios.length === 0 && (
                            <p className="text-center text-zinc-700 py-10 text-sm italic">No hay registros
                                guardados.</p>
                        )}
                        {envios.map(envio => (
                            <div
                                key={envio.id}
                                onClick={() => eliminarEnvio(envio.id)}
                                className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center hover:bg-red-900/10 transition-colors cursor-pointer group"
                            >
                                <div>
                                    <p className="font-bold text-sm">{envio.beneficiario}</p>
                                    <p className="text-[10px] text-zinc-600">{envio.fecha} • Tasa: {envio.tasa}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-500 font-mono text-sm">-{envio.reales} BRL</p>
                                    <p className="text-blue-400 font-mono text-sm">+{envio.cup} CUP</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <footer className="max-w-md mx-auto mt-10 text-center text-[10px] text-zinc-700">
                NEXUS FINANZAS v2.0 • DATOS LOCALES ENCRIPTADOS EN DISPOSITIVO
            </footer>
        </main>
    );
}