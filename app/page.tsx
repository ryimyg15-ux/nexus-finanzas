'use client';

export default function Home() {
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen?.();
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
            <h1 className="text-4xl font-bold text-blue-500 mb-8">NEXUS FINANZAS</h1>
            <div className="grid gap-4">
                <button
                    onClick={toggleFullScreen}
                    className="px-6 py-3 bg-blue-600 rounded-lg font-bold hover:bg-blue-700 transition-all"
                >
                    ACTIVAR MODO TERMINAL
                </button>
            </div>
            <p className="mt-10 text-zinc-500">PWA Status: Verifying Manifest...</p>
        </main>
    );
}