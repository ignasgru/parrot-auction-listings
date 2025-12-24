import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Map, Package, Box } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Warehouse Operations</h1>
          <p className="text-muted-foreground">
            Manage your warehouse inventory, bins, and lots
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find & Scan
              </CardTitle>
              <CardDescription>
                Search for items or scan barcodes to locate inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/find">
                <Button className="w-full">Go to Find & Scan</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Warehouse Map
              </CardTitle>
              <CardDescription>
                Visual warehouse layout with interactive bin locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/map">
                <Button className="w-full">View Map</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Quick Access
              </CardTitle>
              <CardDescription>
                Common actions and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/bins">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Box className="h-4 w-4" />
                  View All Bins
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
