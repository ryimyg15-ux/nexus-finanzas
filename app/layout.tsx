import type {Metadata, Viewport} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";

// Configuración de Fuentes
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// METADATA UNIFICADA (Configuración de PWA y SEO)
export const metadata: Metadata = {
    title: "Nexus Dashboard",
    description: "Trading and Logistics Platform",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Nexus Dashboard",
    },
};

// VIEWPORT (Control de zoom y color de barra de estado)
export const viewport: Viewport = {
    themeColor: "#05070a",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
        <head>
            {/* Etiquetas necesarias para PWA en iOS */}
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#05070a]`}
        >
        {children}
        </body>
        </html>
    );
}