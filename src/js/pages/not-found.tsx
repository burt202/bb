import * as React from "react"
import {useEffect} from "react"
import TextLink from "../components/text-link"

interface Props {
  title: string
}

export default function NotFound({title}: Props) {
  useEffect(() => {
    document.title = `Battlebots DB - ${title}`
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
        <TextLink to="/" text="Back to home" />
      </div>
    </div>
  )
}
