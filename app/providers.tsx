"use client";

export function Providers({ children }: { children: React.ReactNode }) {
  // No authentication needed - just return children directly
  return <>{children}</>;
}
