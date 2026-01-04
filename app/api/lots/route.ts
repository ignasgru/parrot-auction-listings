import { NextResponse } from "next/server";
import { sheetsClient } from "@/lib/google";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const TAB = "LOTS";

type Lot = {
  lotId: string;
  binId: string;
  title?: string;
  status?: string;
  buyer?: string;
  folderUrl?: string;
};

export async function GET(req: Request) {
  try {
    if (!SHEET_ID) {
      return NextResponse.json({ lots: [] });
    }

    const { searchParams } = new URL(req.url);
    const binId = searchParams.get("bin") || searchParams.get("binId"); // support both for backward compatibility

    const sheets = sheetsClient();
    if (!sheets) {
      return NextResponse.json({ lots: [] });
    }

    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!A:Z`,
    });

  const values = resp.data.values || [];
  if (values.length < 2) return NextResponse.json({ lots: [] });

  const header = values[0].map((h: unknown) => String(h || "").trim());
  const idx = (name: string) => header.indexOf(name);

  const iLot = idx("LotID");
  const iBin = idx("BinID");
  const iTitle = idx("Title");
  const iStatus = idx("Status");
  const iBuyer = idx("Buyer");
  const iFolderUrl = idx("FolderURL");

  const lots: Lot[] = values.slice(1).flatMap((row: unknown[]) => {
    const lotId = iLot >= 0 ? String(row[iLot] || "").trim() : "";
    if (!lotId) return [];

    const lotBinId = iBin >= 0 ? String(row[iBin] || "").trim() : "";
    
    // Filter by binId if provided
    if (binId && lotBinId !== binId) return [];

    // binId is required, skip if empty
    if (!lotBinId) return [];

    return [{
      lotId,
      binId: lotBinId,
      title: iTitle >= 0 ? String(row[iTitle] || "").trim() : undefined,
      status: iStatus >= 0 ? String(row[iStatus] || "").trim() : undefined,
      buyer: iBuyer >= 0 ? String(row[iBuyer] || "").trim() : undefined,
      folderUrl: iFolderUrl >= 0 ? String(row[iFolderUrl] || "").trim() : undefined,
    }];
  });

    return NextResponse.json({ lots });
  } catch (error) {
    console.error("Lots error:", error);
    // Return empty lots if Google Sheets not available
    return NextResponse.json({ lots: [] });
  }
}

