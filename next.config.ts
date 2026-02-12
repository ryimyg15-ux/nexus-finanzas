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
    /* Configuración normal de Next.js */

    // SOLUCIÓN AL ERROR: Forzamos el uso de Webpack para compatibilidad con PWA
    webpack: (config: any) => {
        return config;
    },
};

export default withPWA(nextConfig);