import type {NextConfig} from "next";
// @ts-ignore
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    //swMinify: true,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        disableDevLogs: true,
    },
});

const nextConfig: NextConfig = {
    // 1. Movemos turbopack aquí (fuera de experimental)
    // Al dejarlo como objeto vacío, Next.js entiende que aceptamos la config
    turbopack: {},

    // 2. Forzamos Webpack para que el plugin de PWA no falle
    webpack: (config: any) => {
        return config;
    },
};

export default withPWA(nextConfig);