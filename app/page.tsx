'use client';
import {useEffect, useState} from 'react';

interface Operacion {
    id: number;
    dia: string;
    montoEntrada: number;
    tasa: number;
    montoSalida: number;
    metodo: string;
    tipo: 'Directa' | 'Inversa';
}

export default function NexusAuditoriaV8() {
    const [tasa, setTasa] = useState<number>(90);
    const [monto, setMonto] = useState<string>("");
    const [tipo, setTipo] = useState<'Directa' | 'Inversa'>('Directa');
    const [tarjeta, setTarjeta] = useState("Tarjeta Principal");
    const [operaciones, setOperaciones] = useState<Operacion[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    const misTarjetas = ["Tarjeta Principal", "Tarjeta Auxiliar", "Tarjeta Cuba-MN", "Efectivo Brasil", "Efectivo Cuba"];

    useEffect(() => {
        const datos = localStorage.getItem('nexus_v8_auditoria');
        if (datos) setOperaciones(JSON.parse(datos));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem('nexus_v8_auditoria', JSON.stringify(operaciones));
    }, [operaciones, isLoaded]);

    const registrar = () => {
        if (!monto) return;
        const m = parseFloat(monto);
        const salida = tipo === 'Directa' ? m * tasa : m / tasa;
        const nueva: Operacion = {
            id: Date.now(),
            dia: new Date().getDate().toString(),
            montoEntrada: m,
            tasa: tasa,
            montoSalida: salida,
            metodo: tarjeta,
            tipo: tipo
        };
        setOperaciones([nueva, ...operaciones]);
        setMonto("");
    };

    // CÁLCULO DE RESUMEN POR TARJETA
    const obtenerResumen = (nombreTarjeta: string) => {
        const ops = operaciones.filter(o => o.metodo === nombreTarjeta);
        let totalR = 0;
        let totalCUP = 0;
        ops.forEach(o => {
            if (o.tipo === 'Directa') {
                totalR += o.montoEntrada;
                totalCUP += o.montoSalida;
            } else {
                totalCUP += o.montoEntrada;
                totalR += o.montoSalida;
            }
        });
        return {totalR, totalCUP};
    };

    const limpiarTodo = () => {
        if (confirm("¿Seguro que quieres borrar todo el historial?")) setOperaciones([]);
    };

    if (!isLoaded) return <div style={{backgroundColor: '#0b141a', minHeight: '100vh'}}/>;

    return (
        <main style={{
            backgroundColor: '#0b141a',
            minHeight: '100vh',
            color: 'white',
            padding: '15px',
            border: '8px solid #1d4ed8'
        }}>

            {/* HEADER */}
            <header style={{
                backgroundColor: '#121f27',
                padding: '15px',
                borderRadius: '25px',
                borderBottom: '5px solid #dc2626',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '600px',
                margin: '0 auto 20px auto'
            }}>
                <h1 style={{fontSize: '20px', fontWeight: '900', fontStyle: 'italic'}}>NEXUS<span
                    style={{color: '#dc2626'}}>PRO</span></h1>
                <div style={{
                    backgroundColor: 'white',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}>
                    <span style={{color: 'black', fontWeight: 'bold', fontSize: '10px'}}>TASA:</span>
                    <input type="number" value={tasa} onChange={(e) => setTasa(parseFloat(e.target.value))} style={{
                        backgroundColor: 'transparent',
                        color: 'black',
                        fontWeight: '900',
                        fontSize: '16px',
                        width: '45px',
                        border: 'none',
                        outline: 'none'
                    }}/>
                </div>
            </header>

            <div style={{maxWidth: '600px', margin: '0 auto'}}>

                {/* SELECTOR DE TIPO */}
                <div style={{display: 'flex', gap: '8px', marginBottom: '15px'}}>
                    <button onClick={() => setTipo('Directa')} style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '10px',
                        backgroundColor: tipo === 'Directa' ? '#1d4ed8' : '#1c2c35',
                        border: 'none',
                        color: 'white'
                    }}>DIRECTA (R$ ➔ CUP)
                    </button>
                    <button onClick={() => setTipo('Inversa')} style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        fontSize: '10px',
                        backgroundColor: tipo === 'Inversa' ? '#a21caf' : '#1c2c35',
                        border: 'none',
                        color: 'white'
                    }}>INVERSA (CUP ➔ R$)
                    </button>
                </div>

                {/* REGISTRO */}
                <section style={{
                    backgroundColor: '#121f27',
                    padding: '15px',
                    borderRadius: '25px',
                    marginBottom: '20px',
                    border: '1px solid #374151'
                }}>
                    <select value={tarjeta} onChange={(e) => setTarjeta(e.target.value)} style={{
                        width: '100%',
                        backgroundColor: '#1c2c35',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '10px',
                        marginBottom: '10px',
                        border: 'none'
                    }}>
                        {misTarjetas.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                    </select>
                    <input type="number" placeholder={tipo === 'Directa' ? "R$" : "CUP"} value={monto}
                           onChange={(e) => setMonto(e.target.value)} style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: '#1c2c35',
                        padding: '15px',
                        borderRadius: '10px',
                        border: 'none',
                        color: tipo === 'Directa' ? '#4ade80' : '#f472b6',
                        fontWeight: 'bold',
                        fontSize: '24px',
                        textAlign: 'center',
                        marginBottom: '10px'
                    }}/>
                    <button onClick={registrar} style={{
                        width: '100%',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '15px',
                        borderRadius: '50px',
                        fontWeight: '900',
                        cursor: 'pointer',
                        border: 'none'
                    }}>GUARDAR OPERACIÓN
                    </button>
                </section>

                {/* PANEL DE AUDITORÍA (LO NUEVO) */}
                <h2 style={{
                    fontSize: '10px',
                    fontWeight: '900',
                    color: '#facc15',
                    marginBottom: '10px',
                    letterSpacing: '2px'
                }}>SALDOS POR CUENTA</h2>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '25px'}}>
                    {misTarjetas.map(t => {
                        const {totalR, totalCUP} = obtenerResumen(t);
                        if (totalR === 0 && totalCUP === 0) return null;
                        return (
                            <div key={t} style={{
                                backgroundColor: '#0f171d',
                                padding: '12px',
                                borderRadius: '15px',
                                borderLeft: '4px solid #facc15'
                            }}>
                                <p style={{
                                    fontSize: '8px',
                                    color: '#9ca3af',
                                    fontWeight: 'bold',
                                    marginBottom: '5px'
                                }}>{t.toUpperCase()}</p>
                                <p style={{
                                    fontSize: '11px',
                                    color: '#4ade80',
                                    fontWeight: 'bold'
                                }}>R$ {totalR.toFixed(2)}</p>
                                <p style={{
                                    fontSize: '11px',
                                    color: '#3b82f6',
                                    fontWeight: 'bold'
                                }}>$ {totalCUP.toLocaleString()}</p>
                            </div>
                        );
                    })}
                </div>

                {/* HISTORIAL */}
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                    <h2 style={{fontSize: '10px', fontWeight: '900', color: '#9ca3af'}}>HISTORIAL RECIENTE</h2>
                    <button onClick={limpiarTodo} style={{
                        fontSize: '8px',
                        color: '#dc2626',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}>BORRAR TODO
                    </button>
                </div>
                <section style={{
                    backgroundColor: '#121f27',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid #374151'
                }}>
                    <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
                        <tbody>
                        {operaciones.map((op) => (
                            <tr key={op.id} style={{borderBottom: '1px solid #1f2937'}}>
                                <td style={{padding: '12px', fontSize: '10px', color: '#6b7280'}}>{op.dia}</td>
                                <td style={{padding: '12px', fontSize: '9px', fontWeight: 'bold'}}>
                                    {op.metodo.toUpperCase()}<br/>
                                    <span
                                        style={{color: op.tipo === 'Inversa' ? '#f472b6' : '#3b82f6'}}>{op.tipo}</span>
                                </td>
                                <td style={{padding: '12px', fontSize: '11px', textAlign: 'right', fontWeight: 'bold'}}>
                                    <span
                                        style={{color: '#4ade80'}}>{op.tipo === 'Directa' ? `R$${op.montoEntrada}` : `R$${op.montoSalida.toFixed(2)}`}</span>
                                    <br/>
                                    <span
                                        style={{color: '#3b82f6'}}>{op.tipo === 'Directa' ? `$${op.montoSalida.toLocaleString()}` : `$${op.montoEntrada.toLocaleString()}`}</span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

            </div>
        </main>
    );
}