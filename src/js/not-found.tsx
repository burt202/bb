import * as React from "react"
import {Link} from "react-router-dom"

export default function NotFound() {
  return (
    <div style={{textAlign: "center"}}>
      <h1>Page Not Found</h1>
      <Link to="/">
        <button
          style={{
            padding: "20px 50px",
            cursor: "pointer",
            color: "#fff",
            background: "#003366",
            border: 0,
            borderRadius: 15,
          }}
          type="button"
        >
          Back to home
        </button>
      </Link>
    </div>
  )
}