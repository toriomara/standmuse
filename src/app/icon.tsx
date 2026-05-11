import { ImageResponse } from "next/og"

export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563eb",
          borderRadius: 8,
        }}
      >
        <svg width="26" height="21" viewBox="0 0 40 32" fill="none">
          <path
            d="M2 16 C4 10, 6 6, 8 16 C10 26, 12 28, 14 16 C16 4, 18 2, 20 16 C22 30, 24 30, 26 16 C28 2, 30 4, 32 16 C34 28, 36 26, 38 16"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  )
}
