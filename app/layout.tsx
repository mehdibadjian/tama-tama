import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Tama-Tama",
  description: "Learn Mandarin with your virtual pet!",
  manifest: "/manifest.json",
  icons: {
    icon: "/tama-tama.svg",
    apple: "/tama-tama.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#7DD3FC",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.variable} h-full`}>
      <body className="min-h-full select-none">{children}</body>
    </html>
  );
}
