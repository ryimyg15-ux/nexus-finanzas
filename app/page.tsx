'use client'

import AgregarMovimiento from '@/components/AgregarMovimiento'
import ExportarReporte from '@/components/ExportarReporte'
import Historial from '@/components/Historial'
import ResumenSaldo from '@/components/ResumenSaldo'

export default function Home() {
    return (
        <main className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 flex flex-col items-center relative overflow-hidden">

            {/* Fondo Decorativo Sutil (No oscuro) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div
                    className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-blue-100 rounded-full blur-[100px]"></div>
                <div
                    className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-red-50 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-xl z-10">
                {/* Header Profesional y Claro */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">
                        NEXUS <span className="text-[#CF142B]">R&DAY</span>
                    </h1>
                    <p className="text-slate-400 text-[9px] uppercase tracking-[0.4em] font-bold">
                        Financial Management System
                    </p>
                </div>

                {/* Resumen de Saldo (Ahora con fondo blanco y sombras suaves) */}
                <div className="mb-8">
                    <ResumenSaldo/>
                </div>

                {/* Contenedor del Formulario (Blanco puro con sombra elegante) */}
                <div
                    className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden mb-12">
                    <AgregarMovimiento/>
                </div>

                {/* Historial (Limpio y con contraste) */}
                <div className="w-full">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-slate-800 text-xs font-black uppercase tracking-widest">
                            Actividad Reciente
                        </h2>
                        <div className="flex items-center gap-3">
                            <ExportarReporte/>
                            <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-full">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                <span
                                    className="text-[9px] text-blue-600 font-bold uppercase tracking-tight">Live</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[28px] p-2 shadow-sm border border-slate-100">
                        <Historial/>
                    </div>
                </div>

                <footer className="mt-16 mb-8 text-center">
                    <p className="text-slate-300 text-[9px] font-bold uppercase tracking-widest">
                        &copy; 2026 Nexus R&Day • Secure Environment
                    </p>
                </footer>
            </div>
        </main>
    )
}