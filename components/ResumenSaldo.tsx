'use client'
import {useEffect, useState} from 'react'
import {supabase} from '@/lib/supabase'

export default function ResumenSaldo() {
    const [totales, setTotales] = useState({ingresos: 0, gastos: 0, saldo: 0})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const calcular = async () => {
            const {data} = await supabase.from('movimientos').select('monto, categoria')
            if (data) {
                const res = data.reduce((acc, m) => {
                    m.categoria === 'Ingreso' ? acc.ingresos += m.monto : acc.gastos += m.monto
                    return acc
                }, {ingresos: 0, gastos: 0})
                setTotales({ingresos: res.ingresos, gastos: res.gastos, saldo: res.ingresos - res.gastos})
            }
            setLoading(false)
        }
        calcular()
    }, [])

    if (loading) return <div className="h-24 bg-white rounded-3xl animate-pulse shadow-sm"/>

    return (
        <div className="space-y-4">
            {/* Card Principal Blanca */}
            <div
                className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] text-center">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Disponible</p>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                    ${totales.saldo.toLocaleString()}
                </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-emerald-600 text-[8px] font-black uppercase tracking-widest mb-1">Ingresos</p>
                    <p className="text-emerald-700 font-bold">+${totales.ingresos.toLocaleString()}</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100">
                    <p className="text-rose-600 text-[8px] font-black uppercase tracking-widest mb-1">Gastos</p>
                    <p className="text-rose-700 font-bold">-${totales.gastos.toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}