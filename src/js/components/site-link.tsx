import * as React from "react"
import {Link} from "react-router-dom"
import {setTitleAndTrack} from "../utils"

interface Props {
  to: string
  children: React.ReactNode
  pageTitle: string
  textLink?: boolean
}

export default function SiteLink({to, children, textLink, pageTitle}: Props) {
  const style = textLink ? {color: "#003366"} : {}

  return (
    <Link
      style={style}
      to={to}
      onClick={() => {
        setTitleAndTrack(pageTitle)
      }}
    >
      {children}
    </Link>
  )
}
