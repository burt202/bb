import * as React from "react"
import {useEffect} from "react"
import SiteLink from "../components/site-link"
import {setTitle} from "../utils"

interface Props {
  title: string
}

export default function NotFound({title}: Props) {
  useEffect(() => {
    setTitle(title)
  }, [])

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
        <SiteLink textLink={true} to="/" pageTitle="Home">
          Back to home
        </SiteLink>
      </div>
    </div>
  )
}
