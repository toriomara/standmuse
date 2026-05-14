import { ImageResponse } from "next/og"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "StandMuse — Акустические стойки на заказ"

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
          gap: 0,
        }}
      >
        {/* Accent line */}
        <div style={{ width: 64, height: 3, background: "#d4a853", borderRadius: 2, marginBottom: 40 }} />

        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: "#f5f0e8",
            letterSpacing: "-3px",
            lineHeight: 1,
          }}
        >
          StandMuse
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#9ca3af",
            marginTop: 20,
            fontWeight: 400,
            letterSpacing: "0.5px",
          }}
        >
          Акустические стойки ручной работы на заказ
        </div>

        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 48,
            fontSize: 18,
            color: "#6b7280",
          }}
        >
          <span>Массив дерева</span>
          <span style={{ color: "#d4a853" }}>·</span>
          <span>Металл</span>
          <span style={{ color: "#d4a853" }}>·</span>
          <span>14 дней</span>
          <span style={{ color: "#d4a853" }}>·</span>
          <span>Доставка по России</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
