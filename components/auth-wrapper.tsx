"use client";

import { useSession, signIn } from "next-auth/react";
import { ReactNode } from "react";

export function AuthWrapper({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="p-6 text-slate-500">Checking login…</div>;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          className="px-6 py-3 rounded-full bg-slate-900 text-white font-bold"
          onClick={() => signIn("google")}
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

