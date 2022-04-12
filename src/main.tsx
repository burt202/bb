import * as React from "react"
import {DbInterface} from "./types"

interface Props {
  db: DbInterface
}

export default function Main({db}: Props) {
  console.log("seasons", db.getAllSeasons())

  return <div>hello bb world</div>
}
