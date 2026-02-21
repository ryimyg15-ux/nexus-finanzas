'use client'

import AgregarMovimiento from '@/components/AgregarMovimiento'
import ExportarReporte from '@/components/ExportarReporte'
import Historial from '@/components/Historial'
import ResumenSaldo from '@/components/ResumenSaldo'

export default function Home() {
    return (
        <main className="min-h-screen bg-[#F1F5F9] py-12 px-4 flex flex-col items-center">
            <div className="w-full max-w-2xl">

                {/* Header con personalidad */}
                <div className="flex justify-between items-end mb-10 px-2">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                            NEXUS <span className="text-[#CF142B]">R&DAY</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Financial
                            Intelligence</p>
                    </div>
                    <ExportarReporte/>
                </div>

                {/* Dashboard de Saldo */}
                <div className="mb-8">
                    <ResumenSaldo/>
                </div>

                {/* Formulario: Ahora es una "Card" blanca elevada */}
                <section
                    className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden mb-12">
                    <AgregarMovimiento/>
                </section>

                {/* Historial con títulos claros */}
                <section>
                    <h2 className="text-slate-800 text-sm font-black uppercase tracking-widest mb-6 px-4">
                        Historial de Operaciones
                    </h2>
                    <div className="bg-white/50 backdrop-blur-sm rounded-[32px] p-2 border border-white">
                        <Historial/>
                    </div>
                </section>

                <footer
                    className="mt-20 text-center opacity-30 text-[9px] font-bold uppercase tracking-[0.5em] text-slate-900">
                    Nexus System v2.0 • 2026
                </footer>
            </div>
        </main>
    )
}