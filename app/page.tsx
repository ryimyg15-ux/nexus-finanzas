'use client';
import {useEffect, useState} from 'react';

interface Envio {
    id: number;
    fechaCompleta: string;
    dia: string;
    reales: number;
    precio: number;
    saldoMN: number;
    beneficiario: string;
    metodo: 'Efectivo' | 'Transferencia';
    tarjetaOrigen?: string;
}

export default function NexusPremium() {
    const [tasa, setTasa] = useState<number>(90);
    const [reales, setReales] = useState<string>("");
    const [beneficiario, setBeneficiario] = useState("");
    const [metodo, setMetodo] = useState<'Efectivo' | 'Transferencia'>('Transferencia');
    const [tarjeta, setTarjeta] = useState("Tarjeta Principal");
    const [filtroTarjeta, setFiltroTarjeta] = useState("Todas");
    const [envios, setEnvios] = useState<Envio[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const datos = localStorage.getItem('nexus_v4');
        if (datos) setEnvios(JSON.parse(datos));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem('nexus_v4', JSON.stringify(envios));
    }, [envios, isLoaded]);

    const registrar = () => {
        if (!reales || !beneficiario) return;
        const r = parseFloat(reales);
        const nuevo: Envio = {
            id: Date.now(),
            fechaCompleta: new Date().toLocaleDateString(),
            dia: new Date().getDate().toString(),
            reales: r,
            precio: tasa,
            saldoMN: r * tasa,
            beneficiario: beneficiario.toUpperCase(),
            metodo,
            tarjetaOrigen: metodo === 'Transferencia' ? tarjeta : undefined
        };
        setEnvios([nuevo, ...envios]);
        setReales("");
        setBeneficiario("");
    };

    const enviosFiltrados = filtroTarjeta === "Todas"
        ? envios
        : envios.filter(e => e.tarjetaOrigen === filtroTarjeta || (filtroTarjeta === "Efectivo" && e.metodo === "Efectivo"));

    const totalReales = enviosFiltrados.reduce((acc, curr) => acc + curr.reales, 0);
    const totalMN = enviosFiltrados.reduce((acc, curr) => acc + curr.saldoMN, 0);

    if (!isLoaded) return <div className="bg-black min-h-screen"/>;

    return (
        <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
            {/* BARRA SUPERIOR DE ESTADO */}
            <div className="bg-black/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-light tracking-[0.3em] text-white">NEXUS<span
                            className="font-bold text-blue-500">PRO</span></h1>
                        <p className="text-[9px] text-zinc-500 tracking-widest uppercase mt-1">Sistemas de Gestión
                            Cambiaria</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[9px] text-zinc-500 uppercase">Tasa de Venta</p>
                            <div className="flex items-center gap-1 font-mono text-green-400">
                                <span className="text-xs">R$ 1 =</span>
                                <input
                                    type="number"
                                    value={tasa}
                                    onChange={(e) => setTasa(parseFloat(e.target.value))}
                                    className="bg-transparent w-12 outline-none font-bold text-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">

                {/* SECCIÓN DE REGISTRO ELEGANTE */}
                <section className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[2rem] shadow-2xl">
                    <h2 className="text-[10px] text-zinc-500 uppercase tracking-widest mb-6">Nueva Operación</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[9px] text-zinc-500 ml-2 uppercase">Beneficiario</label>
                            <input
                                type="text"
                                value={beneficiario}
                                onChange={(e) => setBeneficiario(e.target.value)}
                                placeholder="EJ. CARLOS RODRÍGUEZ"
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[9px] text-zinc-500 ml-2 uppercase">Monto en Reales</label>
                            <input
                                type="number"
                                value={reales}
                                onChange={(e) => setReales(e.target.value)}
                                placeholder="R$ 0.00"
                                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-green-500/50 transition-all font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
                            <button
                                onClick={() => setMetodo('Transferencia')}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${metodo === 'Transferencia' ? 'bg-blue-600 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                            >TRANSFERENCIA
                            </button>
                            <button
                                onClick={() => setMetodo('Efectivo')}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${metodo === 'Efectivo' ? 'bg-blue-600 shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                            >EFECTIVO
                            </button>
                        </div>
                        {metodo === 'Transferencia' && (
                            <select
                                value={tarjeta}
                                onChange={(e) => setTarjeta(e.target.value)}
                                className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-xs font-bold"
                            >
                                <option value="Tarjeta Principal">TARJETA PRINCIPAL</option>
                                <option value="Tarjeta Auxiliar">TARJETA AUXILIAR</option>
                                <option value="Tarjeta Cuba-MN">TARJETA CUBA-MN</option>
                            </select>
                        )}
                    </div>

                    <button
                        onClick={registrar}
                        className="w-full mt-8 bg-white text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-200 transition-all active:scale-[0.98]"
                    >
                        Confirmar Registro
                    </button>
                </section>

                {/* FILTRO Y TABLA */}
                <section className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 px-2">
                        <h2 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Libro de
                            Contabilidad</h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] text-zinc-600 uppercase">Filtrar por Origen:</span>
                            <select
                                value={filtroTarjeta}
                                onChange={(e) => setFiltroTarjeta(e.target.value)}
                                className="bg-transparent border-b border-zinc-800 text-[10px] font-bold py-1 outline-none text-blue-400"
                            >
                                <option value="Todas">TODAS LAS CUENTAS</option>
                                <option value="Tarjeta Principal">TARJETA PRINCIPAL</option>
                                <option value="Tarjeta Auxiliar">TARJETA AUXILIAR</option>
                                <option value="Tarjeta Cuba-MN">TARJETA CUBA-MN</option>
                                <option value="Efectivo">SOLO EFECTIVO</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-[#0f0f0f] rounded-[2rem] border border-white/5 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="p-5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Día</th>
                                <th className="p-5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Beneficiario</th>
                                <th className="p-5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Reales</th>
                                <th className="p-5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Total
                                    MN
                                </th>
                                <th className="p-5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest text-right">Origen</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                            {enviosFiltrados.map((e) => (
                                <tr key={e.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-5 text-zinc-600 font-mono text-xs">{e.dia}</td>
                                    <td className="p-5 font-bold text-[11px] tracking-tight">{e.beneficiario}</td>
                                    <td className="p-5 text-green-400 font-mono text-xs">R$ {e.reales.toFixed(2)}</td>
                                    <td className="p-5 text-blue-400 font-mono text-xs font-bold">${e.saldoMN.toLocaleString()}</td>
                                    <td className="p-5 text-right">
                      <span
                          className={`text-[8px] font-black px-2 py-1 rounded-md border ${e.metodo === 'Efectivo' ? 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5' : 'border-blue-500/20 text-blue-400 bg-blue-500/5'}`}>
                        {e.metodo === 'Efectivo' ? 'CASH' : e.tarjetaOrigen?.split(' ')[1]}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* DASHBOARD DE TOTALES */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[#0f0f0f] to-black border border-white/5 p-6 rounded-[2rem]">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Volumen Filtrado
                            (BRL)</p>
                        <p className="text-3xl font-light text-green-400">R$ <span
                            className="font-bold">{totalReales.toLocaleString()}</span></p>
                    </div>
                    <div className="bg-gradient-to-br from-[#0f0f0f] to-black border border-white/5 p-6 rounded-[2rem]">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Total Entregado (MN)</p>
                        <p className="text-3xl font-light text-blue-500">$ <span
                            className="font-bold">{totalMN.toLocaleString()}</span></p>
                    </div>
                </section>

            </div>
            <footer className="text-center pb-10 text-[9px] text-zinc-800 tracking-[0.5em] uppercase">
                Nexus System • Secured Infrastructure
            </footer>
        </main>
    );
}