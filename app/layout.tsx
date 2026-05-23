import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./providers";
import { LanguageProvider } from "@/lib/LanguageProvider";

export const metadata: Metadata = {
  title: "Test Platform",
  description: "IQ, MBTI, Love, Numerology, Palm Reading platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <LanguageProvider>
          <Navbar />
          <Providers>{children}</Providers>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
