import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./ChakraProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Box } from "@chakra-ui/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pineapple Pi 2.0 — Микрокомпьютеры для разработки",
    template: "%s | Pineapple Pi 2.0",
  },
  description:
    "Каталог микрокомпьютеров Pineapple Pi. Компактные решения для встраиваемых систем, IoT и прототипирования.",
  keywords: [
    "микрокомпьютеры",
    "встраиваемые системы",
    "IoT",
    "прототипирование",
    "Pineapple Pi",
  ],
  authors: [{ name: "Pineapple Pi Team" }],
  openGraph: {
    title: "Pineapple Pi 2.0 — Микрокомпьютеры для разработки",
    description: "Каталог микрокомпьютеров для встраиваемых систем и IoT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Header />
          <Box as="main" flex={1}>
            {children}
          </Box>
          <Footer />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
