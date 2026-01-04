import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/progress-bar";
import Link from "next/link";
import { Box } from "lucide-react";

async function getBins() {
  try {
    // For server components in Next.js, fetch with absolute URL or use internal route
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/bins`, { 
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.bins || [];
  } catch {
    return [];
  }
}

type Bin = { binId: string; zone: string; status: string; position?: string; size?: string };

export default async function BinsPage() {
  const bins: Bin[] = await getBins();
  
  // Transform API data to match component expectations
  const binsDisplay = bins.map((bin: Bin) => ({
    id: bin.binId,
    location: `Zone ${bin.zone}`,
    capacity: 100,
    occupied: 0, // TODO: Calculate from lots
    status: bin.status,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">All Bins</h1>
          <p className="text-muted-foreground">
            View and manage all warehouse bins
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {binsDisplay.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No bins found. Configure Google Sheets to see bins.
            </div>
          ) : (
            binsDisplay.map((bin) => {
            return (
              <Link key={bin.id} href={`/bins/${bin.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Box className="h-5 w-5" />
                      Bin {bin.id}
                    </CardTitle>
                    <CardDescription>{bin.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Occupancy</span>
                        <span className="font-medium">
                          {bin.occupied} / {bin.capacity}
                        </span>
                      </div>
                      <ProgressBar value={bin.occupied} max={bin.capacity} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          }))}
        </div>
      </main>
    </div>
  );
}

