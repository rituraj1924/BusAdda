import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Bus Journey — Immersive Experience",
  description: "An immersive, realistic passenger bus journey experience with ambient sounds and cinematic video.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bus Journey",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans h-full bg-black overflow-hidden antialiased`}>
        {/* Full-height, full-width container optimised for portrait 9:16 */}
        <div className="relative w-full h-full max-w-sm mx-auto overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
