import AgregarMovimiento from '@/components/AgregarMovimiento'

export default function Home() {
    return (
        <main className="min-h-screen p-8 bg-gray-100 flex flex-col items-center">
            <div className="w-full max-w-lg">
                <h1 className="text-3xl font-extrabold mb-8 text-blue-800 text-center">
                    Nexus Finanzas 📊
                </h1>

                {/* Aquí aparece tu formulario */}
                <AgregarMovimiento/>

                {/* Aquí es donde pondremos la Tabla de Historial después */}
            </div>
        </main>
    )
}