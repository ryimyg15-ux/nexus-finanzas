'use client'

import {useState} from 'react'
import {supabase} from '@/lib/supabase'

export default function AgregarMovimiento() {
    const [descripcion, setDescripcion] = useState('')
    const [monto, setMonto] = useState('')
    const [categoria, setCategoria] = useState('Gasto')
    const [cargando, setCargando] = useState(false)

    // Estado para la alerta visual interna
    const [alerta, setAlerta] = useState<{ tipo: 'error' | 'success', texto: string } | null>(null)

    const mostrarAlerta = (texto: string, tipo: 'error' | 'success') => {
        setAlerta({texto, tipo})
        setTimeout(() => setAlerta(null), 4000) // Desaparece tras 4 segundos
    }

    const guardarMovimiento = async (e: React.FormEvent) => {
        e.preventDefault()
        const montoNumerico = parseFloat(monto)

        if (!monto || montoNumerico <= 0) {
            mostrarAlerta('Ingresa un monto válido', 'error')
            return
        }

        setCargando(true)

        try {
            // 1. Lógica de Validación de Saldo (Solo para Gastos)
            if (categoria === 'Gasto') {
                const {data: movimientos, error: errorFetch} = await supabase
                    .from('movimientos')
                    .select('monto, categoria')

                if (errorFetch) throw errorFetch

                const saldoActual = movimientos.reduce((acc, mov) => {
                    return mov.categoria === 'Ingreso' ? acc + mov.monto : acc - mov.monto
                }, 0)

                if (montoNumerico > saldoActual) {
                    mostrarAlerta(`Saldo insuficiente. Tienes $${saldoActual.toLocaleString()}`, 'error')
                    setCargando(false)
                    return
                }
            }

            // 2. Inserción en Supabase
            const {error: errorInsert} = await supabase
                .from('movimientos')
                .insert([{
                    descripcion: descripcion.trim(),
                    monto: montoNumerico,
                    categoria,
                    fecha: new Date().toISOString()
                }])

            if (errorInsert) throw errorInsert

            // Éxito
            mostrarAlerta('Transacción registrada con éxito', 'success')
            setDescripcion('')
            setMonto('')

        } catch (error: any) {
            mostrarAlerta(error.message, 'error')
        } finally {
            setCargando(false)
        }
    }

    return (
        <div className="p-8 relative">
            {/* Banner de Alerta Visual */}
            {alerta && (
                <div
                    className={`absolute top-4 left-8 right-8 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 z-20 ${
                        alerta.tipo === 'error'
                            ? 'bg-red-50 border border-red-100 text-red-600'
                            : 'bg-emerald-50 border border-emerald-100 text-emerald-600'
                    }`}>
                    <span className="text-sm">{alerta.tipo === 'error' ? '⚠️' : '✅'}</span>
                    {alerta.texto}
                </div>
            )}

            <div className="mb-6 mt-4">
                <h3 className="text-slate-900 font-black text-xl uppercase tracking-tighter">
                    Nueva Transacción <span className="text-[#CF142B]">.</span>
                </h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    Nexus Cloud • Verificación de Fondos
                </p>
            </div>

            <form onSubmit={guardarMovimiento} className="space-y-4">
                <div>
                    <label
                        className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Descripción</label>
                    <input
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full p-4 border border-slate-100 rounded-2xl text-black focus:ring-2 focus:ring-[#002A8F] outline-none transition bg-slate-50/50"
                        placeholder="Ej: Suscripción Mensual"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Monto
                            (USD)</label>
                        <input
                            type="number"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            className="w-full p-4 border border-slate-100 rounded-2xl text-black focus:ring-2 focus:ring-[#002A8F] outline-none transition bg-slate-50/50"
                            placeholder="0.00"
                            step="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label
                            className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tipo</label>
                        <select
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className="w-full p-4 border border-slate-100 rounded-2xl text-black focus:ring-2 focus:ring-[#002A8F] outline-none transition bg-white appearance-none cursor-pointer"
                        >
                            <option value="Gasto">📉 Gasto</option>
                            <option value="Ingreso">📈 Ingreso</option>
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={cargando}
                    className={`w-full mt-4 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] text-white transition-all transform active:scale-95 shadow-xl ${
                        cargando
                            ? 'bg-slate-200 text-slate-400'
                            : 'bg-gradient-to-r from-[#002A8F] to-[#CF142B] hover:opacity-90 hover:shadow-[#002A8F]/20'
                    }`}
                >
                    {cargando ? 'Sincronizando...' : 'Ejecutar Movimiento'}
                </button>
            </form>
        </div>
    )
}