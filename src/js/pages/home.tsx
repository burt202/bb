import * as React from "react"
import {useContext, useEffect} from "react"
import {Link} from "react-router-dom"
import {DbContext} from ".."
import Page from "../components/page"
import Table from "../components/table"
import TextLink from "../components/text-link"
import {DbInterface} from "../types"
import {round} from "../utils"

export default function Home() {
  const db = useContext(DbContext) as DbInterface
  const seasons = db.getAllSeasons()

  useEffect(() => {
    document.title = "Battlebots DB - Home"
  }, [])

  const top10MostWins = db.getTop10MostWins()
  const top10MostKOs = db.getTop10MostKOs()
  const top10BestWinPercentages = db.getTop10BestWinPercentages()
  const top10BestKOPercentages = db.getTop10BestKOPercentages()
  const mostMatchesPlayed = db.getMostMatchesPlayed()
  const totalBots = db.getTotalBots()
  const totalFights = db.getTotalFights()

  return (
    <Page headerComponent={<h1 style={{margin: 0}}>Battlebots Database</h1>}>
      <h3>Seasons</h3>
      <div className="seasons-grid">
        {seasons.map((s, i) => (
          <div style={{background: "#ccc", width: "100%", height: 135}} key={i}>
            <Link
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 135,
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
      <div className="stats-grid">
        <div>
          <h3>Top 10 Most Wins</h3>
          <Table
            data={top10MostWins}
            columns={[
              {
                title: "Bot",
                getValue: (tt) => {
                  return <TextLink to={`/bot/${tt.botId}`} text={tt.botName} />
                },
                width: 5,
              },
              {
                title: "Count",
                getValue: (tt) => {
                  return tt.count
                },
                width: 4,
              },
            ]}
          />
        </div>
        <div>
          <h3>Top 10 Most KOs</h3>
          <Table
            data={top10MostKOs}
            columns={[
              {
                title: "Bot",
                getValue: (tt) => {
                  return <TextLink to={`/bot/${tt.botId}`} text={tt.botName} />
                },
                width: 5,
              },
              {
                title: "Count",
                getValue: (tt) => {
                  return tt.count
                },
                width: 4,
              },
            ]}
          />
        </div>
        <div>
          <h3>Top 10 Best Win % (more than 5 fights)</h3>
          <Table
            data={top10BestWinPercentages}
            columns={[
              {
                title: "Bot",
                getValue: (tt) => {
                  return <TextLink to={`/bot/${tt.botId}`} text={tt.botName} />
                },
                width: 5,
              },
              {
                title: "%",
                getValue: (tt) => {
                  return `${round(0, tt.count * 100)}%`
                },
                width: 4,
              },
            ]}
          />
        </div>
        <div>
          <h3>Top 10 Best KO % (more than 5 fights)</h3>
          <Table
            data={top10BestKOPercentages}
            columns={[
              {
                title: "Bot",
                getValue: (tt) => {
                  return <TextLink to={`/bot/${tt.botId}`} text={tt.botName} />
                },
                width: 5,
              },
              {
                title: "%",
                getValue: (tt) => {
                  return `${round(0, tt.count * 100)}%`
                },
                width: 4,
              },
            ]}
          />
        </div>
      </div>
      <p>
        Most matches played:{" "}
        <TextLink
          to={`/bot/${mostMatchesPlayed.id}`}
          text={mostMatchesPlayed.name}
        />
      </p>
      <p>Total bots: {totalBots}</p>
      <p>Total fights: {totalFights}</p>
    </Page>
  )
}
