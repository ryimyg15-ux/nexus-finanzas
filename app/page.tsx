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

export default function NexusPersonalizadoV9() {
    const [tasa, setTasa] = useState<number>(90);
    const [monto, setMonto] = useState<string>("");
    const [tipo, setTipo] = useState<'Directa' | 'Inversa'>('Directa');
    const [operaciones, setOperaciones] = useState<Operacion[]>([]);

    // ESTADO PARA LAS TARJETAS PERSONALIZADAS
    const [misTarjetas, setMisTarjetas] = useState<string[]>([]);
    const [nuevaTarjeta, setNuevaTarjeta] = useState("");
    const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState("");

    const [isLoaded, setIsLoaded] = useState(false);

    // Cargar todo al iniciar
    useEffect(() => {
        const opsGuardadas = localStorage.getItem('nexus_v9_ops');
        const cardsGuardadas = localStorage.getItem('nexus_v9_cards');

        if (opsGuardadas) setOperaciones(JSON.parse(opsGuardadas));
        if (cardsGuardadas) {
            const cards = JSON.parse(cardsGuardadas);
            setMisTarjetas(cards);
            if (cards.length > 0) setTarjetaSeleccionada(cards[0]);
        }
        setIsLoaded(true);
    }, []);

    // Guardar cambios automáticamente
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('nexus_v9_ops', JSON.stringify(operaciones));
            localStorage.setItem('nexus_v9_cards', JSON.stringify(misTarjetas));
        }
    }, [operaciones, misTarjetas, isLoaded]);

    const agregarTarjeta = () => {
        if (!nuevaTarjeta) return;
        const listaActualizada = [...misTarjetas, nuevaTarjeta.toUpperCase()];
        setMisTarjetas(listaActualizada);
        setTarjetaSeleccionada(nuevaTarjeta.toUpperCase());
        setNuevaTarjeta("");
    };

    const eliminarTarjeta = (nombre: string) => {
        if (confirm(`¿Eliminar la cuenta ${nombre}?`)) {
            setMisTarjetas(misTarjetas.filter(t => t !== nombre));
        }
    };

    const registrarOperacion = () => {
        if (!monto || !tarjetaSeleccionada) return;
        const m = parseFloat(monto);
        const salida = tipo === 'Directa' ? m * tasa : m / tasa;

        const nueva: Operacion = {
            id: Date.now(),
            dia: new Date().toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit'}),
            montoEntrada: m,
            tasa: tasa,
            montoSalida: salida,
            metodo: tarjetaSeleccionada,
            tipo: tipo
        };
        setOperaciones([nueva, ...operaciones]);
        setMonto("");
    };

    const obtenerResumen = (nombreT: string) => {
        const ops = operaciones.filter(o => o.metodo === nombreT);
        let r = 0, cup = 0;
        ops.forEach(o => {
            if (o.tipo === 'Directa') {
                r += o.montoEntrada;
                cup += o.montoSalida;
            } else {
                cup += o.montoEntrada;
                r += o.montoSalida;
            }
        });
        return {r, cup};
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
                borderRadius: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <h1 style={{fontSize: '20px', fontWeight: '900', fontStyle: 'italic'}}>NEXUS<span
                    style={{color: '#dc2626'}}>PRO</span></h1>
                <div style={{
                    backgroundColor: 'white',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    color: 'black',
                    fontWeight: 'bold'
                }}>
                    TASA: <input type="number" value={tasa} onChange={(e) => setTasa(parseFloat(e.target.value))}
                                 style={{width: '40px', border: 'none', fontWeight: '900', outline: 'none'}}/>
                </div>
            </header>

            {/* GESTIÓN DE TARJETAS */}
            <section style={{
                backgroundColor: '#1c2c35',
                padding: '15px',
                borderRadius: '20px',
                marginBottom: '20px',
                border: '1px dashed #374151'
            }}>
                <p style={{fontSize: '10px', fontWeight: 'bold', color: '#facc15', marginBottom: '10px'}}>+ AGREGAR
                    NUEVA CUENTA/TARJETA</p>
                <div style={{display: 'flex', gap: '10px'}}>
                    <input value={nuevaTarjeta} onChange={(e) => setNuevaTarjeta(e.target.value)}
                           placeholder="NOMBRE (EJ. VISA LUIS)" style={{
                        flex: 1,
                        backgroundColor: '#0b141a',
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
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px'}}>
                    {misTarjetas.map(t => (
                        <span key={t} onClick={() => eliminarTarjeta(t)} style={{
                            fontSize: '9px',
                            backgroundColor: '#374151',
                            padding: '4px 8px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}>
              {t} ✕
            </span>
                    ))}
                </div>
            </section>

            {/* REGISTRO DE OPERACIÓN */}
            <section style={{backgroundColor: '#121f27', padding: '20px', borderRadius: '25px', marginBottom: '20px'}}>
                <div style={{display: 'flex', gap: '8px', marginBottom: '15px'}}>
                    <button onClick={() => setTipo('Directa')} style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        backgroundColor: tipo === 'Directa' ? '#1d4ed8' : '#1c2c35',
                        border: 'none',
                        color: 'white'
                    }}>DIRECTA
                    </button>
                    <button onClick={() => setTipo('Inversa')} style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        backgroundColor: tipo === 'Inversa' ? '#a21caf' : '#1c2c35',
                        border: 'none',
                        color: 'white'
                    }}>INVERSA
                    </button>
                </div>

                <select value={tarjetaSeleccionada} onChange={(e) => setTarjetaSeleccionada(e.target.value)} style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#1c2c35',
                    color: 'white',
                    border: 'none',
                    marginBottom: '10px'
                }}>
                    <option value="">-- SELECCIONA CUENTA --</option>
                    {misTarjetas.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <input type="number" placeholder={tipo === 'Directa' ? "REALES (R$)" : "PESOS (CUP)"} value={monto}
                       onChange={(e) => setMonto(e.target.value)} style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: '#1c2c35',
                    padding: '15px',
                    borderRadius: '10px',
                    border: 'none',
                    color: tipo === 'Directa' ? '#4ade80' : '#f472b6',
                    fontWeight: 'bold',
                    fontSize: '22px',
                    textAlign: 'center',
                    marginBottom: '10px'
                }}/>

                <button onClick={registrarOperacion} style={{
                    width: '100%',
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '15px',
                    borderRadius: '50px',
                    fontWeight: '900',
                    border: 'none'
                }}>GUARDAR OPERACIÓN
                </button>
            </section>

            {/* RESUMEN POR CUENTA */}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px'}}>
                {misTarjetas.map(t => {
                    const {r, cup} = obtenerResumen(t);
                    if (r === 0 && cup === 0) return null;
                    return (
                        <div key={t} style={{
                            backgroundColor: '#0f171d',
                            padding: '12px',
                            borderRadius: '15px',
                            borderLeft: '3px solid #facc15'
                        }}>
                            <p style={{fontSize: '9px', fontWeight: 'bold', marginBottom: '4px'}}>{t}</p>
                            <p style={{fontSize: '11px', color: '#4ade80'}}>R$ {r.toFixed(2)}</p>
                            <p style={{fontSize: '11px', color: '#3b82f6'}}>$ {cup.toLocaleString()}</p>
                        </div>
                    );
                })}
            </div>

        </main>
    );
}