import * as React from "react"
import {Link} from "react-router-dom"
import {setTitle} from "../utils"

interface Props {
  to: string
  children: React.ReactNode
  pageTitle: string
  textLink?: boolean
}

export default function SiteLink({to, children, textLink, pageTitle}: Props) {
  const className = textLink ? "text-link" : ""

  return (
    <Link
      className={className}
      to={to}
      onClick={() => {
        setTitle(pageTitle)
      }}
    >
      {children}
    </Link>
  )
}
