'use client'
import {supabase} from '@/lib/supabase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ExportarReporte() {
    const generarPDF = async () => {
        const {data: movimientos, error} = await supabase
            .from('movimientos')
            .select('*')
            .order('fecha', {ascending: false})

        if (error || !movimientos || movimientos.length === 0) {
            return alert('No hay datos para exportar')
        }

        // EL FIX ESTÁ AQUÍ: Añadir "new"
        const doc = new jsPDF()

        // Estilo del encabezado
        doc.setFontSize(20)
        doc.setTextColor(0, 42, 143) // Azul Corporativo
        doc.text('NEXUS R&DAY - REPORT', 14, 22)

        doc.setFontSize(10)
        doc.setTextColor(150)
        doc.text(`Fecha: ${new Date().toLocaleString()}`, 14, 30)

        // Tabla
        autoTable(doc, {
            startY: 40,
            head: [['Fecha', 'Detalle', 'Tipo', 'Monto']],
            body: movimientos.map(m => [
                new Date(m.fecha).toLocaleDateString(),
                m.descripcion,
                m.categoria,
                `$${m.monto.toLocaleString()}`
            ]),
            headStyles: {fillColor: [207, 20, 43]}, // Rojo Nexus
        })

        doc.save(`Nexus_Finanzas.pdf`)
    }

    return (
        <button
            onClick={generarPDF}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all"
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            PDF
        </button>
    )
}