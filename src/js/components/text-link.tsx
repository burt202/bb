import * as React from "react"
import {Link} from "react-router-dom"

interface Props {
  to: string
  text: string
}

export default function TextLink({to, text}: Props) {
  return (
    <Link
      style={{
        color: "#003366",
      }}
      to={to}
    >
      {text}
    </Link>
  )
}
