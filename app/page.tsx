'use client';
import {useEffect, useState} from 'react';

interface Envio {
    id: number;
    dia: string;
    reales: number;
    precio: number;
    saldoMN: number;
    beneficiario: string;
}

export default function NexusContable() {
    const [tasa, setTasa] = useState<number>(90);
    const [reales, setReales] = useState<string>("");
    const [beneficiario, setBeneficiario] = useState("");
    const [envios, setEnvios] = useState<Envio[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const datos = localStorage.getItem('nexus_contable');
        if (datos) setEnvios(JSON.parse(datos));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem('nexus_contable', JSON.stringify(envios));
    }, [envios, isLoaded]);

    const registrar = () => {
        if (!reales || !beneficiario) return;
        const r = parseFloat(reales);
        const nuevo: Envio = {
            id: Date.now(),
            dia: new Date().getDate().toString(), // Solo el número del día como en tu imagen
            reales: r,
            precio: tasa,
            saldoMN: r * tasa,
            beneficiario: beneficiario
        };
        setEnvios([nuevo, ...envios]);
        setReales("");
    };

    if (!isLoaded) return <div className="bg-[#0a0a0a] min-h-screen"/>;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-4 font-sans">
            {/* HEADER TIPO DASHBOARD */}
            <div className="max-w-xl mx-auto mb-6 flex justify-between items-center border-b border-zinc-800 pb-4">
                <h1 className="text-xl font-black tracking-tighter text-blue-500">NEXUS S.A.</h1>
                <div className="text-right">
                    <p className="text-[10px] text-zinc-500">PRECIO RE ACTUAL</p>
                    <input
                        type="number"
                        value={tasa}
                        onChange={(e) => setTasa(parseFloat(e.target.value))}
                        className="bg-transparent text-xl font-mono text-green-400 text-right outline-none w-20"
                    />
                </div>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
                {/* ENTRADA DE DATOS RÁPIDA */}
                <div className="grid grid-cols-3 gap-2 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
                    <input
                        type="text"
                        placeholder="Beneficiario"
                        value={beneficiario}
                        onChange={(e) => setBeneficiario(e.target.value)}
                        className="bg-zinc-800 p-2 rounded text-sm outline-none focus:ring-1 ring-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Reales (R$)"
                        value={reales}
                        onChange={(e) => setReales(e.target.value)}
                        className="bg-zinc-800 p-2 rounded text-sm outline-none font-mono"
                    />
                    <button
                        onClick={registrar}
                        className="bg-blue-600 rounded text-xs font-bold uppercase hover:bg-blue-500 transition-colors"
                    >
                        Añadir
                    </button>
                </div>

                {/* TABLA CONTABLE (IGUAL A TU IMAGEN) */}
                <div className="overflow-hidden rounded-lg border border-zinc-800">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-blue-900/20 text-[11px] uppercase tracking-wider text-blue-300">
                            <th className="p-3 border-r border-zinc-800">Fecha (Día)</th>
                            <th className="p-3 border-r border-zinc-800">Reales</th>
                            <th className="p-3 border-r border-zinc-800">Precio_Re</th>
                            <th className="p-3">Saldo_MN</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm font-mono">
                        {envios.map((e) => (
                            <tr key={e.id} className="border-t border-zinc-800 hover:bg-zinc-900/50 transition-colors">
                                <td className="p-3 border-r border-zinc-800 text-center text-zinc-400">{e.dia}</td>
                                <td className="p-3 border-r border-zinc-800 text-green-500">R${e.reales.toFixed(2)}</td>
                                <td className="p-3 border-r border-zinc-800 text-zinc-300">${e.precio.toFixed(2)}</td>
                                <td className="p-3 text-blue-400 font-bold">${e.saldoMN.toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {envios.length === 0 && (
                        <div className="p-10 text-center text-zinc-600 text-xs italic">No hay registros en el
                            libro.</div>
                    )}
                </div>

                {/* RESUMEN TOTAL */}
                <div className="flex justify-end gap-4 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800">
                    <div className="text-right">
                        <p className="text-[9px] text-zinc-500 uppercase">Total Reales</p>
                        <p className="text-lg font-mono text-green-500">R${envios.reduce((acc, curr) => acc + curr.reales, 0).toFixed(2)}</p>
                    </div>
                    <div className="text-right border-l border-zinc-800 pl-4">
                        <p className="text-[9px] text-zinc-500 uppercase">Total CUP (MN)</p>
                        <p className="text-lg font-mono text-blue-500">${envios.reduce((acc, curr) => acc + curr.saldoMN, 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}