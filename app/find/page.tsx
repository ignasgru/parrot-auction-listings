"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, QrCode } from "lucide-react";

export default function FindPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [scanMode, setScanMode] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleScan = () => {
    setScanMode(!scanMode);
    // TODO: Implement barcode scanning
    console.log("Scan mode:", !scanMode);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Find & Scan</h1>
          <p className="text-muted-foreground">
            Search for items or scan barcodes to locate inventory
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search</CardTitle>
            <CardDescription>
              Enter item name, SKU, lot number, or scan a barcode
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search items, SKU, lot number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={scanMode ? "default" : "outline"}
                size="icon"
                onClick={handleScan}
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </form>
            {scanMode && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  Scan mode active. Point your camera at a barcode to scan.
                </p>
                {/* TODO: Implement barcode scanner component */}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              {searchQuery
                ? `No results found for "${searchQuery}"`
                : "Enter a search query or scan a barcode to get started"}
            </p>
            {/* TODO: Implement search results display */}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

