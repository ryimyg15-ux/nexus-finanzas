'use client'
import {useEffect, useState} from 'react'
import {supabase} from '@/lib/supabase'

export default function Historial() {
    // Definimos el tipo de ID como string para soportar UUID
    const [movimientos, setMovimientos] = useState<any[]>([])
    const [cargando, setCargando] = useState(true)

    const cargarHistorial = async () => {
        const {data, error} = await supabase
            .from('movimientos')
            .select('*')
            .order('creado_en', {ascending: false}) // Usamos tu columna 'creado_en' para el orden

        if (!error) setMovimientos(data || [])
        setCargando(false)
    }

    const eliminarMovimiento = async (id: string) => { // ID es string (UUID)
        if (!confirm('¿Seguro que quieres borrar este registro?')) return

        const {error} = await supabase
            .from('movimientos')
            .delete()
            .eq('id', id)

        if (error) {
            alert('Error al eliminar: ' + error.message)
        } else {
            setMovimientos(prev => prev.filter(m => m.id !== id))
        }
    }

    useEffect(() => {
        cargarHistorial()

        const channel = supabase
            .channel('historial-realtime')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'movimientos'
            }, () => {
                cargarHistorial()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    if (cargando) return (
        <div className="p-10 space-y-4">
            <div className="h-20 bg-slate-100 rounded-2xl animate-pulse"/>
            <div className="h-20 bg-slate-100 rounded-2xl animate-pulse"/>
        </div>
    )

    return (
        <div className="p-2 space-y-3">
            {movimientos.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
                    <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">Sin actividad
                        registrada</p>
                </div>
            ) : (
                movimientos.map((m) => (
                    <div
                        key={m.id}
                        className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-[24px] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                                m.categoria === 'Ingreso'
                                    ? 'bg-emerald-50 text-emerald-500'
                                    : 'bg-rose-50 text-rose-500'
                            }`}>
                                {m.categoria === 'Ingreso' ? '＋' : '－'}
                            </div>

                            <div>
                                <h4 className="text-slate-900 font-black text-sm uppercase tracking-tight mb-1">
                                    {m.descripcion}
                                </h4>
                                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                                    {/* Usamos la columna 'fecha' de tu SQL */}
                                    {m.fecha} • {m.categoria}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <p className={`text-base font-black tracking-tighter ${
                                m.categoria === 'Ingreso' ? 'text-emerald-600' : 'text-slate-900'
                            }`}>
                                {m.categoria === 'Ingreso' ? '+' : '-'}${Number(m.monto).toLocaleString()}
                            </p>

                            <button
                                onClick={() => eliminarMovimiento(m.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 bg-rose-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path
                                        d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}