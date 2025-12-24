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
  const { binId, lotId, title, status, buyer } = body;

  if (!binId || !lotId) {
    return NextResponse.json({ error: "binId and lotId are required" }, { status: 400 });
  }

  const sheets = sheetsClient(accessToken);

  // Get header row to find column indices
  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${LOTS_TAB}!A1:Z1`,
  });

  const header = resp.data.values?.[0] || [];
  const idx = (name: string) => header.findIndex((h: string) => String(h || "").trim().toUpperCase() === name.toUpperCase());

  const iLot = idx("LotID");
  const iBin = idx("BinID");
  const iTitle = idx("Title");
  const iStatus = idx("Status");
  const iBuyer = idx("Buyer");

  if (iLot < 0 || iBin < 0) {
    return NextResponse.json({ error: "Missing LotID or BinID column" }, { status: 400 });
  }

  // Get all data to find next empty row
  const allDataResp = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${LOTS_TAB}!A:Z`,
  });

  const allRows = allDataResp.data.values || [];
  const nextRow = allRows.length + 1;

  // Build row data
  const newRow: any[] = new Array(Math.max(iLot, iBin, iTitle, iStatus, iBuyer) + 1).fill("");
  if (iLot >= 0) newRow[iLot] = lotId;
  if (iBin >= 0) newRow[iBin] = binId;
  if (iTitle >= 0 && title) newRow[iTitle] = title;
  if (iStatus >= 0 && status) newRow[iStatus] = status;
  if (iBuyer >= 0 && buyer) newRow[iBuyer] = buyer;

  // Append new row
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${LOTS_TAB}!A${nextRow}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [newRow],
    },
  });

  // TODO: Create Drive folder and QR code (later)
  // For now, just return success

  return NextResponse.json({ success: true, lotId, binId });
}

