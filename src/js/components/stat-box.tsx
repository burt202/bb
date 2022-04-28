import * as React from "react"

interface Props {
  title: string
  value: string
}

export default function StatBox({title, value}: Props) {
  return (
    <div
      style={{
        background: "#ccc",
        padding: 16,
        width: 380,
        textAlign: "right",
        marginBottom: 16,
      }}
    >
      <p style={{margin: 0, fontSize: 30, fontWeight: 400}}>{title}</p>
      <p style={{margin: 0, fontSize: 60, fontWeight: 400}}>{value}</p>
    </div>
  )
}
