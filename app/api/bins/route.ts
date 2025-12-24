import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sheetsClient } from "@/lib/google";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const TAB = "BINS";

type Bin = {
  binId: string;
  zone: string;
  status: string;
  position?: string;
  size?: string;
};

export async function GET() {
  const session = await auth();
  const accessToken = (session as any)?.accessToken as string | undefined;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sheets = sheetsClient(accessToken);
  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A:Z`,
  });

  const values = resp.data.values || [];
  if (values.length < 2) return NextResponse.json({ bins: [] });

  const header = values[0].map((h) => String(h || "").trim());
  const idx = (name: string) => header.indexOf(name);

  const iBin = idx("BinID");
  const iZone = idx("Zone");
  const iStatus = idx("Status");
  const iPos = idx("Position");
  const iSize = idx("Size");

  const bins: Bin[] = values.slice(1).flatMap((row) => {
    const binId = iBin >= 0 ? String(row[iBin] || "").trim() : "";
    const zone = iZone >= 0 ? String(row[iZone] || "").trim() : "";
    if (!binId || !zone) return [];
    return [{
      binId,
      zone,
      status: iStatus >= 0 ? String(row[iStatus] || "").trim() : "",
      position: iPos >= 0 ? String(row[iPos] || "").trim() : "",
      size: iSize >= 0 ? String(row[iSize] || "").trim() : "",
    }];
  });

  return NextResponse.json({ bins });
}

