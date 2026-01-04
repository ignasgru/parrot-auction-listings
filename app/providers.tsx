"use client";

export function Providers({ children }: { children: React.ReactNode }) {
  // No authentication needed - just return children directly
  // Suppress hydration warning to prevent Next.js metadata hydration issues
  return <div suppressHydrationWarning>{children}</div>;
}
