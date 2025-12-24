import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sheetsClient } from "@/lib/google";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const LOTS_TAB = "LOTS";

export async function POST(req: Request) {
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { lotId, targetBinId } = body;

  if (!lotId || !targetBinId) {
    return NextResponse.json({ error: "lotId and targetBinId are required" }, { status: 400 });
  }

  const sheets = sheetsClient(accessToken);

  // Get all lots data
  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${LOTS_TAB}!A:Z`,
  });

  const values = resp.data.values || [];
  if (values.length < 2) {
    return NextResponse.json({ error: "No lots found" }, { status: 404 });
  }

  const header = values[0].map((h) => String(h || "").trim());
  const iLot = header.indexOf("LotID");
  const iBin = header.indexOf("BinID");

  if (iLot < 0 || iBin < 0) {
    return NextResponse.json({ error: "Missing LotID or BinID column" }, { status: 400 });
  }

  // Find the lot row
  let found = false;
  for (let rowIdx = 1; rowIdx < values.length; rowIdx++) {
    const row = values[rowIdx];
    const rowLotId = iLot >= 0 ? String(row[iLot] || "").trim() : "";
    if (rowLotId === lotId) {
      // Update BinID
      const binCol = String.fromCharCode(65 + iBin); // A=65, B=66, etc.
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${LOTS_TAB}!${binCol}${rowIdx + 1}`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[targetBinId]],
        },
      });
      found = true;
      break;
    }
  }

  if (!found) {
    return NextResponse.json({ error: "Lot not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, lotId, targetBinId });
}

