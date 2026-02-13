'use client';
import {useEffect, useState} from 'react';

interface Operacion {
    id: number;
    dia: string;
    montoEntrada: number;
    tasa: number;
    montoSalida: number;
    beneficiario: string;
    metodo: string;
    tipo: 'Directa' | 'Inversa';
}

export default function NexusProV6() {
    const [tasa, setTasa] = useState<number>(90);
    const [monto, setMonto] = useState<string>("");
    const [beneficiario, setBeneficiario] = useState("");
    const [tipo, setTipo] = useState<'Directa' | 'Inversa'>('Directa');
    const [metodo, setMetodo] = useState("Tarjeta Principal");
    const [operaciones, setOperaciones] = useState<Operacion[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const datos = localStorage.getItem('nexus_v6_final');
        if (datos) setOperaciones(JSON.parse(datos));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem('nexus_v6_final', JSON.stringify(operaciones));
    }, [operaciones, isLoaded]);

    const registrar = () => {
        if (!monto || !beneficiario) return;
        const m = parseFloat(monto);

        // Lógica Inversa: Si es Inversa, recibes CUP y das Reales (Monto / Tasa)
        const salida = tipo === 'Directa' ? m * tasa : m / tasa;

        const nueva: Operacion = {
            id: Date.now(),
            dia: new Date().getDate().toString(),
            montoEntrada: m,
            tasa: tasa,
            montoSalida: salida,
            beneficiario: beneficiario.toUpperCase(),
            metodo: metodo,
            tipo: tipo
        };

        setOperaciones([nueva, ...operaciones]);
        setMonto("");
        setBeneficiario("");
    };

    if (!isLoaded) return <div style={{backgroundColor: '#0b141a', minHeight: '100vh'}}/>;

    return (
        <main style={{
            backgroundColor: '#0b141a',
            minHeight: '100vh',
            color: 'white',
            padding: '20px',
            border: '8px solid #1d4ed8'
        }}>

            {/* HEADER */}
            <header style={{
                backgroundColor: '#121f27',
                padding: '25px',
                borderRadius: '30px',
                borderBottom: '5px solid #dc2626',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '800px',
                margin: '0 auto 30px auto'
            }}>
                <div>
                    <h1 style={{fontSize: '28px', fontWeight: '900', fontStyle: 'italic'}}>NEXUS<span
                        style={{color: '#dc2626'}}>PRO</span></h1>
                    <div style={{display: 'flex', gap: '8px', marginTop: '5px'}}>
                        <div style={{
                            width: '25px',
                            height: '15px',
                            backgroundColor: '#1d4ed8',
                            border: '1px solid white',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '8px'
                        }}>★
                        </div>
                        <div style={{
                            width: '25px',
                            height: '15px',
                            backgroundColor: '#16a34a',
                            border: '1px solid #facc15'
                        }}></div>
                    </div>
                </div>
                <div style={{textAlign: 'right'}}>
                    <p style={{fontSize: '10px', color: '#facc15', fontWeight: 'bold'}}>TASA ACTUAL</p>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '5px 15px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <span style={{color: 'black', fontWeight: 'bold'}}>1 R$ =</span>
                        <input type="number" value={tasa} onChange={(e) => setTasa(parseFloat(e.target.value))} style={{
                            backgroundColor: 'transparent',
                            color: 'black',
                            fontWeight: '900',
                            fontSize: '20px',
                            width: '60px',
                            border: 'none',
                            outline: 'none'
                        }}/>
                    </div>
                </div>
            </header>

            <div style={{maxWidth: '800px', margin: '0 auto'}}>

                {/* SELECTOR DE TIPO DE REMESA */}
                <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                    <button onClick={() => setTipo('Directa')} style={{
                        flex: 1,
                        padding: '15px',
                        borderRadius: '15px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        backgroundColor: tipo === 'Directa' ? '#1d4ed8' : '#1c2c35',
                        border: tipo === 'Directa' ? '2px solid white' : '1px solid #374151',
                        color: 'white'
                    }}>
                        REMESA DIRECTA (R$ → CUP)
                    </button>
                    <button onClick={() => setTipo('Inversa')} style={{
                        flex: 1,
                        padding: '15px',
                        borderRadius: '15px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        backgroundColor: tipo === 'Inversa' ? '#a21caf' : '#1c2c35',
                        border: tipo === 'Inversa' ? '2px solid white' : '1px solid #374151',
                        color: 'white'
                    }}>
                        REMESA INVERSA (CUP → R$)
                    </button>
                </div>

                {/* FORMULARIO */}
                <section style={{
                    backgroundColor: '#121f27',
                    padding: '25px',
                    borderRadius: '30px',
                    border: '1px solid #374151',
                    marginBottom: '30px'
                }}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
                        <input type="text" placeholder="CLIENTE / BENEFICIARIO" value={beneficiario}
                               onChange={(e) => setBeneficiario(e.target.value)} style={{
                            backgroundColor: '#1c2c35',
                            padding: '15px',
                            borderRadius: '12px',
                            border: 'none',
                            color: 'white',
                            fontWeight: 'bold'
                        }}/>
                        <input type="number"
                               placeholder={tipo === 'Directa' ? "CANTIDAD REALES" : "CANTIDAD PESOS (CUP)"}
                               value={monto} onChange={(e) => setMonto(e.target.value)} style={{
                            backgroundColor: '#1c2c35',
                            padding: '15px',
                            borderRadius: '12px',
                            border: 'none',
                            color: tipo === 'Directa' ? '#4ade80' : '#f472b6',
                            fontWeight: 'bold',
                            fontSize: '18px'
                        }}/>
                    </div>
                    <select value={metodo} onChange={(e) => setMetodo(e.target.value)} style={{
                        width: '100%',
                        backgroundColor: '#1c2c35',
                        color: 'white',
                        padding: '15px',
                        borderRadius: '12px',
                        marginBottom: '15px',
                        border: 'none'
                    }}>
                        <option>Tarjeta Principal</option>
                        <option>Tarjeta Auxiliar</option>
                        <option>Efectivo</option>
                    </select>
                    <button onClick={registrar} style={{
                        width: '100%',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '18px',
                        borderRadius: '50px',
                        fontWeight: '900',
                        textTransform: 'uppercase',
                        cursor: 'pointer'
                    }}>
                        Registrar {tipo}
                    </button>
                </section>

                {/* TABLA HISTORIAL */}
                <section style={{
                    backgroundColor: '#121f27',
                    borderRadius: '25px',
                    overflow: 'hidden',
                    border: '1px solid #374151'
                }}>
                    <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
                        <thead style={{
                            backgroundColor: '#0f171d',
                            fontSize: '10px',
                            color: '#9ca3af',
                            textTransform: 'uppercase'
                        }}>
                        <tr>
                            <th style={{padding: '15px'}}>Día</th>
                            <th style={{padding: '15px'}}>Detalle</th>
                            <th style={{padding: '15px'}}>Entrada</th>
                            <th style={{padding: '15px', textAlign: 'right'}}>Salida</th>
                        </tr>
                        </thead>
                        <tbody>
                        {operaciones.map((op) => (
                            <tr key={op.id} style={{
                                borderBottom: '1px solid #1f2937',
                                backgroundColor: op.tipo === 'Inversa' ? 'rgba(162, 28, 175, 0.05)' : 'transparent'
                            }}>
                                <td style={{padding: '15px', fontSize: '12px', color: '#6b7280'}}>{op.dia}</td>
                                <td style={{padding: '15px', fontSize: '11px', fontWeight: 'bold'}}>
                                    {op.beneficiario}<br/>
                                    <span
                                        style={{fontSize: '9px', color: op.tipo === 'Inversa' ? '#f472b6' : '#3b82f6'}}>
                       {op.tipo === 'Inversa' ? '🔄 INVERSA' : '➡️ DIRECTA'} - {op.metodo}
                    </span>
                                </td>
                                <td style={{padding: '15px', fontSize: '12px', fontWeight: 'bold'}}>
                                    {op.tipo === 'Directa' ? `R$ ${op.montoEntrada}` : `$ ${op.montoEntrada}`}
                                </td>
                                <td style={{
                                    padding: '15px',
                                    fontSize: '14px',
                                    fontWeight: '900',
                                    textAlign: 'right',
                                    color: op.tipo === 'Directa' ? '#3b82f6' : '#4ade80'
                                }}>
                                    {op.tipo === 'Directa' ? `$ ${op.montoSalida.toLocaleString()}` : `R$ ${op.montoSalida.toFixed(2)}`}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

            </div>
            <footer style={{textAlign: 'center', marginTop: '40px', paddingBottom: '20px', opacity: '0.4'}}>
                <p style={{fontSize: '10px', letterSpacing: '3px'}}>NEXUS PRO • SISTEMA INTEGRAL</p>
            </footer>
        </main>
    );
}