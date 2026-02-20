'use client'

import {useState} from 'react'
import {supabase} from '@/lib/supabase' // Importamos el cliente que configuramos antes

export default function AgregarMovimiento() {
    const [descripcion, setDescripcion] = useState('')
    const [monto, setMonto] = useState('')
    const [categoria, setCategoria] = useState('Gasto')
    const [cargando, setCargando] = useState(false)

    const guardarMovimiento = async (e: React.FormEvent) => {
        e.preventDefault()
        setCargando(true)

        const {data, error} = await supabase
            .from('movimientos') // El nombre de tu tabla en Supabase
            .insert([
                {
                    descripcion,
                    monto: parseFloat(monto),
                    categoria
                }
            ])

        if (error) {
            alert('Error al guardar: ' + error.message)
        } else {
            alert('¡Guardado con éxito!')
            setDescripcion('')
            setMonto('')
        }
        setCargando(false)
    }

    return (
        <form onSubmit={guardarMovimiento} className="p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="text-xl font-bold mb-4 text-black">Nuevo Registro</h2>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full p-2 border rounded mt-1 text-black"
                    placeholder="Ej: Pago de Internet"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Monto ($)</label>
                <input
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="w-full p-2 border rounded mt-1 text-black"
                    placeholder="0.00"
                    step="0.01"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={cargando}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
                {cargando ? 'Guardando...' : 'Registrar Movimiento'}
            </button>
        </form>
    )
}