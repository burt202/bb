import * as React from "react"
import {Link} from "react-router-dom"

interface Props {
  to: string
  text: string
  onClick?: () => void
}

export default function TextLink({to, text, onClick}: Props) {
  return (
    <Link
      style={{
        color: "#003366",
      }}
      to={to}
      onClick={() => {
        if (onClick) {
          onClick()
        }
      }}
    >
      {text}
    </Link>
  )
}
