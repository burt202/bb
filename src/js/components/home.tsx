import * as React from "react"
import {useContext} from "react"
import {Link} from "react-router-dom"
import {DbContext} from ".."
import {DbInterface} from "../types"
import {round} from "../utils"
import Page from "./page"

export default function Home() {
  const db = useContext(DbContext) as DbInterface
  const seasons = db.getAllSeasons()

  const top10MostWins = db.getTop10MostWins()
  const top10MostKOs = db.getTop10MostKOs()
  const top10BestWinPercentages = db.getTop10BestWinPercentages()
  const top10BestKOPercentages = db.getTop10BestKOPercentages()
  const mostMatchesPlayed = db.getMostMatchesPlayed()
  const totalBots = db.getTotalBots()
  const totalFights = db.getTotalFights()

  return (
    <Page
      headerComponent={
        <div>
          <h1 style={{margin: 0}}>Battlebots Database</h1>
        </div>
      }
    >
      <h3>Seasons</h3>
      <div
        style={{display: "flex", flexWrap: "wrap", rowGap: 16, columnGap: 16}}
      >
        {seasons.map((s, i) => (
          <div>
            <Link
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ccc",
                width: 272,
                height: 150,
                fontSize: 48,
                color: "#003366",
              }}
              to={`/season/${s.id}`}
            >
              {s.name}
            </Link>
          </div>
        ))}
      </div>
      <div style={{display: "flex"}}>
        <div style={{marginRight: 32}}>
          <h3>Top 10 Most Wins</h3>
          <table>
            <thead>
              <tr>
                <th>Bot</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {top10MostWins.map((tt, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <Link style={{color: "#003366"}} to={`/bot/${tt.botId}`}>
                        {tt.botName}
                      </Link>
                    </td>
                    <td>{tt.count}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Top 10 Most KOs</h3>
          <table>
            <thead>
              <tr>
                <th>Bot</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {top10MostKOs.map((tt, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <Link style={{color: "#003366"}} to={`/bot/${tt.botId}`}>
                        {tt.botName}
                      </Link>
                    </td>
                    <td>{tt.count}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{display: "flex"}}>
        <div style={{marginRight: 32}}>
          <h3>Top 10 Best Win % (more than 3 fights)</h3>
          <table>
            <thead>
              <tr>
                <th>Bot</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {top10BestWinPercentages.map((tt, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <Link style={{color: "#003366"}} to={`/bot/${tt.botId}`}>
                        {tt.botName}
                      </Link>
                    </td>
                    <td>{`${round(0, tt.count * 100)}%`}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Top 10 Best KO % (more than 3 fights)</h3>
          <table>
            <thead>
              <tr>
                <th>Bot</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {top10BestKOPercentages.map((tt, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <Link style={{color: "#003366"}} to={`/bot/${tt.botId}`}>
                        {tt.botName}
                      </Link>
                    </td>
                    <td>{`${round(0, tt.count * 100)}%`}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p>
        Most matches played:{" "}
        <Link style={{color: "#003366"}} to={`/bot/${mostMatchesPlayed.id}`}>
          {mostMatchesPlayed.name}
        </Link>
      </p>
      <p>Total bots: {totalBots}</p>
      <p>Total fights: {totalFights}</p>
    </Page>
  )
}
