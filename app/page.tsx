'use client';
import {useEffect, useState} from 'react';

interface Envio {
    id: number;
    dia: string;
    reales: number;
    precio: number;
    saldoMN: number;
    beneficiario: string;
    metodo: 'Efectivo' | 'Transferencia';
    tarjetaOrigen?: string;
}

export default function NexusContable() {
    const [tasa, setTasa] = useState<number>(90);
    const [reales, setReales] = useState<string>("");
    const [beneficiario, setBeneficiario] = useState("");
    const [metodo, setMetodo] = useState<'Efectivo' | 'Transferencia'>('Transferencia');
    const [tarjeta, setTarjeta] = useState("Tarjeta 01");
    const [envios, setEnvios] = useState<Envio[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const datos = localStorage.getItem('nexus_v3');
        if (datos) setEnvios(JSON.parse(datos));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem('nexus_v3', JSON.stringify(envios));
    }, [envios, isLoaded]);

    const registrar = () => {
        if (!reales || !beneficiario) return;
        const r = parseFloat(reales);
        const nuevo: Envio = {
            id: Date.now(),
            dia: new Date().getDate().toString(),
            reales: r,
            precio: tasa,
            saldoMN: r * tasa,
            beneficiario: beneficiario,
            metodo: metodo,
            tarjetaOrigen: metodo === 'Transferencia' ? tarjeta : undefined
        };
        setEnvios([nuevo, ...envios]);
        setReales("");
    };

    if (!isLoaded) return <div className="bg-[#0a0a0a] min-h-screen"/>;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white p-4 font-sans pb-10">
            {/* HEADER */}
            <div className="max-w-2xl mx-auto mb-6 flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                    <h1 className="text-xl font-black tracking-tighter text-blue-500 italic">NEXUS S.A.</h1>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Control de Remesas Cuba</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase">Tasa de Venta</p>
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-zinc-600">1 R$ =</span>
                        <input
                            type="number"
                            value={tasa}
                            onChange={(e) => setTasa(parseFloat(e.target.value))}
                            className="bg-transparent text-xl font-mono text-green-400 text-right outline-none w-16"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
                {/* PANEL DE ENTRADA */}
                <section className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800 shadow-2xl space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="text"
                            placeholder="Nombre del Cliente"
                            value={beneficiario}
                            onChange={(e) => setBeneficiario(e.target.value)}
                            className="bg-zinc-800/50 p-3 rounded-xl text-sm outline-none border border-zinc-700 focus:border-blue-500"
                        />
                        <input
                            type="number"
                            placeholder="Monto Reales (R$)"
                            value={reales}
                            onChange={(e) => setReales(e.target.value)}
                            className="bg-zinc-800/50 p-3 rounded-xl text-sm font-mono outline-none border border-zinc-700 focus:border-green-500"
                        />
                    </div>

                    <div className="flex gap-3 items-center">
                        <select
                            value={metodo}
                            onChange={(e) => setMetodo(e.target.value as any)}
                            className="bg-zinc-800 p-3 rounded-xl text-xs font-bold outline-none flex-1 border border-zinc-700"
                        >
                            <option value="Transferencia">💳 TRANSFERENCIA</option>
                            <option value="Efectivo">💵 EFECTIVO</option>
                        </select>

                        {metodo === 'Transferencia' && (
                            <select
                                value={tarjeta}
                                onChange={(e) => setTarjeta(e.target.value)}
                                className="bg-blue-900/30 text-blue-400 p-3 rounded-xl text-xs font-bold outline-none flex-1 border border-blue-800/50"
                            >
                                <option value="Tarjeta 01">Tarjeta Principal</option>
                                <option value="Tarjeta 02">Tarjeta Auxiliar</option>
                                <option value="Tarjeta 03">Tarjeta Cuba-MN</option>
                            </select>
                        )}
                    </div>

                    <button
                        onClick={registrar}
                        className="w-full bg-blue-600 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                    >
                        Registrar Pago
                    </button>
                </section>

                {/* TABLA CONTABLE */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/20">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                        <tr className="bg-zinc-900 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
                            <th className="p-3">Día</th>
                            <th className="p-3">Beneficiario</th>
                            <th className="p-3">R$</th>
                            <th className="p-3">Tasa</th>
                            <th className="p-3">Total MN</th>
                            <th className="p-3">Origen</th>
                        </tr>
                        </thead>
                        <tbody className="text-[12px] font-mono italic">
                        {envios.map((e) => (
                            <tr key={e.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                                <td className="p-3 text-zinc-500">{e.dia}</td>
                                <td className="p-3 font-bold text-zinc-200 uppercase">{e.beneficiario}</td>
                                <td className="p-3 text-green-500 font-bold">{e.reales.toFixed(2)}</td>
                                <td className="p-3 text-zinc-400">{e.precio}</td>
                                <td className="p-3 text-blue-400 font-bold">${e.saldoMN.toLocaleString()}</td>
                                <td className="p-3 text-[10px]">
                                    {e.metodo === 'Efectivo' ? (
                                        <span className="text-yellow-600 font-bold uppercase">💵 Efec.</span>
                                    ) : (
                                        <span className="text-blue-600 font-bold uppercase">💳 {e.tarjetaOrigen}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* TOTALES */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-right">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Volumen Reales</p>
                        <p className="text-xl font-mono text-green-500">R${envios.reduce((acc, curr) => acc + curr.reales, 0).toFixed(2)}</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-right">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Deuda MN Total</p>
                        <p className="text-xl font-mono text-blue-500">${envios.reduce((acc, curr) => acc + curr.saldoMN, 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </main>
    );
}