import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swMinify: true,
    disable: false, // Cambia a true si quieres desactivarlo en desarrollo
    workboxOptions: {
        disableDevLogs: true,
    },
});

export default withPWA({
    // Tus otras configuraciones de Next.js aquí
});