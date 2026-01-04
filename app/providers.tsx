"use client";
import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering SessionProvider after mount
  if (!mounted) {
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
