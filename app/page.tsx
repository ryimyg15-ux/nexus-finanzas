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
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const datosGuardados = localStorage.getItem('nexus_envios');
        const tasaGuardada = localStorage.getItem('nexus_tasa');
        if (datosGuardados) setEnvios(JSON.parse(datosGuardados));
        if (tasaGuardada) setTasa(parseFloat(tasaGuardada));
        setIsLoaded(true);
    }, []);

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
                year: '2-digit',
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

    // --- NUEVA FUNCIÓN: COMPARTIR POR WHATSAPP ---
    const compartirWhatsApp = (envio: Envio) => {
        const mensaje = `*COMPROBANTE DE ENVÍO - NEXUS*%0A%0A` +
            `👤 *Beneficiario:* ${envio.beneficiario}%0A` +
            `📅 *Fecha:* ${envio.fecha}%0A` +
            `💰 *Monto:* ${envio.reales} BRL%0A` +
            `📈 *Tasa:* 1 BRL = ${envio.tasa} CUP%0A` +
            `🇨🇺 *Recibe:* ${envio.cup} CUP%0A%0A` +
            `_Operación confirmada exitosamente._`;
        window.open(`https://wa.me/?text=${mensaje}`, '_blank');
    };

    // --- NUEVA FUNCIÓN: EXPORTAR A EXCEL (CSV) ---
    const exportarExcel = () => {
        const encabezados = "Fecha,Beneficiario,Reales(BRL),Tasa,CUP\n";
        const filas = envios.map(e => `${e.fecha},${e.beneficiario},${e.reales},${e.tasa},${e.cup}`).join("\n");
        const blob = new Blob([encabezados + filas], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `nexus_reporte_${new Date().toLocaleDateString()}.csv`);
        link.click();
    };

    const eliminarEnvio = (id: number) => {
        if (confirm("¿Eliminar este registro?")) {
            setEnvios(envios.filter(e => e.id !== id));
        }
    };

    if (!isLoaded) return <div className="bg-black min-h-screen"/>;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 font-sans pb-24">
            <header className="max-w-md mx-auto mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-blue-500 italic tracking-tighter">NEXUS | CUBA</h1>
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em]">Remesas Brasil</p>
                </div>
                <button
                    onClick={exportarExcel}
                    className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg border border-zinc-700 transition-all text-zinc-300"
                >
                    EXPORTAR EXCEL
                </button>
            </header>

            <div className="max-w-md mx-auto space-y-6">
                {/* TASA DE CAMBIO */}
                <section className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Tasa del Día</label>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-400 font-mono text-sm">1 BRL =</span>
                        <input
                            type="number"
                            value={tasa}
                            onChange={(e) => setTasa(parseFloat(e.target.value))}
                            className="bg-transparent text-2xl font-mono text-green-400 outline-none w-24 focus:text-white"
                        />
                        <span className="text-zinc-400 font-mono text-sm uppercase">Cup</span>
                    </div>
                </section>

                {/* CALCULADORA */}
                <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl">
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={beneficiario}
                            onChange={(e) => setBeneficiario(e.target.value)}
                            placeholder="NOMBRE DEL BENEFICIARIO"
                            className="w-full bg-zinc-800/40 p-4 rounded-xl outline-none focus:ring-1 ring-blue-500 text-xs font-bold uppercase tracking-wider"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-800/40 p-3 rounded-xl">
                                <label className="text-[9px] text-zinc-500 block font-bold uppercase mb-1">Envías
                                    BRL</label>
                                <input
                                    type="number"
                                    value={reales}
                                    onChange={(e) => setReales(e.target.value)}
                                    placeholder="0.00"
                                    className="bg-transparent w-full text-xl font-mono outline-none"
                                />
                            </div>
                            <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/20">
                                <label className="text-[9px] text-blue-500 block font-bold uppercase mb-1">Reciben
                                    CUP</label>
                                <div className="text-xl font-mono text-blue-400">{resultadoCUP}</div>
                            </div>
                        </div>
                        <button
                            onClick={registrarEnvio}
                            className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/30 transition-all active:scale-95"
                        >
                            Registrar Operación
                        </button>
                    </div>
                </section>

                {/* HISTORIAL */}
                <section className="space-y-3">
                    <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Movimientos
                        Guardados</h2>
                    {envios.map(envio => (
                        <div key={envio.id}
                             className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center group relative">
                            <div className="flex-1" onClick={() => eliminarEnvio(envio.id)}>
                                <p className="font-bold text-sm uppercase tracking-tight">{envio.beneficiario}</p>
                                <p className="text-[10px] text-zinc-600 font-mono">{envio.fecha}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-green-500 font-mono text-xs font-bold">-{envio.reales} BRL</p>
                                    <p className="text-blue-400 font-mono text-xs">+{envio.cup} CUP</p>
                                </div>
                                <button
                                    onClick={() => compartirWhatsApp(envio)}
                                    className="bg-green-600/10 p-2 rounded-lg hover:bg-green-600/20 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M12.031 6.172c-2.277 0-4.125 1.848-4.125 4.125 0 .741.197 1.434.54 2.031l-.573 2.091 2.144-.562c.579.311 1.242.492 1.95.492 2.277 0 4.125-1.848 4.125-4.125s-1.848-4.125-4.125-4.125zM12.031 0C5.385 0 0 5.385 0 12.031c0 2.124.552 4.113 1.518 5.844L0 24l6.291-1.652c1.77.96 3.792 1.512 5.952 1.512 6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}