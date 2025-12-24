import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Package, Calendar, MapPin } from "lucide-react";

interface LotPageProps {
  params: Promise<{ id: string }>;
}

export default async function LotPage({ params }: LotPageProps) {
  const { id } = await params;

  // TODO: Fetch lot data from API/Google Sheets
  const lotData = {
    id,
    item: "Widget A",
    quantity: 25,
    binId: "A1",
    binLabel: "Bin A1",
    receivedDate: "2024-12-15",
    expiryDate: "2025-06-15",
    supplier: "Acme Corp",
    status: "Active",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="mb-6">
          <Link href="/bins">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bins
            </Button>
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Lot {lotData.id}
          </h1>
          <p className="text-muted-foreground">{lotData.item}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Lot Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Item</p>
                <p className="text-xl font-semibold">{lotData.item}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="text-2xl font-bold">{lotData.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  {lotData.status}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Bin</p>
                <Link href={`/bins/${lotData.binId}`}>
                  <Button variant="link" className="p-0 h-auto">
                    <p className="text-xl font-semibold">{lotData.binLabel}</p>
                  </Button>
                </Link>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supplier</p>
                <p className="text-lg">{lotData.supplier}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Received Date</p>
                <p className="text-lg">
                  {new Date(lotData.receivedDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expiry Date</p>
                <p className="text-lg">
                  {new Date(lotData.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

