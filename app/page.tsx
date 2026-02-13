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

interface Tarjeta {
    id: string;
    nombre: string;
    saldoInicialCUP: number;
}

export default function NexusContabilidadV10() {
    const [tasa, setTasa] = useState<number>(90);
    const [monto, setMonto] = useState<string>("");
    const [tipo, setTipo] = useState<'Directa' | 'Inversa'>('Directa');
    const [operaciones, setOperaciones] = useState<Operacion[]>([]);
    const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);

    // Estados para edición y creación
    const [nuevaT, setNuevaT] = useState("");
    const [saldoInitT, setSaldoInitT] = useState<string>("0");
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState("");
    const [editandoOp, setEditandoOp] = useState<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const ops = localStorage.getItem('nexus_v10_ops');
        const cards = localStorage.getItem('nexus_v10_cards');
        if (ops) setOperaciones(JSON.parse(ops));
        if (cards) {
            const parsedCards = JSON.parse(cards);
            setTarjetas(parsedCards);
            if (parsedCards.length > 0) setTarjetaSeleccionada(parsedCards[0].nombre);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('nexus_v10_ops', JSON.stringify(operaciones));
            localStorage.setItem('nexus_v10_cards', JSON.stringify(tarjetas));
        }
    }, [operaciones, tarjetas, isLoaded]);

    const agregarTarjeta = () => {
        if (!nuevaT) return;
        const n: Tarjeta = {
            id: Date.now().toString(),
            nombre: nuevaT.toUpperCase(),
            saldoInicialCUP: parseFloat(saldoInitT) || 0
        };
        setTarjetas([...tarjetas, n]);
        if (!tarjetaSeleccionada) setTarjetaSeleccionada(n.nombre);
        setNuevaT("");
        setSaldoInitT("0");
    };

    const registrarOperacion = () => {
        if (!monto || !tarjetaSeleccionada) return;
        const m = parseFloat(monto);
        const salida = tipo === 'Directa' ? m * tasa : m / tasa;

        const nueva: Operacion = {
            id: Date.now(),
            dia: new Date().toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit'}),
            montoEntrada: m, tasa, montoSalida: salida,
            metodo: tarjetaSeleccionada, tipo
        };
        setOperaciones([nueva, ...operaciones]);
        setMonto("");
    };

    const eliminarOp = (id: number) => {
        if (confirm("¿Eliminar este registro?")) setOperaciones(operaciones.filter(o => o.id !== id));
    };

    // CÁLCULO DE SALDO REAL POR TARJETA
    const calcularSaldoCUP = (nombreT: string) => {
        const t = tarjetas.find(tar => tar.nombre === nombreT);
        if (!t) return 0;

        const movs = operaciones.filter(o => o.metodo === nombreT);
        let balance = t.saldoInicialCUP;

        movs.forEach(o => {
            if (o.tipo === 'Directa') {
                balance -= o.montoSalida; // Pagaste pesos en Cuba
            } else {
                balance += o.montoEntrada; // Recibiste pesos en Cuba
            }
        });
        return balance;
    };

    if (!isLoaded) return <div className="bg-[#0b141a] min-h-screen"/>;

    return (
        <main style={{
            backgroundColor: '#0b141a',
            minHeight: '100vh',
            color: 'white',
            padding: '15px',
            border: '8px solid #1d4ed8'
        }}>

            {/* SECCIÓN 1: GESTIÓN DE TARJETAS Y SALDOS */}
            <section style={{
                backgroundColor: '#121f27',
                padding: '20px',
                borderRadius: '25px',
                marginBottom: '20px',
                border: '1px solid #374151'
            }}>
                <h2 style={{fontSize: '10px', color: '#facc15', marginBottom: '15px', fontWeight: 'bold'}}>MIS TARJETAS
                    Y FONDOS</h2>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '15px'}}>
                    <input placeholder="NOMBRE" value={nuevaT} onChange={e => setNuevaT(e.target.value)} style={{
                        backgroundColor: '#1c2c35',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '12px'
                    }}/>
                    <input placeholder="SALDO INICIAL $" type="number" value={saldoInitT}
                           onChange={e => setSaldoInitT(e.target.value)} style={{
                        backgroundColor: '#1c2c35',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '12px'
                    }}/>
                    <button onClick={agregarTarjeta} style={{
                        backgroundColor: '#16a34a',
                        border: 'none',
                        padding: '10px 15px',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>+
                    </button>
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                    {tarjetas.map(t => (
                        <div key={t.id} style={{
                            backgroundColor: '#0b141a',
                            padding: '10px',
                            borderRadius: '12px',
                            border: '1px solid #1d4ed8'
                        }}>
                            <p style={{fontSize: '9px', color: '#9ca3af'}}>{t.nombre}</p>
                            <p style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#3b82f6'
                            }}>$ {calcularSaldoCUP(t.nombre).toLocaleString()}</p>
                            <button onClick={() => setTarjetas(tarjetas.filter(tar => tar.id !== t.id))} style={{
                                color: '#dc2626',
                                fontSize: '8px',
                                background: 'none',
                                border: 'none',
                                marginTop: '5px',
                                cursor: 'pointer'
                            }}>ELIMINAR CUENTA
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECCIÓN 2: REGISTRO DE OPERACIONES */}
            <section style={{backgroundColor: '#121f27', padding: '20px', borderRadius: '25px', marginBottom: '20px'}}>
                <div style={{display: 'flex', gap: '8px', marginBottom: '15px'}}>
                    <button onClick={() => setTipo('Directa')} style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        backgroundColor: tipo === 'Directa' ? '#1d4ed8' : '#1c2c35',
                        border: 'none',
                        color: 'white'
                    }}>PAGAR EN CUBA (R$ ➔ $)
                    </button>
                    <button onClick={() => setTipo('Inversa')} style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        backgroundColor: tipo === 'Inversa' ? '#a21caf' : '#1c2c35',
                        border: 'none',
                        color: 'white'
                    }}>RECOGER EN CUBA ($ ➔ R$)
                    </button>
                </div>

                <div style={{display: 'flex', gap: '8px', marginBottom: '10px'}}>
                    <select value={tarjetaSeleccionada} onChange={e => setTarjetaSeleccionada(e.target.value)} style={{
                        flex: 1,
                        backgroundColor: '#1c2c35',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none'
                    }}>
                        {tarjetas.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                    </select>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '10px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <span style={{color: 'black', fontWeight: 'bold', fontSize: '10px'}}>TASA:</span>
                        <input type="number" value={tasa} onChange={e => setTasa(parseFloat(e.target.value))} style={{
                            width: '40px',
                            color: 'black',
                            fontWeight: '900',
                            border: 'none',
                            outline: 'none',
                            textAlign: 'center'
                        }}/>
                    </div>
                </div>

                <input type="number" placeholder={tipo === 'Directa' ? "CANTIDAD REALES" : "CANTIDAD PESOS"}
                       value={monto} onChange={e => setMonto(e.target.value)} style={{
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
                    marginBottom: '15px'
                }}/>

                <button onClick={registrarOperacion} style={{
                    width: '100%',
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '18px',
                    borderRadius: '50px',
                    fontWeight: '900',
                    cursor: 'pointer',
                    border: 'none'
                }}>GUARDAR EN {tarjetaSeleccionada}</button>
            </section>

            {/* SECCIÓN 3: HISTORIAL CON EDICIÓN */}
            <section style={{backgroundColor: '#121f27', borderRadius: '20px', overflow: 'hidden'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead style={{backgroundColor: '#0f171d', fontSize: '9px', color: '#9ca3af'}}>
                    <tr>
                        <th style={{padding: '12px', textAlign: 'left'}}>DÍA / CUENTA</th>
                        <th style={{padding: '12px', textAlign: 'right'}}>VALORES</th>
                        <th style={{padding: '12px', textAlign: 'center'}}>ACCIÓN</th>
                    </tr>
                    </thead>
                    <tbody>
                    {operaciones.map(op => (
                        <tr key={op.id} style={{borderBottom: '1px solid #1f2937'}}>
                            <td style={{padding: '12px'}}>
                                <p style={{fontSize: '10px', fontWeight: 'bold'}}>{op.metodo}</p>
                                <p style={{
                                    fontSize: '8px',
                                    color: op.tipo === 'Inversa' ? '#f472b6' : '#3b82f6'
                                }}>{op.tipo} - {op.dia}</p>
                            </td>
                            <td style={{padding: '12px', textAlign: 'right'}}>
                                <p style={{
                                    fontSize: '11px',
                                    color: '#4ade80',
                                    fontWeight: 'bold'
                                }}>R$ {op.tipo === 'Directa' ? op.montoEntrada : op.montoSalida.toFixed(2)}</p>
                                <p style={{
                                    fontSize: '11px',
                                    color: '#3b82f6',
                                    fontWeight: 'bold'
                                }}>$ {op.tipo === 'Directa' ? op.montoSalida.toLocaleString() : op.montoEntrada.toLocaleString()}</p>
                            </td>
                            <td style={{textAlign: 'center'}}>
                                <button onClick={() => eliminarOp(op.id)} style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#dc2626',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}>🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>

        </main>
    );
}