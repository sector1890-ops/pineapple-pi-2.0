"use client";

import { useState, useEffect } from "react";
import { Toaster, Toast } from "@chakra-ui/react";
import { toaster } from "./HomePageClient";

export function ToastRenderer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Toaster toaster={toaster}>
      {(toast) => (
        <Toast.Root>
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.CloseTrigger />
        </Toast.Root>
      )}
    </Toaster>
  );
}
