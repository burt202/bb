import * as React from "react"
import {useContext} from "react"
import {useParams, Link} from "react-router-dom"
import NotFound from "./not-found"
import {DbInterface} from "./types"
import {stageNameMap} from "./utils"
import {DbContext} from "."

export default function Season() {
  const params = useParams()
  const seasonId = params.seasonId as string
  const db = useContext(DbContext) as DbInterface

  const season = db.getSeasonById(seasonId)

  if (!season) {
    return <NotFound title="Season Not Found" />
  }

  const seasons = db.getAllSeasons()
  const isFirstSeason = seasons[0].id === season.id
  const isLastSeason = seasons[seasons.length - 1].id === season.id
  const currentSeasonIndex = seasons.findIndex((s) => s.id === season.id)
  const nextSeason = !isLastSeason
    ? seasons[currentSeasonIndex + 1].id
    : undefined
  const previousSeason = !isFirstSeason
    ? seasons[currentSeasonIndex - 1].id
    : undefined

  const seasonBots = db.getSeasonBots(seasonId)

  return (
    <div style={{marginTop: 16}}>
      <div style={{display: "flex"}}>
        <h1 style={{margin: 0}}>Season {season.name}</h1>
        <div style={{display: "flex", alignItems: "center", marginLeft: 16}}>
          {previousSeason && <Link to={`/season/${previousSeason}`}>Prev</Link>}
          {nextSeason && <Link to={`/season/${nextSeason}`}>Next</Link>}
        </div>
      </div>
      <Link to="/">Back</Link>
      <h3>Competitors</h3>
      <table>
        <thead>
          <tr>
            <th>Bot</th>
            <th>Stage</th>
          </tr>
        </thead>
        <tbody>
          {seasonBots.map((sb, i) => {
            return (
              <tr key={i}>
                <td>{sb.botName}</td>
                <td>{stageNameMap[sb.stageName]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
