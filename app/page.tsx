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

export default function NexusPatriotico() {
    const [tasa, setTasa] = useState<number>(90);
    const [reales, setReales] = useState<string>("");
    const [beneficiario, setBeneficiario] = useState("");
    const [metodo, setMetodo] = useState<'Efectivo' | 'Transferencia'>('Transferencia');
    const [tarjeta, setTarjeta] = useState("Tarjeta Principal");
    const [filtroTarjeta, setFiltroTarjeta] = useState("Todas");
    const [envios, setEnvios] = useState<Envio[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const datos = localStorage.getItem('nexus_patria');
        if (datos) setEnvios(JSON.parse(datos));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem('nexus_patria', JSON.stringify(envios));
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

    if (!isLoaded) return <div className="bg-[#0b141a] min-h-screen"/>;

    return (
        <main className="min-h-screen bg-[#0b141a] text-white font-sans p-4 pb-10 border-[6px] border-blue-700">

            {/* HEADER PATRIÓTICO */}
            <header
                className="max-w-2xl mx-auto flex justify-between items-center mb-6 bg-[#121f27] p-6 rounded-3xl border-b-4 border-red-600 shadow-xl">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter">
                        NEXUS<span className="text-red-600">PRO</span>
                    </h1>
                    <div className="flex gap-2 mt-2">
                        <div className="w-6 h-4 bg-blue-700 border border-white flex items-center justify-center"><span
                            className="text-[6px] text-white">★</span></div>
                        <div className="w-6 h-4 bg-green-600 border border-yellow-400"></div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-yellow-400 uppercase">Tasa de Hoy</p>
                    <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg mt-1">
                        <span className="text-black font-bold text-sm underline">R$ 1 =</span>
                        <input
                            type="number"
                            value={tasa}
                            onChange={(e) => setTasa(parseFloat(e.target.value))}
                            className="bg-transparent text-black font-black text-xl outline-none w-12"
                        />
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto space-y-6">

                {/* FORMULARIO DE OPERACIÓN */}
                <section className="bg-[#121f27] p-6 rounded-[2.5rem] border-2 border-zinc-800 shadow-2xl">
                    <h2 className="text-xs font-bold uppercase mb-4 text-zinc-400">Nueva Operación</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold ml-2">BENEFICIARIO</label>
                            <input
                                type="text"
                                value={beneficiario}
                                onChange={(e) => setBeneficiario(e.target.value)}
                                placeholder="NOMBRE COMPLETO"
                                className="w-full bg-[#1c2c35] p-4 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500 font-bold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold ml-2">MONTO EN REALES</label>
                            <input
                                type="number"
                                value={reales}
                                onChange={(e) => setReales(e.target.value)}
                                placeholder="R$ 0.00"
                                className="w-full bg-[#1c2c35] p-4 rounded-2xl outline-none border-2 border-transparent focus:border-green-500 font-mono text-xl text-green-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            onClick={() => setMetodo('Transferencia')}
                            className={`py-3 rounded-2xl font-bold text-[10px] border-2 transition-all ${metodo === 'Transferencia' ? 'bg-blue-700 border-white shadow-lg' : 'bg-[#1c2c35] border-zinc-700 text-zinc-500'}`}
                        >TARJETA PRINCIPAL
                        </button>
                        <button
                            onClick={() => setMetodo('Efectivo')}
                            className={`py-3 rounded-2xl font-bold text-[10px] border-2 transition-all ${metodo === 'Efectivo' ? 'bg-green-700 border-yellow-400 shadow-lg' : 'bg-[#1c2c35] border-zinc-700 text-zinc-500'}`}
                        >EFECTIVO EN MANO
                        </button>
                    </div>

                    {metodo === 'Transferencia' && (
                        <select
                            value={tarjeta}
                            onChange={(e) => setTarjeta(e.target.value)}
                            className="w-full mb-6 bg-[#1c2c35] p-4 rounded-2xl outline-none border-2 border-zinc-700 font-bold text-xs"
                        >
                            <option value="Tarjeta Principal">TARJETA PRINCIPAL (CUBA)</option>
                            <option value="Tarjeta Auxiliar">TARJETA AUXILIAR</option>
                            <option value="Tarjeta Cuba-MN">TARJETA CUBA-MN</option>
                        </select>
                    )}

                    <button
                        onClick={registrar}
                        className="w-full bg-white text-black py-5 rounded-full font-black uppercase tracking-widest hover:bg-zinc-200 shadow-xl active:scale-95 transition-all"
                    >
                        REGISTRAR OPERACIÓN
                    </button>
                </section>

                {/* TABLA CONTABLE */}
                <section className="bg-[#121f27] rounded-3xl border-2 border-zinc-800 overflow-hidden shadow-2xl">
                    <div className="p-4 bg-zinc-900/50 flex justify-between items-center border-b border-zinc-800">
                        <h3 className="text-[10px] font-black uppercase">Totales Filtrados</h3>
                        <select
                            value={filtroTarjeta}
                            onChange={(e) => setFiltroTarjeta(e.target.value)}
                            className="bg-transparent text-[10px] font-black text-blue-400 outline-none"
                        >
                            <option value="Todas">TODAS</option>
                            <option value="Tarjeta Principal">TARJETA PRINCIPAL</option>
                            <option value="Tarjeta Auxiliar">TARJETA AUXILIAR</option>
                            <option value="Efectivo">EFECTIVO</option>
                        </select>
                    </div>

                    <table className="w-full text-left">
                        <thead className="bg-[#1c2c35] text-[9px] font-black text-zinc-500 uppercase">
                        <tr>
                            <th className="p-4">Día</th>
                            <th className="p-4">Beneficiario</th>
                            <th className="p-4">Reales</th>
                            <th className="p-4 text-right">Saldo MN</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                        {enviosFiltrados.map((e) => (
                            <tr key={e.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-xs font-mono text-zinc-500">{e.dia}</td>
                                <td className="p-4 text-[10px] font-bold">
                                    {e.beneficiario}
                                    <br/>
                                    <span className="text-[8px] text-blue-500 font-black">
                      {e.metodo === 'Efectivo' ? '💵 EFEC' : `💳 ${e.tarjetaOrigen?.split(' ')[1]}`}
                    </span>
                                </td>
                                <td className="p-4 text-xs font-mono text-green-500 font-bold">R${e.reales.toFixed(2)}</td>
                                <td className="p-4 text-right text-xs font-mono text-blue-400 font-black">${e.saldoMN.toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                {/* TOTALES EN GRANDE */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-900/20 border-2 border-green-600 p-6 rounded-[2rem]">
                        <p className="text-[9px] font-black text-green-500 uppercase mb-1">Total Reales</p>
                        <p className="text-2xl font-black text-white">R$ {enviosFiltrados.reduce((acc, curr) => acc + curr.reales, 0).toFixed(2)}</p>
                    </div>
                    <div className="bg-blue-900/20 border-2 border-blue-600 p-6 rounded-[2rem]">
                        <p className="text-[9px] font-black text-blue-500 uppercase mb-1">Total CUP</p>
                        <p className="text-2xl font-black text-white">$ {enviosFiltrados.reduce((acc, curr) => acc + curr.saldoMN, 0).toLocaleString()}</p>
                    </div>
                </div>

            </div>
            <p className="text-center mt-8 text-[9px] font-black text-zinc-700 tracking-[0.4em] uppercase">
                Nexus Pro • Patria o Muerte
            </p>
        </main>
    );
}