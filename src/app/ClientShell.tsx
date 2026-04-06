"use client";

import { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "./theme";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { ToastRenderer } from "./ToastRenderer";
import { MobileDrawer } from "@/components/layout/MobileDrawer";

interface ClientShellProps {
  children: React.ReactNode;
}

export function ClientShell({ children }: ClientShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ChakraProvider value={system}>
      <Header onMenuClick={() => setDrawerOpen(true)} />
      <main style={{ flex: 1, minHeight: 0 }}>
        {children}
      </main>
      <Footer />
      <CookieBanner />
      <ToastRenderer />

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </ChakraProvider>
  );
}
