import * as React from "react"
import {useContext} from "react"
import {Link, useParams} from "react-router-dom"
import {DbContext} from ".."
import Page from "../components/page"
import {DbInterface} from "../types"
import {countryNameMap, getPercentage, stageNameMap} from "../utils"
import NotFound from "./not-found"

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
    <Page
      headerComponent={
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link to={`/country/${bot.country.toLowerCase()}`}>
              <img
                src={`${bot.country.toLowerCase()}.svg`}
                style={{height: 48, marginRight: 16}}
                title={countryNameMap[bot.country.toLowerCase()]}
              />
            </Link>
            <h1 style={{margin: 0}}>{bot.name}</h1>
          </div>
        </>
      }
      showShowHome={true}
    >
      <h3>Seasons</h3>
      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th>Season</th>
            <th>Stage</th>
            <th style={{width: 400}}>Key Members</th>
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
                <td>
                  {bs.members.map((m, i) => {
                    const isLastMember = i + 1 === bs.members.length

                    return (
                      <React.Fragment key={i}>
                        <Link style={{color: "#003366"}} to={`/member/${m.id}`}>
                          {m.name}
                        </Link>
                        {isLastMember ? "" : ", "}
                      </React.Fragment>
                    )
                  })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <h3>Fights</h3>
        <div style={{display: "flex", alignItems: "center"}}>
          <div style={{marginRight: 32}}>
            Total: <strong>{botFights.length}</strong>
          </div>
          <div style={{marginRight: 32}}>
            Wins: <strong>{botFightWins.length}</strong>
          </div>
          <div style={{marginRight: 32}}>
            KO's: <strong>{koWins.length}</strong>
          </div>
          <div style={{marginRight: 32}}>
            Win %:{" "}
            <strong>
              {getPercentage(botFights.length, botFightWins.length)}
            </strong>
          </div>
          <div>
            KO %:{" "}
            <strong>{getPercentage(botFights.length, koWins.length)}</strong>
          </div>
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
            const shouldShowDivider =
              botFights[i + 1] === undefined
                ? false
                : bf.seasonId !== botFights[i + 1].seasonId

            return (
              <tr
                key={i}
                style={{
                  borderBottom: shouldShowDivider ? "3px solid" : 1,
                }}
              >
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
                    const isLastBot = i + 1 === bf.against.length

                    return (
                      <React.Fragment key={i}>
                        <Link style={{color: "#003366"}} to={`/bot/${c.id}`}>
                          {c.name}
                        </Link>
                        {isLastBot ? "" : ", "}
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
    </Page>
  )
}
