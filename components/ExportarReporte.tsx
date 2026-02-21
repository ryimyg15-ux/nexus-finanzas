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

        if (error || !movimientos) return alert('No hay datos para exportar')

        const doc = jsPDF()

        // Estilo del encabezado
        doc.setFontSize(20)
        doc.setTextColor(0, 42, 143) // Tu azul corporativo #002A8F
        doc.text('NEXUS R&DAY - FINANCIAL REPORT', 14, 22)

        doc.setFontSize(10)
        doc.setTextColor(150)
        doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 30)

        // Tabla de movimientos
        autoTable(doc, {
            startY: 40,
            head: [['Fecha', 'Descripción', 'Categoría', 'Monto (USD)']],
            body: movimientos.map(m => [
                new Date(m.fecha).toLocaleDateString(),
                m.descripcion,
                m.categoria.toUpperCase(),
                `$${m.monto.toLocaleString()}`
            ]),
            headStyles: {fillStyle: 'f', fillColor: [207, 20, 43]}, // Tu rojo #CF142B
            alternateRowStyles: {fillColor: [245, 245, 245]},
        })

        doc.save(`Nexus_Reporte_${Date.now()}.pdf`)
    }

    return (
        <button
            onClick={generarPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 transition-all"
        >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Exportar PDF
        </button>
    )
}