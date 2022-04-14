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
  const botFights = db.getBotFights(botId)

  const botFightWins = botFights.filter((bf) => bf.winnerId === botId)
  const koWins = botFightWins.filter((bf) => bf.ko)

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
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <h3>Fights</h3>
        <div style={{display: "flex", alignItems: "center"}}>
          <div style={{marginRight: 32}}>Total: {botFights.length}</div>
          <div style={{marginRight: 32}}>Wins: {botFightWins.length}</div>
          <div>KO's: {koWins.length}</div>
        </div>
      </div>
      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th>Season</th>
            <th style={{width: 400}}>Against</th>
            <th style={{textAlign: "center"}}>Win</th>
            <th>Stage</th>
          </tr>
        </thead>
        <tbody>
          {botFights.map((bf, i) => {
            return (
              <tr key={i}>
                <td>
                  <Link
                    style={{color: "#003366"}}
                    to={`/season/${bf.seasonId}`}
                  >
                    {bf.seasonName}
                  </Link>
                </td>
                <td>
                  {bf.against.map((c, i) => {
                    const isLastCompetitor = i + 1 === bf.against.length

                    return (
                      <React.Fragment key={i}>
                        <Link style={{color: "#003366"}} to={`/bot/${c.id}`}>
                          {c.name}
                        </Link>
                        {isLastCompetitor ? "" : ", "}
                      </React.Fragment>
                    )
                  })}
                </td>
                <td style={{textAlign: "center"}}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {bf.winnerId === botId ? (
                      <>
                        <img src="tick.svg" style={{height: 24}} />
                        {bf.ko && <span>KO</span>}
                      </>
                    ) : (
                      <img src="cross.svg" style={{height: 24}} />
                    )}
                  </div>
                </td>
                <td>{stageNameMap[bf.stageName]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
