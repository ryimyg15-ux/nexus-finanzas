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
        const datos = localStorage.getItem('nexus_final_v5');
        if (datos) setEnvios(JSON.parse(datos));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) localStorage.setItem('nexus_final_v5', JSON.stringify(envios));
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

    if (!isLoaded) return <div style={{backgroundColor: '#0b141a', minHeight: '100vh'}}/>;

    return (
        <main style={{
            backgroundColor: '#0b141a',
            minHeight: '100vh',
            color: 'white',
            padding: '20px',
            border: '8px solid #1d4ed8' // Azul Cuba
        }}>

            {/* HEADER ESTILO IMAGEN */}
            <header style={{
                backgroundColor: '#121f27',
                padding: '25px',
                borderRadius: '30px',
                borderBottom: '5px solid #dc2626', // Rojo Cuba
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '700px',
                margin: '0 auto 30px auto',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
            }}>
                <div>
                    <h1 style={{fontSize: '28px', fontWeight: '900', fontStyle: 'italic', letterSpacing: '-1px'}}>
                        NEXUS<span style={{color: '#dc2626'}}>PRO</span>
                    </h1>
                    <div style={{display: 'flex', gap: '8px', marginTop: '10px'}}>
                        <div style={{
                            width: '30px',
                            height: '18px',
                            backgroundColor: '#1d4ed8',
                            border: '1px solid white',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '10px'
                        }}>★
                        </div>
                        <div style={{
                            width: '30px',
                            height: '18px',
                            backgroundColor: '#16a34a',
                            border: '1px solid #facc15'
                        }}></div>
                    </div>
                </div>
                <div style={{textAlign: 'right'}}>
                    <p style={{fontSize: '10px', color: '#facc15', fontWeight: 'bold', textTransform: 'uppercase'}}>Tasa
                        de Hoy</p>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '5px 15px',
                        borderRadius: '10px',
                        marginTop: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <span style={{color: 'black', fontWeight: 'bold', fontSize: '12px'}}>R$ 1 =</span>
                        <input
                            type="number"
                            value={tasa}
                            onChange={(e) => setTasa(parseFloat(e.target.value))}
                            style={{
                                backgroundColor: 'transparent',
                                color: 'black',
                                fontWeight: '900',
                                fontSize: '20px',
                                width: '50px',
                                outline: 'none',
                                border: 'none'
                            }}
                        />
                    </div>
                </div>
            </header>

            <div style={{maxWidth: '700px', margin: '0 auto'}}>

                {/* CAJA DE NUEVA OPERACIÓN */}
                <section style={{
                    backgroundColor: '#121f27',
                    padding: '30px',
                    borderRadius: '40px',
                    border: '1px solid #374151',
                    marginBottom: '30px'
                }}>
                    <h2 style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        marginBottom: '20px'
                    }}>Nueva Operación</h2>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px'}}>
                        <input
                            type="text"
                            value={beneficiario}
                            onChange={(e) => setBeneficiario(e.target.value)}
                            placeholder="NOMBRE DEL BENEFICIARIO"
                            style={{
                                backgroundColor: '#1c2c35',
                                padding: '15px',
                                borderRadius: '15px',
                                border: 'none',
                                outline: 'none',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}
                        />
                        <input
                            type="number"
                            value={reales}
                            onChange={(e) => setReales(e.target.value)}
                            placeholder="MONTO R$ 0.00"
                            style={{
                                backgroundColor: '#1c2c35',
                                padding: '15px',
                                borderRadius: '15px',
                                border: 'none',
                                outline: 'none',
                                color: '#4ade80',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                fontFamily: 'monospace'
                            }}
                        />
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px'}}>
                        <button
                            onClick={() => setMetodo('Transferencia')}
                            style={{
                                padding: '12px',
                                borderRadius: '50px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                border: metodo === 'Transferencia' ? '2px solid white' : '2px solid #374151',
                                backgroundColor: metodo === 'Transferencia' ? '#1d4ed8' : '#1c2c35',
                                color: 'white'
                            }}
                        >TARJETA PRINCIPAL
                        </button>
                        <button
                            onClick={() => setMetodo('Efectivo')}
                            style={{
                                padding: '12px',
                                borderRadius: '50px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                border: metodo === 'Efectivo' ? '2px solid #facc15' : '2px solid #374151',
                                backgroundColor: metodo === 'Efectivo' ? '#16a34a' : '#1c2c35',
                                color: 'white'
                            }}
                        >EFECTIVO EN MANO
                        </button>
                    </div>

                    {metodo === 'Transferencia' && (
                        <select
                            value={tarjeta}
                            onChange={(e) => setTarjeta(e.target.value)}
                            style={{
                                width: '100%',
                                backgroundColor: '#1c2c35',
                                color: 'white',
                                padding: '15px',
                                borderRadius: '15px',
                                marginBottom: '20px',
                                border: 'none',
                                fontWeight: 'bold'
                            }}
                        >
                            <option value="Tarjeta Principal">TARJETA PRINCIPAL (CUBA)</option>
                            <option value="Tarjeta Auxiliar">TARJETA AUXILIAR</option>
                            <option value="Tarjeta Cuba-MN">TARJETA CUBA-MN</option>
                        </select>
                    )}

                    <button
                        onClick={registrar}
                        style={{
                            width: '100%',
                            backgroundColor: 'white',
                            color: 'black',
                            padding: '18px',
                            borderRadius: '50px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Registrar Operación
                    </button>
                </section>

                {/* TABLA DE TOTALES */}
                <section style={{
                    backgroundColor: '#121f27',
                    borderRadius: '30px',
                    overflow: 'hidden',
                    border: '1px solid #374151'
                }}>
                    <div style={{
                        padding: '15px',
                        backgroundColor: '#0f171d',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h3 style={{fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'}}>Historial de
                            Pagos</h3>
                        <select
                            value={filtroTarjeta}
                            onChange={(e) => setFiltroTarjeta(e.target.value)}
                            style={{
                                backgroundColor: 'transparent',
                                color: '#60a5fa',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                border: 'none',
                                outline: 'none'
                            }}
                        >
                            <option value="Todas">TODAS LAS TARJETAS</option>
                            <option value="Tarjeta Principal">SOLO PRINCIPAL</option>
                            <option value="Efectivo">SOLO EFECTIVO</option>
                        </select>
                    </div>
                    <div style={{overflowX: 'auto'}}>
                        <table style={{width: '100%', textAlign: 'left', borderCollapse: 'collapse'}}>
                            <thead style={{
                                backgroundColor: '#1c2c35',
                                fontSize: '9px',
                                color: '#9ca3af',
                                textTransform: 'uppercase'
                            }}>
                            <tr>
                                <th style={{padding: '15px'}}>Día</th>
                                <th style={{padding: '15px'}}>Beneficiario</th>
                                <th style={{padding: '15px'}}>Monto R$</th>
                                <th style={{padding: '15px', textAlign: 'right'}}>Total MN</th>
                            </tr>
                            </thead>
                            <tbody>
                            {enviosFiltrados.map((e) => (
                                <tr key={e.id} style={{borderBottom: '1px solid #1f2937'}}>
                                    <td style={{padding: '15px', fontSize: '12px', color: '#6b7280'}}>{e.dia}</td>
                                    <td style={{padding: '15px', fontSize: '11px', fontWeight: 'bold'}}>
                                        {e.beneficiario}<br/>
                                        <span style={{
                                            fontSize: '8px',
                                            color: e.metodo === 'Efectivo' ? '#eab308' : '#3b82f6'
                                        }}>
                        {e.metodo === 'Efectivo' ? 'EFECTIVO' : e.tarjetaOrigen}
                      </span>
                                    </td>
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '12px',
                                        color: '#4ade80',
                                        fontWeight: 'bold'
                                    }}>R${e.reales.toFixed(2)}</td>
                                    <td style={{
                                        padding: '15px',
                                        fontSize: '14px',
                                        color: '#3b82f6',
                                        fontWeight: '900',
                                        textAlign: 'right'
                                    }}>${e.saldoMN.toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* RESUMEN DE CAJA (LAS CÁPSULAS DE ABAJO) */}
                {/* ... (todo el código anterior de la tabla y los totales se mantiene igual) ... */}

            </div>

            <footer style={{
                textAlign: 'center',
                marginTop: '50px',
                paddingBottom: '30px',
                opacity: '0.4'
            }}>
                <p style={{
                    fontSize: '10px',
                    color: '#9ca3af',
                    letterSpacing: '3px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                }}>
                    NEXUS PRO • SISTEMA DE CONTROL DE REMESAS
                </p>
            </footer>
        </main>
    );
}
        