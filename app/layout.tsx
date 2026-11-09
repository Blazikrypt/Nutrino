import type { Metadata, Viewport } from "next";
import { Poppins, Lato, Manrope } from "next/font/google";
import PwaRegister from "../components/PwaRegister";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Nutrino - Meal Suggestions",
  description: "Your personalized nutrition and meal tracking assistant.",
  applicationName: "Nutrino",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nutrino",
  },
  icons: {
    icon: [
      { url: "/pwa-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/pwa-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#FEFDF5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${poppins.variable} ${lato.variable} ${manrope.variable} antialiased bg-background text-text-dark font-body`}
      >
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
