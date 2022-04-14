import * as React from "react"
import {useContext} from "react"
import {Link} from "react-router-dom"
import {DbContext} from ".."
import {DbInterface} from "../types"

export default function Home() {
  const db = useContext(DbContext) as DbInterface
  const seasons = db.getAllSeasons()

  return (
    <div style={{marginTop: 16}}>
      <h1 style={{margin: 0}}>Battlebots Database</h1>
      <p>Select a season:</p>
      <div style={{display: "flex"}}>
        {seasons.map((s, i) => (
          <Link
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ccc",
              width: 200,
              height: 200,
              fontSize: 48,
              marginRight: 20,
              color: "#003366",
            }}
            to={`/season/${s.id}`}
          >
            {s.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
