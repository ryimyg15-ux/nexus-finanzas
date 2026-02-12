import type {NextConfig} from "next";
// @ts-ignore
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swMinify: true,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        disableDevLogs: true,
    },
});

const nextConfig: NextConfig = {
    // 1. Esto silencia el error de Next.js 16 al aceptar Turbopack explícitamente
    experimental: {
        turbopack: {
            // Puedes dejarlo vacío o configurar reglas si fuera necesario
        },
    },

    // 2. Mantenemos esto para que el plugin de PWA pueda inyectar su lógica
    webpack: (config: any) => {
        return config;
    },
};

export default withPWA(nextConfig);