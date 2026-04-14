"use client";

import { useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ToastRenderer } from "./ToastRenderer";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

interface ClientShellProps {
  children: React.ReactNode;
}

const COLOR_MODE_KEY = "chakra-ui-color-mode";

export function ClientShell({ children }: ClientShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = localStorage.getItem(COLOR_MODE_KEY);
    if (saved === "light" || saved === "dark") {
      applyColorMode(saved as "light" | "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      applyColorMode("dark");
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!hydrated) {
    return null;
  }

  return (
    <ChakraProvider value={system}>
      <Header onMenuClick={() => setDrawerOpen(true)} />
      <main style={{ flex: 1, minHeight: 0 }}>
        {children}
      </main>
      <Footer />
      <CookieBanner />
      <ToastRenderer />
      <ScrollToTop />

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </ChakraProvider>
  );
}

function applyColorMode(mode: "light" | "dark") {
  const html = document.documentElement;
  html.classList.toggle("dark", mode === "dark");
  html.classList.toggle("light", mode === "light");
}
