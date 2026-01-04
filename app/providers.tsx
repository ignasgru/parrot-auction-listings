"use client";
import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-compiler/react-compiler
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering SessionProvider after mount
  // This is a valid use case for useEffect + setState
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
