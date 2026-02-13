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

export default function NexusTarjetasV7() {
    const [tasa, setTasa] = useState<number>(90);
    const [monto, setMonto] = useState<string>("");
    const [tipo, setTipo] = useState<'Directa' | 'Inversa'>('Directa');
    const [tarjeta, setTarjeta] = useState("Tarjeta Principal");
    const [operaciones, setOperaciones] = useState<Operacion[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Lista de tus tarjetas (puedes cambiarlas aquí)
    const misTarjetas = ["Tarjeta Principal", "Tarjeta Auxiliar", "Tarjeta Cuba-MN", "Efectivo Brasil", "Efectivo Cuba"];

    useEffect(() => {
        const datos = localStorage.getItem('nexus_v7_cards');
        if (datos) setOperaciones(JSON.parse(datos));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem('nexus_v7_cards', JSON.stringify(operaciones));
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

    if (!isLoaded) return <div style={{backgroundColor: '#0b141a', minHeight: '100vh'}}/>;

    return (
        <main style={{
            backgroundColor: '#0b141a',
            minHeight: '100vh',
            color: 'white',
            padding: '15px',
            border: '8px solid #1d4ed8'
        }}>

            {/* HEADER SIMPLIFICADO */}
            <header style={{
                backgroundColor: '#121f27',
                padding: '20px',
                borderRadius: '25px',
                borderBottom: '5px solid #dc2626',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '600px',
                margin: '0 auto 20px auto'
            }}>
                <h1 style={{fontSize: '22px', fontWeight: '900', fontStyle: 'italic'}}>NEXUS<span
                    style={{color: '#dc2626'}}>PRO</span></h1>
                <div style={{textAlign: 'right'}}>
                    <p style={{fontSize: '9px', color: '#facc15', fontWeight: 'bold'}}>TASA</p>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <span style={{color: 'black', fontWeight: 'bold', fontSize: '12px'}}>R$ 1 =</span>
                        <input type="number" value={tasa} onChange={(e) => setTasa(parseFloat(e.target.value))} style={{
                            backgroundColor: 'transparent',
                            color: 'black',
                            fontWeight: '900',
                            fontSize: '18px',
                            width: '50px',
                            border: 'none',
                            outline: 'none'
                        }}/>
                    </div>
                </div>
            </header>

            <div style={{maxWidth: '600px', margin: '0 auto'}}>

                {/* SELECTOR DE TIPO (DERECHA O INVERSA) */}
                <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                    <button onClick={() => setTipo('Directa')} style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        backgroundColor: tipo === 'Directa' ? '#1d4ed8' : '#1c2c35',
                        border: tipo === 'Directa' ? '2px solid white' : '1px solid #374151',
                        color: 'white'
                    }}>DIRECTA (R$ ➔ CUP)
                    </button>
                    <button onClick={() => setTipo('Inversa')} style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        fontSize: '11px',
                        backgroundColor: tipo === 'Inversa' ? '#a21caf' : '#1c2c35',
                        border: tipo === 'Inversa' ? '2px solid white' : '1px solid #374151',
                        color: 'white'
                    }}>INVERSA (CUP ➔ R$)
                    </button>
                </div>

                {/* REGISTRO RÁPIDO */}
                <section style={{
                    backgroundColor: '#121f27',
                    padding: '20px',
                    borderRadius: '25px',
                    border: '1px solid #374151',
                    marginBottom: '20px'
                }}>
                    <div style={{marginBottom: '15px'}}>
                        <label style={{
                            fontSize: '10px',
                            color: '#9ca3af',
                            fontWeight: 'bold',
                            display: 'block',
                            marginBottom: '5px'
                        }}>SELECCIONAR TARJETA / CUENTA</label>
                        <select value={tarjeta} onChange={(e) => setTarjeta(e.target.value)} style={{
                            width: '100%',
                            backgroundColor: '#1c2c35',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '10px',
                            border: '1px solid #374151',
                            fontWeight: 'bold'
                        }}>
                            {misTarjetas.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                        </select>
                    </div>

                    <div style={{marginBottom: '15px'}}>
                        <label style={{
                            fontSize: '10px',
                            color: '#9ca3af',
                            fontWeight: 'bold',
                            display: 'block',
                            marginBottom: '5px'
                        }}>MONTO A REGISTRAR</label>
                        <input type="number"
                               placeholder={tipo === 'Directa' ? "CANTIDAD EN REALES" : "CANTIDAD EN PESOS"}
                               value={monto} onChange={(e) => setMonto(e.target.value)} style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            backgroundColor: '#1c2c35',
                            padding: '15px',
                            borderRadius: '10px',
                            border: 'none',
                            color: tipo === 'Directa' ? '#4ade80' : '#f472b6',
                            fontWeight: 'bold',
                            fontSize: '24px',
                            textAlign: 'center'
                        }}/>
                    </div>

                    <button onClick={registrar} style={{
                        width: '100%',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '15px',
                        borderRadius: '50px',
                        fontWeight: '900',
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        border: 'none'
                    }}>
                        REGISTRAR EN {tarjeta.split(' ')[1] || 'CUENTA'}
                    </button>
                </section>

                {/* HISTORIAL POR TARJETA */}
                <section style={{
                    backgroundColor: '#121f27',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid #374151'
                }}>
                    <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
                        <thead style={{
                            backgroundColor: '#0f171d',
                            fontSize: '9px',
                            color: '#9ca3af',
                            textTransform: 'uppercase'
                        }}>
                        <tr>
                            <th style={{padding: '12px'}}>Día</th>
                            <th style={{padding: '12px'}}>Tarjeta</th>
                            <th style={{padding: '12px'}}>Entrada</th>
                            <th style={{padding: '12px', textAlign: 'right'}}>Salida</th>
                        </tr>
                        </thead>
                        <tbody>
                        {operaciones.map((op) => (
                            <tr key={op.id} style={{
                                borderBottom: '1px solid #1f2937',
                                backgroundColor: op.tipo === 'Inversa' ? 'rgba(162, 28, 175, 0.05)' : 'transparent'
                            }}>
                                <td style={{padding: '12px', fontSize: '11px', color: '#6b7280'}}>{op.dia}</td>
                                <td style={{
                                    padding: '12px',
                                    fontSize: '10px',
                                    fontWeight: 'black',
                                    color: op.tipo === 'Inversa' ? '#f472b6' : '#3b82f6'
                                }}>
                                    {op.metodo.toUpperCase()}
                                </td>
                                <td style={{padding: '12px', fontSize: '11px', fontWeight: 'bold'}}>
                                    {op.tipo === 'Directa' ? `R$${op.montoEntrada}` : `$${op.montoEntrada}`}
                                </td>
                                <td style={{
                                    padding: '12px',
                                    fontSize: '12px',
                                    fontWeight: '900',
                                    textAlign: 'right',
                                    color: op.tipo === 'Directa' ? '#3b82f6' : '#4ade80'
                                }}>
                                    {op.tipo === 'Directa' ? `$${op.montoSalida.toLocaleString()}` : `R$${op.montoSalida.toFixed(2)}`}
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