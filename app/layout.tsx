import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Parrot Ops - Warehouse Operations",
  description: "Manage your warehouse inventory, bins, and lots",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
