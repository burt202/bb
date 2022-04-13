import * as React from "react"
import {useContext} from "react"
import {useParams, Link} from "react-router-dom"
import {DbInterface} from "./types"
import {DbContext} from "."

export default function Season() {
  const {seasonId} = useParams()
  const db = useContext(DbContext) as DbInterface

  const season = db.getSeasonById(seasonId as string)

  if (!season) {
    return (
      <div>
        <h1>season not found</h1>
        <Link to="/">Back</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>season {season.name}</h1>
      <Link to="/">Back</Link>
    </div>
  )
}
