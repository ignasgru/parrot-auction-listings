import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/progress-bar";
import Link from "next/link";
import { Box } from "lucide-react";

export default function BinsPage() {
  // TODO: Fetch bins from API/Google Sheets
  const bins = [
    { id: "A1", location: "Aisle A, Section 1", capacity: 100, occupied: 65 },
    { id: "A2", location: "Aisle A, Section 2", capacity: 100, occupied: 0 },
    { id: "B1", location: "Aisle B, Section 1", capacity: 100, occupied: 80 },
    { id: "B2", location: "Aisle B, Section 2", capacity: 100, occupied: 45 },
  ];

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
          {bins.map((bin) => {
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
          })}
        </div>
      </main>
    </div>
  );
}

