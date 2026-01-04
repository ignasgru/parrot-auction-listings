import "./globals.css";
import { Providers } from "./providers";
import { AuthWrapper } from "@/components/auth-wrapper";

export const metadata = {
  title: "Parrot Ops - Warehouse Operations",
  description: "Manage your warehouse inventory, bins, and lots",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <AuthWrapper>{children}</AuthWrapper>
        </Providers>
      </body>
    </html>
  );
}
