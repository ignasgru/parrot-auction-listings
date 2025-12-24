import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sheetsClient } from "@/lib/google";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const LOTS_TAB = "LOTS";
const BINS_TAB = "BINS";

export async function POST(req: Request) {
  const session = await auth();
  const accessToken = (session as { accessToken?: string })?.accessToken;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const binId = body.binId;
  const setEmpty = body.setEmpty !== false; // default true

  if (!binId) {
    return NextResponse.json({ error: "binId is required" }, { status: 400 });
  }

  const sheets = sheetsClient(accessToken);

  // Get all lots data
  const lotsResp = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${LOTS_TAB}!A:Z`,
  });

  const lotsValues = lotsResp.data.values || [];
  let cleaned = 0;

  if (lotsValues.length >= 2) {
    const header = lotsValues[0].map((h) => String(h || "").trim());
    const iLot = header.indexOf("LotID");
    const iBin = header.indexOf("BinID");

    if (iLot < 0 || iBin < 0) {
      return NextResponse.json({ error: "Missing LotID or BinID column" }, { status: 400 });
    }

    // Find rows that need to be updated (where BinID == binId)
    const updates: { range: string; values: (string | number)[][] }[] = [];
    const binCol = String.fromCharCode(65 + iBin); // A=65, B=66, etc.

    for (let rowIdx = 1; rowIdx < lotsValues.length; rowIdx++) {
      const row = lotsValues[rowIdx];
      const lotBinId = iBin >= 0 ? String(row[iBin] || "").trim() : "";
      if (lotBinId === binId) {
        // Clear the BinID for this lot
        const range = `${LOTS_TAB}!${binCol}${rowIdx + 1}`;
        updates.push({
          range,
          values: [[""]], // Clear the cell
        });
      }
    }

    // Batch update all cleared BinIDs
    if (updates.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          valueInputOption: "RAW",
          data: updates,
        },
      });
      cleaned = updates.length;
    }
  }

  // Optionally update bin status to EMPTY
  if (setEmpty) {
    const binsResp = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${BINS_TAB}!A:Z`,
    });

    const binsValues = binsResp.data.values || [];
    if (binsValues.length >= 2) {
      const binsHeader = binsValues[0].map((h) => String(h || "").trim());
      const iBinId = binsHeader.indexOf("BinID");
      const iStatus = binsHeader.indexOf("Status");

      if (iBinId >= 0 && iStatus >= 0) {
        // Find the bin row
        for (let rowIdx = 1; rowIdx < binsValues.length; rowIdx++) {
          const row = binsValues[rowIdx];
          const rowBinId = iBinId >= 0 ? String(row[iBinId] || "").trim() : "";
          if (rowBinId === binId) {
            const statusCol = String.fromCharCode(65 + iStatus);
            await sheets.spreadsheets.values.update({
              spreadsheetId: SHEET_ID,
              range: `${BINS_TAB}!${statusCol}${rowIdx + 1}`,
              valueInputOption: "RAW",
              requestBody: {
                values: [["EMPTY"]],
              },
            });
            break;
          }
        }
      }
    }
  }

  return NextResponse.json({ success: true, cleaned, setEmpty });
}

