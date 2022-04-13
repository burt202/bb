import * as React from "react"
import {useContext} from "react"
import {useParams, Link} from "react-router-dom"
import NotFound from "./not-found"
import {DbInterface} from "./types"
import {DbContext} from "."

export default function Season() {
  const params = useParams()
  const seasonId = params.seasonId as string
  const db = useContext(DbContext) as DbInterface

  const season = db.getSeasonById(seasonId)

  if (!season) {
    return <NotFound title="Season Not Found" />
  }

  const seasonBots = db.getSeasonBots(seasonId)

  return (
    <div>
      <h1>Season {season.name}</h1>
      <Link to="/">Back</Link>
      <p>Competitors</p>
      <table>
        <thead>
          <tr>
            <td>Bot</td>
            <td>Stage</td>
          </tr>
        </thead>
        <tbody>
          {seasonBots.map((sb, i) => {
            return (
              <tr key={i}>
                <td>{sb.botName}</td>
                <td>{sb.stageName}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
