import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { SwRegister } from "@/components/pwa/SwRegister";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kebiasaan",
  description: "Catat kebiasaan baik dan burukmu, pantau progresnya, naik level.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Kebiasaan",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2" },
      { url: "/icon.png?v=2", type: "image/png" },
      { url: "/icons/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png?v=2",
  },
};

export const viewport: Viewport = {
  themeColor: "#1C1917",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`dark ${outfit.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-bg text-fg font-sans antialiased selection:bg-primary/30 selection:text-fg">
        <Providers>
          <OfflineBanner />
          <InstallPrompt />
          <SwRegister />
          {children}
        </Providers>
      </body>
    </html>
  );
}
