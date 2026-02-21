'use client'
import {useEffect, useState} from 'react'
import {supabase} from '@/lib/supabase'

export default function ResumenSaldo() {
    const [totales, setTotales] = useState({ingresos: 0, gastos: 0, saldo: 0})
    const [loading, setLoading] = useState(true)

    const calcularTotales = async () => {
        const {data, error} = await supabase
            .from('movimientos')
            .select('monto, categoria')

        if (!error && data) {
            const stats = data.reduce((acc, mov) => {
                if (mov.categoria === 'Ingreso') acc.ingresos += mov.monto
                else acc.gastos += mov.monto
                return acc
            }, {ingresos: 0, gastos: 0})

            setTotales({
                ingresos: stats.ingresos,
                gastos: stats.gastos,
                saldo: stats.ingresos - stats.gastos
            })
        }
        setLoading(false)
    }

    useEffect(() => {
        calcularTotales()

        // Escuchar cambios en tiempo real para actualizar el saldo
        const channel = supabase
            .channel('saldo-realtime')
            .on('postgres_changes', {event: '*', schema: 'public', table: 'movimientos'}, () => {
                calcularTotales()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    if (loading) return (
        <div className="w-full h-40 bg-white rounded-[40px] animate-pulse border border-slate-100"/>
    )

    return (
        <div className="space-y-6">
            {/* Tarjeta de Saldo Principal */}
            <div
                className="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 text-center relative overflow-hidden">
                {/* Decoración sutil de fondo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 z-0"/>

                <div className="relative z-10">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3">
                        Balance Disponible
                    </p>
                    <h2 className={`text-6xl font-black tracking-tighter ${totales.saldo < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                        ${totales.saldo.toLocaleString()}
                        <span className="text-xl ml-1 opacity-30 text-slate-900">USD</span>
                    </h2>
                </div>
            </div>

            {/* Sub-tarjetas de Ingresos y Gastos */}
            <div className="grid grid-cols-2 gap-6">
                <div
                    className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm flex flex-col items-center">
                    <div
                        className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="3">
                            <path d="M12 19V5m-7 7l7-7 7 7"/>
                        </svg>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ingresos</p>
                    <p className="text-xl font-black text-emerald-600">+${totales.ingresos.toLocaleString()}</p>
                </div>

                <div
                    className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm flex flex-col items-center">
                    <div
                        className="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-3">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="3">
                            <path d="M12 5v14m-7-7l7 7 7-7"/>
                        </svg>
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Egresos</p>
                    <p className="text-xl font-black text-rose-600">-${totales.gastos.toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}