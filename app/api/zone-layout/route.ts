import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sheetsClient } from "@/lib/google";

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const TAB = "ZONE_LAYOUT";

type Zone = { zoneId: string; x: number; y: number; w: number; h: number; active?: boolean };

function num(v: unknown, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export async function GET() {
  const session = await auth();
  const accessToken = (session as { accessToken?: string })?.accessToken;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sheets = sheetsClient(accessToken);
  const range = `${TAB}!A:F`;

  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range,
  });

  const values = resp.data.values || [];
  if (values.length < 2) {
    return NextResponse.json({ warehouse: { w: 75, h: 50 }, zones: [] });
  }

  const header = values[0].map((h) => String(h || "").trim());
  const idx = (name: string) => header.indexOf(name);

  const iZone = idx("ZoneID");
  const iX = idx("X");
  const iY = idx("Y");
  const iW = idx("Width");
  const iH = idx("Height");
  const iActive = idx("Active");

  const zones: Zone[] = values.slice(1).flatMap((row) => {
    const zoneId = iZone >= 0 ? String(row[iZone] || "").trim() : "";
    if (!zoneId) return [];

    const activeRaw = iActive >= 0 ? String(row[iActive] ?? "TRUE").toUpperCase() : "TRUE";
    const active = activeRaw !== "FALSE";
    if (!active) return []; // dashboard hides inactive

    return [{
      zoneId,
      x: iX >= 0 ? num(row[iX], 0) : 0,
      y: iY >= 0 ? num(row[iY], 0) : 0,
      w: iW >= 0 ? num(row[iW], 10) : 10,
      h: iH >= 0 ? num(row[iH], 10) : 10,
      active: true
    }];
  });

  return NextResponse.json({ warehouse: { w: 75, h: 50 }, zones });
}

export async function POST(req: Request) {
  const session = await auth();
  const accessToken = (session as { accessToken?: string })?.accessToken;
  if (!accessToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null) as { zones?: Zone[] } | null;
  const zones = body?.zones ?? [];
  if (!Array.isArray(zones)) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  // sanitize + clamp to warehouse bounds (75x50)
  const W = 75, H = 50;
  const clean = zones
    .map(z => ({
      zoneId: String(z.zoneId || "").trim(),
      x: Math.max(0, Math.min(W, num(z.x, 0))),
      y: Math.max(0, Math.min(H, num(z.y, 0))),
      w: Math.max(1, Math.min(W, num(z.w, 10))),
      h: Math.max(1, Math.min(H, num(z.h, 10))),
      active: z.active !== false
    }))
    .filter(z => z.zoneId.length > 0)
    .map(z => [z.zoneId, String(z.x), String(z.y), String(z.w), String(z.h), z.active ? "TRUE" : "FALSE"]);

  const sheets = sheetsClient(accessToken);

  // 1) Ensure header exists
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A1:F1`,
    valueInputOption: "RAW",
    requestBody: { values: [["ZoneID", "X", "Y", "Width", "Height", "Active"]] },
  });

  // 2) Clear existing rows A2:F
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SHEET_ID,
    range: `${TAB}!A2:F`,
  });

  // 3) Write new rows
  if (clean.length > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!A2:F${clean.length + 1}`,
      valueInputOption: "RAW",
      requestBody: { values: clean },
    });
  }

  return NextResponse.json({ ok: true, count: clean.length });
}
