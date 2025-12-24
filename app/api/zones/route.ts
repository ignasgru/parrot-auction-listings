import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sheetsClient } from "@/lib/google";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const TAB_NAME = "ZONE_LAYOUT";

export async function GET() {
  const session = await auth();
  if (!session || !(session as any).accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = (session as any).accessToken as string;
  const sheets = sheetsClient(accessToken);

  // Read entire ZONE_LAYOUT
  const range = `${TAB_NAME}!A:F`;

  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range,
  });

  const values = resp.data.values || [];
  if (values.length < 2) {
    return NextResponse.json({
      warehouse: { w: 75, h: 50 },
      zones: [],
    });
  }

  const header = values[0].map((h) => String(h || "").trim());
  const idx = (name: string) => header.indexOf(name);

  const iZone = idx("ZoneID");
  const iX = idx("X");
  const iY = idx("Y");
  const iW = idx("Width");
  const iH = idx("Height");
  const iActive = idx("Active");

  const zones = values.slice(1).flatMap((row) => {
    const zoneId = iZone >= 0 ? String(row[iZone] || "").trim() : "";
    if (!zoneId) return [];

    const activeRaw = iActive >= 0 ? String(row[iActive] ?? "TRUE").toUpperCase() : "TRUE";
    const active = activeRaw !== "FALSE";
    if (!active) return [];

    const x = iX >= 0 ? Number(row[iX] ?? 0) : 0;
    const y = iY >= 0 ? Number(row[iY] ?? 0) : 0;
    const w = iW >= 0 ? Number(row[iW] ?? 10) : 10;
    const h = iH >= 0 ? Number(row[iH] ?? 10) : 10;

    return [{ zoneId, x, y, w, h }];
  });

  return NextResponse.json({
    warehouse: { w: 75, h: 50 },
    zones,
  });
}

