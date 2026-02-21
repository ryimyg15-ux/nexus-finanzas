'use client'
import {useEffect, useState} from 'react'
import {supabase} from '@/lib/supabase'

export default function Historial() {
    const [movs, setMovs] = useState<any[]>([])

    useEffect(() => {
        const fetch = async () => {
            const {data} = await supabase.from('movimientos').select('*').order('fecha', {ascending: false})
            if (data) setMovs(data)
        }
        fetch()
    }, [])

    return (
        <div className="space-y-2 p-2">
            {movs.map((m) => (
                <div key={m.id}
                     className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl transition-all">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs ${m.categoria === 'Ingreso' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            {m.categoria === 'Ingreso' ? '↑' : '↓'}
                        </div>
                        <div>
                            <p className="text-slate-900 font-bold text-sm">{m.descripcion}</p>
                            <p className="text-slate-400 text-[9px] uppercase font-bold tracking-tighter">{m.categoria}</p>
                        </div>
                    </div>
                    <p className={`font-black text-sm ${m.categoria === 'Ingreso' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {m.categoria === 'Ingreso' ? '+' : '-'}${m.monto.toLocaleString()}
                    </p>
                </div>
            ))}
        </div>
    )
}