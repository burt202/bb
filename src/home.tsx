import * as React from "react"
import {useContext} from "react"
import {Link} from "react-router-dom"
import {DbInterface} from "./types"
import {DbContext} from "."

export default function Home() {
  const db = useContext(DbContext) as DbInterface
  const seasons = db.getAllSeasons()

  return (
    <div>
      <ul>
        {seasons.map((s, i) => (
          <li key={i}>
            <Link to={`/season/${s.id}`}>{s.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
