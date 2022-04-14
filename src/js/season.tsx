import * as React from "react"
import {useContext} from "react"
import {PieChart} from "react-minimal-pie-chart"
import {useParams, Link} from "react-router-dom"
import NotFound from "./not-found"
import {DbInterface} from "./types"
import {round, stageNameMap} from "./utils"
import {DbContext} from "."

function getPercentage(rawDataLength: number, portionLength: number) {
  return `${round(0, (portionLength / rawDataLength) * 100)}%`
}

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
  const seasonFights = db.getSeasonFights(seasonId)

  const koFights = seasonFights.filter((f) => f.ko)

  return (
    <div style={{marginTop: 16}}>
      <div style={{display: "flex"}}>
        <h1 style={{margin: 0}}>Season {season.name}</h1>
        <div style={{display: "flex", alignItems: "center", marginLeft: 16}}>
          {previousSeason && (
            <Link style={{color: "#003366"}} to={`/season/${previousSeason}`}>
              Previous
            </Link>
          )}
          {nextSeason && (
            <Link style={{color: "#003366"}} to={`/season/${nextSeason}`}>
              Next
            </Link>
          )}
        </div>
      </div>
      <Link style={{color: "#003366"}} to="/">
        Back
      </Link>
      <h3>Competitors</h3>
      <div style={{display: "flex"}}>
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
                  <td>
                    <Link style={{color: "#003366"}} to={`/bot/${sb.botId}`}>
                      {sb.botName}
                    </Link>
                  </td>
                  <td>{stageNameMap[sb.stageName]}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div style={{marginLeft: 16}}>
          <div
            style={{
              background: "#ccc",
              padding: 16,
              width: 380,
              textAlign: "right",
              marginBottom: 16,
            }}
          >
            <p style={{margin: 0, fontSize: 30, fontWeight: 400}}>
              Total Competitors
            </p>
            <p style={{margin: 0, fontSize: 60, fontWeight: 400}}>
              {seasonBots.length}
            </p>
          </div>
          <div
            style={{
              background: "#ccc",
              padding: 16,
              width: 380,
              textAlign: "right",
            }}
          >
            <p style={{margin: 0, fontSize: 30, fontWeight: 400}}>
              Total Fights
            </p>
            <p style={{margin: 0, fontSize: 60, fontWeight: 400}}>
              {seasonFights.length}
            </p>
          </div>
          <div style={{width: 380, marginTop: 32}}>
            <PieChart
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontSize: "8px",
              }}
              data={[
                {
                  title: getPercentage(seasonFights.length, koFights.length),
                  value: koFights.length,
                  label: "KO",
                  color: "#003366",
                },
                {
                  title: getPercentage(
                    seasonFights.length,
                    seasonFights.length - koFights.length,
                  ),
                  value: seasonFights.length - koFights.length,
                  label: "Judges",
                  color: "#C13C37",
                },
              ]}
              animate
              label={({dataEntry}) => {
                return dataEntry.label as string
              }}
              labelStyle={{
                fill: "#fff",
                opacity: 0.75,
                pointerEvents: "none",
              }}
            />
            ;
          </div>
        </div>
      </div>

      <h3>Fights</h3>
      <table style={{width: "100%"}}>
        <thead>
          <tr>
            <th style={{width: 400}}>Competitors</th>
            <th>Stage</th>
            <th style={{textAlign: "center"}}>KO</th>
          </tr>
        </thead>
        <tbody>
          {seasonFights.map((sf, i) => {
            return (
              <tr key={i}>
                <td>
                  {sf.competitors.map((c, i) => {
                    const isLastCompetitor = i + 1 === sf.competitors.length

                    return (
                      <React.Fragment key={i}>
                        <span
                          style={{
                            fontWeight:
                              sf.winnerName === c.name ? "bold" : "normal",
                          }}
                        >
                          <Link style={{color: "#003366"}} to={`/bot/${c.id}`}>
                            {c.name}
                          </Link>
                        </span>
                        {isLastCompetitor ? "" : " v "}
                      </React.Fragment>
                    )
                  })}
                </td>
                <td>{stageNameMap[sf.stageName]}</td>
                <td style={{textAlign: "center"}}>
                  {sf.ko ? (
                    <img src="tick.svg" style={{height: 24}} />
                  ) : (
                    <img src="cross.svg" style={{height: 24}} />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
