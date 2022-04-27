import * as React from "react"
import {Link} from "react-router-dom"

interface Props {
  title: string
}

export default function NotFound({title}: Props) {
  return (
    <div style={{display: "flex", justifyContent: "center"}}>
      <div
        style={{
          textAlign: "center",
          border: "1px solid #000",
          marginTop: 32,
          width: 400,
          padding: 32,
        }}
      >
        <h1 style={{marginTop: 0}}>{title}</h1>
        <Link style={{color: "#003366"}} to="/">
          Back to home
        </Link>
      </div>
    </div>
  )
}
