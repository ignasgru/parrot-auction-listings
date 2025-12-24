"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Line, Transformer } from "react-konva";
import type Konva from "konva";

type Zone = { zoneId: string; x: number; y: number; w: number; h: number; active?: boolean };
type MapData = { warehouse: { w: number; h: number }; zones: Zone[] };
type Bin = { binId: string; zone: string; status: string; position?: string; size?: string };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function binColor(status: string) {
  const s = (status || "").toUpperCase();
  if (s === "EMPTY") return "rgba(203,213,225,0.95)";
  if (s === "PHOTO_PROCESS") return "rgba(14,165,233,0.95)";
  if (s === "READY_FOR_ANALYSIS") return "rgba(245,158,11,0.95)";
  if (s === "READY_FOR_FLEX") return "rgba(168,85,247,0.95)";
  if (s === "DONE") return "rgba(100,116,139,0.95)";
  if (s === "BROKEN") return "rgba(185,28,28,0.95)";
  return "rgba(203,213,225,0.95)";
}

type Lot = { lotId: string; binId: string; title?: string; status?: string; buyer?: string; folderUrl?: string };

export default function MapPage() {
  const [data, setData] = useState<MapData | null>(null);
  const [bins, setBins] = useState<Bin[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [binLots, setBinLots] = useState<Lot[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 1ft -> px (you can change later)
  const pxPerFt = 20;
  const pad = 24;

  const transformerRef = useRef<Konva.Transformer>(null);
  const selectedShapeRef = useRef<Konva.Rect>(null);

  const stageSize = useMemo(() => {
    const w = data?.warehouse?.w ?? 75;
    const h = data?.warehouse?.h ?? 50;
    return {
      width: pad * 2 + w * pxPerFt,
      height: pad * 2 + h * pxPerFt,
    };
  }, [data]);

  const binsByZone = useMemo(() => {
    const m = new Map<string, Bin[]>();
    for (const b of bins) {
      if (!m.has(b.zone)) m.set(b.zone, []);
      m.get(b.zone)!.push(b);
    }
    return m;
  }, [bins]);

  const gridLines = useMemo(() => {
    if (!data?.warehouse) return [];
    const lines: React.ReactElement[] = [];
    const wPx = (data.warehouse.w ?? 75) * pxPerFt;
    const hPx = (data.warehouse.h ?? 50) * pxPerFt;

    for (let x = 0; x <= wPx; x += pxPerFt) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[pad + x, pad, pad + x, pad + hPx]}
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={1}
        />
      );
    }
    for (let y = 0; y <= hPx; y += pxPerFt) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[pad, pad + y, pad + wPx, pad + y]}
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={1}
        />
      );
    }
    return lines;
  }, [data]);

  async function load() {
    try {
      const r = await fetch("/api/zone-layout");
      if (!r.ok) {
        const t = await r.text();
        throw new Error(t || "Failed to load zones");
      }
      const j = await r.json();
      setData(j);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to load zones";
      alert("Map load failed:\n" + message);
    }
  }

  useEffect(() => {
    setMounted(true);
    (async () => {
      await load(); // your existing zone load
      const r = await fetch("/api/bins");
      if (r.ok) {
        const j = await r.json();
        setBins(j.bins || []);
      }
    })();
  }, []);


  // attach transformer to selected shape
  useEffect(() => {
    if (!mounted || !transformerRef.current) return;
    if (!selectedShapeRef.current) {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
      return;
    }
    transformerRef.current.nodes([selectedShapeRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selected, data, editMode, mounted]);

  function ftToPx(ft: number) {
    return ft * pxPerFt;
  }

  function pxToFt(px: number) {
    return px / pxPerFt;
  }

  function updateZone(zoneId: string, patch: Partial<Zone>) {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        zones: prev.zones.map((z) => (z.zoneId === zoneId ? { ...z, ...patch } : z)),
      };
    });
  }

  function addZone() {
    if (!data) return;
    let i = 1;
    let id = `NEW_ZONE_${i}`;
    while (data.zones.some((z) => z.zoneId === id)) {
      i++;
      id = `NEW_ZONE_${i}`;
    }
    const z: Zone = { zoneId: id, x: 0, y: 0, w: 10, h: 10, active: true };
    setData({ ...data, zones: [...data.zones, z] });
    setSelected(id);
    setEditMode(true);
  }

  async function save() {
    if (!data) return;
    setSaving(true);
    try {
      const r = await fetch("/api/zone-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zones: data.zones }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Save failed");
      await load();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Save failed";
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  const selectedZone = data?.zones.find((z) => z.zoneId === selected) || null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <div className="font-black tracking-[0.18em] text-xs text-slate-500 uppercase">
            Parrot Ops Map
          </div>

          <button
            className="px-3 py-2 rounded-full border bg-white font-semibold"
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? "Edit: ON" : "Edit: OFF"}
          </button>

          <button
            className="px-3 py-2 rounded-full border bg-white font-semibold"
            onClick={addZone}
          >
            + Zone
          </button>

          <button
            className="ml-auto px-3 py-2 rounded-full bg-slate-900 text-white font-semibold disabled:opacity-50"
            onClick={save}
            disabled={!editMode || saving}
          >
            {saving ? "Saving…" : "Save Layout"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        <div className="bg-white rounded-2xl border shadow-sm overflow-auto">
          {!mounted || !data ? (
            <div className="p-6 text-slate-500">Loading map…</div>
          ) : (
            <Stage
              width={stageSize.width}
              height={stageSize.height}
              onMouseDown={(e) => {
                // click empty space -> deselect
                if (e.target === e.target.getStage()) setSelected(null);
              }}
            >
              <Layer>
                {gridLines}

                {/* Warehouse boundary */}
                <Rect
                  x={pad}
                  y={pad}
                  width={(data.warehouse?.w ?? 75) * pxPerFt}
                  height={(data.warehouse?.h ?? 50) * pxPerFt}
                  stroke="rgba(2,6,23,0.25)"
                  strokeWidth={2}
                  cornerRadius={14}
                />

                {data.zones.map((z) => {
                  const isSel = selected === z.zoneId;
                  const xPx = pad + ftToPx(z.x);
                  const yPx = pad + ftToPx(z.y);
                  const wPx = ftToPx(z.w);
                  const hPx = ftToPx(z.h);

                  return (
                    <React.Fragment key={z.zoneId}>
                      <Rect
                        ref={(node) => {
                          if (isSel) selectedShapeRef.current = node;
                        }}
                        x={xPx}
                        y={yPx}
                        width={wPx}
                        height={hPx}
                        fill={isSel ? "rgba(34,197,94,0.14)" : "rgba(37,99,235,0.08)"}
                        stroke={isSel ? "rgba(34,197,94,0.85)" : "rgba(37,99,235,0.35)"}
                        strokeWidth={isSel ? 2 : 1}
                        cornerRadius={14}
                        onClick={(e) => {
                          // Don't select zone if clicking on a bin tile
                          const target = e.target as { name?: () => string };
                          if (target.name?.() === "bin-tile") {
                            return;
                          }
                          setSelected(z.zoneId);
                          setSelectedBin(null);
                        }}
                        draggable={editMode}
                        onDragEnd={(e) => {
                          const nx = pxToFt(e.target.x() - pad);
                          const ny = pxToFt(e.target.y() - pad);

                          // snap to 1ft
                          const sx = Math.round(nx);
                          const sy = Math.round(ny);

                          updateZone(z.zoneId, {
                            x: clamp(sx, 0, data.warehouse?.w ?? 75),
                            y: clamp(sy, 0, data.warehouse?.h ?? 50),
                          });
                        }}
                        onTransformEnd={(e) => {
                          const node = e.target;
                          const scaleX = node.scaleX();
                          const scaleY = node.scaleY();

                          // reset scale to avoid compounding
                          node.scaleX(1);
                          node.scaleY(1);

                          const newW = pxToFt(node.width() * scaleX);
                          const newH = pxToFt(node.height() * scaleY);

                          // snap to 1ft
                          const sw = Math.max(1, Math.round(newW));
                          const sh = Math.max(1, Math.round(newH));

                          updateZone(z.zoneId, {
                            w: clamp(sw, 1, data.warehouse?.w ?? 75),
                            h: clamp(sh, 1, data.warehouse?.h ?? 50),
                          });
                        }}
                      />
                      <Text
                        x={xPx + 10}
                        y={yPx + 8}
                        text={z.zoneId.toUpperCase()}
                        fontSize={12}
                        fontStyle="bold"
                        fill="rgba(2,6,23,0.85)"
                        letterSpacing={1}
                        listening={false}
                      />
                      {(() => {
                        const zoneBins = binsByZone.get(z.zoneId) || [];
                        if (!zoneBins.length) return null;

                        // inner padding
                        const padX = 10;
                        const padY = 28; // below label
                        const innerW = Math.max(0, wPx - padX * 2);
                        const innerH = Math.max(0, hPx - padY - 10);

                        const tile = 10;   // px
                        const gap = 4;     // px
                        const cols = Math.max(1, Math.floor((innerW + gap) / (tile + gap)));
                        const rows = Math.max(1, Math.floor((innerH + gap) / (tile + gap)));
                        const cap = cols * rows;

                        return zoneBins.slice(0, cap).map((b, i) => {
                          const cx = i % cols;
                          const cy = Math.floor(i / cols);
                          const bx = xPx + padX + cx * (tile + gap);
                          const by = yPx + padY + cy * (tile + gap);

                          return (
                            <Rect
                              key={`${z.zoneId}-${b.binId}`}
                              name="bin-tile"
                              x={bx}
                              y={by}
                              width={tile}
                              height={tile}
                              cornerRadius={3}
                              fill={binColor(b.status)}
                              stroke="rgba(0,0,0,0.08)"
                              strokeWidth={1}
                              onClick={() => {
                                setSelectedBin(b);
                                fetch(`/api/lots?bin=${encodeURIComponent(b.binId)}`)
                                  .then(r => r.json())
                                  .then(j => setBinLots(j.lots || []));
                              }}
                              onTap={() => {
                                setSelectedBin(b);
                                fetch(`/api/lots?bin=${encodeURIComponent(b.binId)}`)
                                  .then(r => r.json())
                                  .then(j => setBinLots(j.lots || []));
                              }}
                            />
                          );
                        });
                      })()}
                    </React.Fragment>
                  );
                })}

                {/* Transformer for resize */}
                {editMode && (
                  <Transformer
                    ref={transformerRef}
                    rotateEnabled={false}
                    enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
                    boundBoxFunc={(oldBox, newBox) => {
                      // prevent too small
                      if (newBox.width < pxPerFt || newBox.height < pxPerFt) return oldBox;
                      return newBox;
                    }}
                  />
                )}
              </Layer>
            </Stage>
          )}
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <div className="rounded-2xl border p-4">
            <div className="text-xs tracking-[0.18em] uppercase text-slate-500 font-black">
              Bin
            </div>
            <div className="mt-2 text-lg font-black">
              {selectedBin?.binId ?? "—"}
            </div>
            <div className="mt-1 text-sm text-slate-500">
              {selectedBin ? `Zone ${selectedBin.zone} • ${selectedBin.status || ""}` : "Click a bin tile to inspect."}
            </div>

            {selectedBin && (
              <div className="mt-3 flex flex-col gap-2">
                <button
                  className="px-3 py-2 rounded-full bg-blue-600 text-white font-semibold"
                  onClick={async () => {
                    const lotId = prompt("Enter Lot ID:");
                    if (!lotId) return;
                    const title = prompt("Enter title (optional):") || undefined;
                    const status = prompt("Enter status (optional):") || undefined;
                    const buyer = prompt("Enter buyer (optional):") || undefined;
                    
                    const r = await fetch("/api/lots/create", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ binId: selectedBin.binId, lotId, title, status, buyer }),
                    });
                    const j = await r.json();
                    if (!r.ok) return alert(j?.error || "Create failed");
                    // refresh lots list
                    const rr = await fetch(`/api/lots?bin=${encodeURIComponent(selectedBin.binId)}`);
                    const jj = await rr.json();
                    setBinLots(jj.lots || []);
                    alert(`Lot ${lotId} created in bin ${selectedBin.binId}`);
                  }}
                >
                  Create lot in this bin
                </button>
                <button
                  className="px-3 py-2 rounded-full bg-slate-900 text-white font-semibold"
                  onClick={async () => {
                    if (!confirm(`Clean bin ${selectedBin.binId}? This removes all lots from it.`)) return;
                    const r = await fetch("/api/bin/clean", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ binId: selectedBin.binId }),
                    });
                    const j = await r.json();
                    if (!r.ok) return alert(j?.error || "Clean failed");
                    // refresh lots list
                    const rr = await fetch(`/api/lots?bin=${encodeURIComponent(selectedBin.binId)}`);
                    const jj = await rr.json();
                    setBinLots(jj.lots || []);
                    alert(`Cleaned. Lots removed: ${j.cleaned}`);
                  }}
                >
                  Clean Bin
                </button>
              </div>
            )}

            <div className="mt-3">
              <div className="text-xs tracking-[0.18em] uppercase text-slate-500 font-black">
                Lots in bin
              </div>
              <div className="mt-2 space-y-2 max-h-[40vh] overflow-auto pr-1">
                {binLots.length === 0 ? (
                  <div className="text-sm text-slate-500">No lots in this bin.</div>
                ) : (
                  binLots.map(l => (
                    <div key={l.lotId} className="rounded-xl border p-3 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-bold">{l.lotId}</div>
                          <div className="text-sm text-slate-600">{l.title || ""}</div>
                          <div className="text-xs text-slate-500 mt-1">{l.status || ""} {l.buyer ? `• Buyer: ${l.buyer}` : ""}</div>
                        </div>
                        <button
                          className="ml-2 px-2 py-1 text-xs rounded border bg-white font-semibold hover:bg-slate-50"
                          onClick={async () => {
                            if (!selectedBin) return;
                            const targetBin = prompt(`Move lot ${l.lotId} to bin:`);
                            if (!targetBin) return;
                            const r = await fetch("/api/lots/move", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ lotId: l.lotId, targetBinId: targetBin }),
                            });
                            const j = await r.json();
                            if (!r.ok) return alert(j?.error || "Move failed");
                            // refresh lots list
                            const rr = await fetch(`/api/lots?bin=${encodeURIComponent(selectedBin.binId)}`);
                            const jj = await rr.json();
                            setBinLots(jj.lots || []);
                            // refresh bins to update colors
                            const binsR = await fetch("/api/bins");
                            if (binsR.ok) {
                              const binsJ = await binsR.json();
                              setBins(binsJ.bins || []);
                            }
                            alert(`Lot ${l.lotId} moved to bin ${targetBin}`);
                          }}
                        >
                          Move
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {!selectedBin && (
            <>
              <div className="text-xs tracking-[0.18em] uppercase text-slate-500 font-black">
                Zone Details
              </div>

              <div className="mt-2 text-lg font-black">
                {selectedZone?.zoneId ?? "—"}
              </div>

              <div className="mt-1 text-sm text-slate-500">
                {selectedZone
                  ? `${selectedZone.w}×${selectedZone.h} ft @ (${selectedZone.x}, ${selectedZone.y})`
                  : "Tap a zone to inspect."}
              </div>

              {selectedZone && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    className="px-3 py-2 rounded-full border bg-white font-semibold"
                    onClick={() => {
                      const nn = prompt("Rename zone to:", selectedZone.zoneId);
                      if (!nn) return;
                      updateZone(selectedZone.zoneId, { zoneId: nn });
                      setSelected(nn);
                    }}
                  >
                    Rename (local)
                  </button>

                  <button
                    className="px-3 py-2 rounded-full border bg-white font-semibold text-red-600"
                    onClick={() => {
                      if (!confirm(`Deactivate zone ${selectedZone.zoneId}?`)) return;
                      updateZone(selectedZone.zoneId, { active: false });
                      setSelected(null);
                    }}
                  >
                    Deactivate (local)
                  </button>
                </div>
              )}

              <div className="mt-4 text-xs text-slate-500">
                Note: Rename/Deactivate here are local until you press <b>Save Layout</b>.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
