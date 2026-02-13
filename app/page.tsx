'use client';
import {useEffect, useState} from 'react';

// ESTRUCTURAS DE DATOS
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

export default function NexusDatabaseV11() {
    const [tasa, setTasa] = useState<number>(90);
    const [monto, setMonto] = useState<string>("");
    const [tipo, setTipo] = useState<'Directa' | 'Inversa'>('Directa');
    const [operaciones, setOperaciones] = useState<Operacion[]>([]);
    const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    // CARGA DE DATOS (Simulando DB con LocalStorage por ahora)
    useEffect(() => {
        const ops = localStorage.getItem('nexus_ops');
        const cards = localStorage.getItem('nexus_cards');
        if (ops) setOperaciones(JSON.parse(ops));
        if (cards) {
            const parsed = JSON.parse(cards);
            setTarjetas(parsed);
            if (parsed.length > 0) setTarjetaSeleccionada(parsed[0].nombre);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('nexus_ops', JSON.stringify(operaciones));
            localStorage.setItem('nexus_cards', JSON.stringify(tarjetas));
        }
    }, [operaciones, tarjetas, isLoaded]);

    // LÓGICA DE CÁLCULOS
    const statsPorTarjeta = (nombreT: string) => {
        const t = tarjetas.find(tar => tar.nombre === nombreT);
        const movs = operaciones.filter(o => o.metodo === nombreT);

        let saldoCUP = t?.saldoInicialCUP || 0;
        let realesComprados = 0; // Reales obtenidos vía Inversa

        movs.forEach(o => {
            if (o.tipo === 'Directa') {
                saldoCUP -= o.montoSalida;
            } else {
                saldoCUP += o.montoEntrada;
                realesComprados += o.montoSalida;
            }
        });
        return {saldoCUP, realesComprados};
    };

    const totalCUPGlobal = tarjetas.reduce((acc, t) => acc + statsPorTarjeta(t.nombre).saldoCUP, 0);
    const totalRealesCompradosGlobal = tarjetas.reduce((acc, t) => acc + statsPorTarjeta(t.nombre).realesComprados, 0);

    if (!isLoaded) return <div className="bg-[#0b141a] min-h-screen"/>;

    return (
        <main style={{
            backgroundColor: '#0b141a',
            minHeight: '100vh',
            color: 'white',
            padding: '15px',
            border: '8px solid #1d4ed8'
        }}>

            {/* PANEL DE CONTROL TOTAL (GLOBAL) */}
            <section style={{
                backgroundColor: '#121f27',
                padding: '20px',
                borderRadius: '25px',
                marginBottom: '20px',
                border: '2px solid #facc15'
            }}>
                <h2 style={{
                    fontSize: '12px',
                    fontWeight: '900',
                    color: '#facc15',
                    textAlign: 'center',
                    marginBottom: '15px'
                }}>ESTADO GLOBAL DEL NEGOCIO</h2>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                    <div style={{
                        textAlign: 'center',
                        background: 'rgba(59, 130, 246, 0.1)',
                        padding: '15px',
                        borderRadius: '15px'
                    }}>
                        <p style={{fontSize: '10px', color: '#3b82f6'}}>TOTAL CUP EN CUBA</p>
                        <p style={{fontSize: '20px', fontWeight: '900'}}>$ {totalCUPGlobal.toLocaleString()}</p>
                    </div>
                    <div style={{
                        textAlign: 'center',
                        background: 'rgba(22, 163, 74, 0.1)',
                        padding: '15px',
                        borderRadius: '15px'
                    }}>
                        <p style={{fontSize: '10px', color: '#4ade80'}}>TOTAL REALES COMPRADOS</p>
                        <p style={{fontSize: '20px', fontWeight: '900'}}>R$ {totalRealesCompradosGlobal.toFixed(2)}</p>
                    </div>
                </div>
            </section>

            {/* LISTADO DETALLADO POR TARJETA */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '20px'}}>
                {tarjetas.map(t => {
                    const stats = statsPorTarjeta(t.nombre);
                    return (
                        <div key={t.id} style={{
                            backgroundColor: '#1c2c35',
                            padding: '15px',
                            borderRadius: '18px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <p style={{fontWeight: 'bold', color: '#fff'}}>{t.nombre}</p>
                                <p style={{fontSize: '10px', color: '#9ca3af'}}>Saldo: <span
                                    style={{color: '#3b82f6'}}>${stats.saldoCUP.toLocaleString()}</span></p>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <p style={{fontSize: '9px', color: '#4ade80'}}>R$ COMPRADOS</p>
                                <p style={{fontWeight: 'bold'}}>{stats.realesComprados.toFixed(2)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FORMULARIO DE REGISTRO (IGUAL AL ANTERIOR) */}
            <section style={{
                backgroundColor: '#121f27',
                padding: '20px',
                borderRadius: '25px',
                border: '1px solid #374151'
            }}>
                <h3 style={{fontSize: '10px', color: '#9ca3af', marginBottom: '10px'}}>NUEVA OPERACIÓN</h3>
                <select value={tarjetaSeleccionada} onChange={e => setTarjetaSeleccionada(e.target.value)} style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#1c2c35',
                    color: 'white',
                    border: 'none',
                    marginBottom: '10px'
                }}>
                    {tarjetas.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                </select>
                <div style={{display: 'flex', gap: '5px', marginBottom: '10px'}}>
                    <button onClick={() => setTipo('Directa')} style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        background: tipo === 'Directa' ? '#1d4ed8' : '#0b141a',
                        border: 'none',
                        color: 'white',
                        fontSize: '10px'
                    }}>PAGAR CUP
                    </button>
                    <button onClick={() => setTipo('Inversa')} style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        background: tipo === 'Inversa' ? '#a21caf' : '#0b141a',
                        border: 'none',
                        color: 'white',
                        fontSize: '10px'
                    }}>RECOGER CUP
                    </button>
                </div>
                <input type="number" placeholder="MONTO" value={monto} onChange={e => setMonto(e.target.value)} style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: '#1c2c35',
                    padding: '15px',
                    borderRadius: '10px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '20px',
                    textAlign: 'center'
                }}/>
                <button onClick={() => {/* ... logica registrar ... */
                }} style={{
                    width: '100%',
                    marginTop: '10px',
                    padding: '15px',
                    borderRadius: '50px',
                    background: 'white',
                    color: 'black',
                    fontWeight: '900'
                }}>GUARDAR
                </button>
            </section>

        </main>
    );
}