'use client'

import {useState} from 'react'
import {supabase} from '@/lib/supabase'

export default function AgregarMovimiento() {
    const [descripcion, setDescripcion] = useState('')
    const [monto, setMonto] = useState('')
    const [categoria, setCategoria] = useState('Gasto')
    const [cargando, setCargando] = useState(false)
    const [alerta, setAlerta] = useState<{ tipo: 'error' | 'success', texto: string } | null>(null)

    const mostrarAlerta = (texto: string, tipo: 'error' | 'success') => {
        setAlerta({texto, tipo})
        setTimeout(() => setAlerta(null), 4000)
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

            const {error: errorInsert} = await supabase
                .from('movimientos')
                .insert([{
                    descripcion: descripcion.trim(),
                    monto: montoNumerico,
                    categoria,
                    fecha: new Date().toISOString()
                }])

            if (errorInsert) throw errorInsert

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
        <div className="p-10 relative">
            {/* Sistema de Alerta Flotante */}
            {alerta && (
                <div
                    className={`absolute top-4 left-10 right-10 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center shadow-lg animate-bounce z-20 ${
                        alerta.tipo === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                    {alerta.texto}
                </div>
            )}

            <h3 className="text-slate-900 font-black text-xl mb-8 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-[#CF142B] rounded-full"></span>
                NUEVA TRANSACCIÓN
            </h3>

            <form onSubmit={guardarMovimiento} className="space-y-8">
                {/* Campo Descripción */}
                <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Descripción del Concepto
                    </label>
                    <input
                        type="text"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
                        placeholder="Ej. Combustible Corporativo"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Campo Monto */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Monto USD
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900 font-black text-lg shadow-sm"
                            placeholder="0.00"
                            required
                        />
                    </div>

                    {/* Campo Tipo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Tipo
                        </label>
                        <select
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl focus:bg-white focus:border-slate-900 outline-none transition-all text-slate-900 font-black cursor-pointer shadow-sm appearance-none"
                        >
                            <option value="Gasto">📉 GASTO</option>
                            <option value="Ingreso">📈 INGRESO</option>
                        </select>
                    </div>
                </div>

                {/* Botón de Acción Principal */}
                <button
                    type="submit"
                    disabled={cargando}
                    className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all duration-300 shadow-xl active:scale-[0.98] ${
                        cargando
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 text-white hover:bg-black hover:shadow-slate-300'
                    }`}
                >
                    {cargando ? 'PROCESANDO...' : 'EJECUTAR MOVIMIENTO'}
                </button>
            </form>
        </div>
    )
}