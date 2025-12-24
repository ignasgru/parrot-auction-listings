import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/progress-bar";
import Link from "next/link";
import { ArrowLeft, Package, Box } from "lucide-react";

interface BinPageProps {
  params: Promise<{ id: string }>;
}

export default async function BinPage({ params }: BinPageProps) {
  const { id } = await params;

  // TODO: Fetch bin data from API/Google Sheets
  const binData = {
    id,
    label: id,
    location: "Aisle A, Section 1",
    capacity: 100,
    occupied: 65,
    lots: [
      { id: "LOT-001", item: "Widget A", quantity: 25 },
      { id: "LOT-002", item: "Widget B", quantity: 40 },
    ],
  };

  const occupancyPercentage = (binData.occupied / binData.capacity) * 100;

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <Link href="/map">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Map
            </Button>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Bin {binData.label}
          </h1>
          <p className="text-muted-foreground">{binData.location}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" />
                Bin Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="text-2xl font-bold">
                  {binData.occupied} / {binData.capacity}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Occupancy</p>
                <ProgressBar value={binData.occupied} max={binData.capacity} />
                <p className="text-sm text-muted-foreground mt-1">
                  {occupancyPercentage.toFixed(1)}% full
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Lots in Bin
              </CardTitle>
              <CardDescription>
                {binData.lots.length} lot{binData.lots.length !== 1 ? "s" : ""} stored here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {binData.lots.map((lot) => (
                  <Link key={lot.id} href={`/lots/${lot.id}`}>
                    <div className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{lot.item}</p>
                          <p className="text-sm text-muted-foreground">
                            Lot: {lot.id}
                          </p>
                        </div>
                        <p className="font-semibold">Qty: {lot.quantity}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

