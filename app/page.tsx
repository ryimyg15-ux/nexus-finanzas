'use client';
import {useState} from 'react';

interface Envio {
    id: number;
    fecha: string;
    beneficiario: string;
    reales: number;
    cup: number;
}

export default function NexusCuba() {
    const [tasa, setTasa] = useState<number>(65); // Ejemplo: 1 BRL = 65 CUP
    const [reales, setReales] = useState<string>("");
    const [beneficiario, setBeneficiario] = useState("");
    const [envios, setEnvios] = useState<Envio[]>([]);

    // Cálculo automático
    const resultadoCUP = reales ? (parseFloat(reales) * tasa).toFixed(2) : "0.00";

    const registrarEnvio = () => {
        if (!reales || !beneficiario) return;
        const nuevo: Envio = {
            id: Date.now(),
            fecha: new Date().toLocaleDateString(),
            beneficiario,
            reales: parseFloat(reales),
            cup: parseFloat(resultadoCUP)
        };
        setEnvios([nuevo, ...envios]);
        setReales("");
        setBeneficiario("");
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 font-sans">
            <header className="max-w-md mx-auto mb-8 text-center">
                <h1 className="text-2xl font-bold text-blue-500 tracking-tighter">NEXUS | CUBA-BRA</h1>
                <p className="text-zinc-500 text-sm">Control de Operaciones Cambiarias</p>
            </header>

            <div className="max-w-md mx-auto space-y-6">
                {/* CONFIGURACIÓN DE TASA */}
                <section className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Tasa del Día (1 BRL a CUP)</label>
                    <input
                        type="number"
                        value={tasa}
                        onChange={(e) => setTasa(parseFloat(e.target.value))}
                        className="w-full bg-transparent text-3xl font-mono text-green-400 outline-none"
                    />
                </section>

                {/* CALCULADORA DE ENVÍO */}
                <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-zinc-500">Nombre del Beneficiario</label>
                            <input
                                type="text"
                                value={beneficiario}
                                onChange={(e) => setBeneficiario(e.target.value)}
                                placeholder="Ej: Mamá Cuba"
                                className="w-full bg-zinc-800/50 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-zinc-500">Envías (BRL)</label>
                                <input
                                    type="number"
                                    value={reales}
                                    onChange={(e) => setReales(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-zinc-800/50 p-3 rounded-xl text-xl font-bold outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500">Reciben (CUP)</label>
                                <div
                                    className="w-full bg-blue-900/20 p-3 rounded-xl text-xl font-bold text-blue-400 border border-blue-800/30">
                                    {resultadoCUP}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={registrarEnvio}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-all active:scale-95"
                        >
                            REGISTRAR ENVÍO
                        </button>
                    </div>
                </section>

                {/* HISTORIAL RECIENTE */}
                <section>
                    <h2 className="text-sm font-bold text-zinc-500 mb-3 px-2 uppercase">Últimos Movimientos</h2>
                    <div className="space-y-2">
                        {envios.map(envio => (
                            <div key={envio.id}
                                 className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{envio.beneficiario}</p>
                                    <p className="text-xs text-zinc-500">{envio.fecha}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-400 font-mono">-{envio.reales} BRL</p>
                                    <p className="text-blue-400 font-mono">+{envio.cup} CUP</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}