import * as React from "react"
import {useContext} from "react"
import {Link} from "react-router-dom"
import {DbContext} from ".."
import {DbInterface} from "../types"

export default function Home() {
  const db = useContext(DbContext) as DbInterface
  const seasons = db.getAllSeasons()

  const top10MostWins = db.getTop10MostWins()
  const top10MostKOs = db.getTop10MostKOs()

  // TODO most losses, win%, ko%

  return (
    <div style={{marginTop: 16}}>
      <h1 style={{margin: 0}}>Battlebots Database</h1>
      <h3>Seasons</h3>
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
    </div>
  )
}
