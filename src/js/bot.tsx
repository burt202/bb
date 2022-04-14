import * as React from "react"
import {useContext} from "react"
import {Link, useParams} from "react-router-dom"
import NotFound from "./not-found"
import {DbInterface} from "./types"
import {stageNameMap} from "./utils"
import {DbContext} from "."

export default function Bot() {
  const params = useParams()
  const botId = params.botId as string
  const db = useContext(DbContext) as DbInterface

  const bot = db.getBotById(botId)

  if (!bot) {
    return <NotFound title="Bot Not Found" />
  }

  const botSeasons = db.getBotSeasons(botId)

  return (
    <div style={{marginTop: 16}}>
      <h1 style={{margin: 0}}>{bot.name}</h1>
      <h3>Seasons</h3>
      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th>Season</th>
            <th>Stage</th>
            <th style={{width: 400}}>Members</th>
          </tr>
        </thead>
        <tbody>
          {botSeasons.map((bs, i) => {
            return (
              <tr key={i}>
                <td>
                  <Link
                    style={{color: "#003366"}}
                    to={`/season/${bs.seasonId}`}
                  >
                    {bs.seasonName}
                  </Link>
                </td>
                <td>{stageNameMap[bs.stageName]}</td>
                <td>members-go-here</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      fight total ko pie chart list of fights
    </div>
  )
}
