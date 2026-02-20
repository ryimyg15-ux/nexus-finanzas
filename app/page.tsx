import AgregarMovimiento from '@/components/AgregarMovimiento'

export default function Home() {
    return (
        <main
            className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-blue-900 to-black p-4 md:p-12 flex flex-col items-center">

            {/* Decoración de fondo (Opcional - Esferas difuminadas) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
                <div
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-xl z-10">
                {/* Header Estilizado */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                        NEXUS <span className="text-[#CF142B]">R&DAY</span>
                    </h1>
                    <div className="flex justify-center items-center gap-3">
                        <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/50"></span>
                        <p className="text-blue-300/80 text-[10px] uppercase tracking-[0.5em] font-bold">
                            Financial Solutions
                        </p>
                        <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/50"></span>
                    </div>
                </div>

                {/* Contenedor del Formulario con efecto de Cristal */}
                <div className="relative group">
                    <div
                        className="absolute -inset-1 bg-gradient-to-r from-[#002A8F] to-[#CF142B] rounded-[35px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                    <div className="relative bg-white rounded-[30px] shadow-2xl overflow-hidden">
                        {/* Aquí aparece tu formulario corregido */}
                        <AgregarMovimiento/>
                    </div>
                </div>

                {/* Espacio para el Historial (Futuro) */}
                <div className="mt-12 w-full">
                    <div className="flex items-center justify-between mb-4 px-4">
                        <h2 className="text-white/80 text-xs font-black uppercase tracking-widest">Actividad
                            Reciente</h2>
                        <span className="text-[10px] text-blue-400 font-bold px-2 py-1 bg-blue-500/10 rounded-full">En Vivo</span>
                    </div>

                    {/* Placeholder para la Tabla de Historial */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
                        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                            No hay transacciones registradas hoy
                        </p>
                    </div>
                </div>

                {/* Footer simple */}
                <footer className="mt-12 text-center">
                    <p className="text-white/30 text-[9px] font-medium uppercase tracking-widest">
                        &copy; 2026 Nexus R&Day • Privacidad & Seguridad
                    </p>
                </footer>
            </div>
        </main>
    )
}