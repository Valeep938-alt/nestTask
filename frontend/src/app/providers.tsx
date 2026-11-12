"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";
import { useSessionHydration } from "@/features/auth/hooks/useSessionHydration";

function SessionHydration() {
  useSessionHydration();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      <SessionHydration />
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--accent)",
            color: "var(--accent-ink)",
            borderRadius: "999px",
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            letterSpacing: "0.05em",
          },
        }}
      />
    </QueryClientProvider>
  );
}
