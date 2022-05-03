import * as React from "react"
import {useContext, useState} from "react"
import {DbContext} from ".."
import Page from "../components/page"
import SiteLink from "../components/site-link"
import Table from "../components/table"
import {DbInterface} from "../types"
import {round, SITE_NAME} from "../utils"

const STORAGE_KEY = "battlebots_db_stats_time_span"

export default function Home() {
  const [statsTimeSpan, setStatsTimeSpan] = useState(
    localStorage.getItem(STORAGE_KEY) ?? "allTime",
  )
  const db = useContext(DbContext) as DbInterface
  const seasons = db.getAllSeasons()

  const allTime = statsTimeSpan === "allTime"

  const top10MostWins = db.getTop10MostWins(allTime)
  const top10MostKOs = db.getTop10MostKOs(allTime)
  const top10BestWinPercentages = db.getTop10BestWinPercentages(allTime)
  const top10BestKOPercentages = db.getTop10BestKOPercentages(allTime)
  const mostMatchesPlayed = db.getMostMatchesPlayed()
  const totalBots = db.getTotalBots()
  const totalFights = db.getTotalFights()

  return (
    <Page headerComponent={<h1 style={{margin: 0}}>{SITE_NAME}</h1>}>
      <h3>Seasons</h3>
      <div className="seasons-grid">
        {seasons.map((s, i) => (
          <div style={{background: "#ccc", width: "100%", height: 135}} key={i}>
            <SiteLink
              to={`/season/${s.id}`}
              pageTitle={`Season - ${s.name}`}
              textLink={true}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 135,
                  fontSize: 48,
                }}
              >
                {s.name}
              </div>
            </SiteLink>
          </div>
        ))}
      </div>
      <select
        value={statsTimeSpan}
        onChange={(e) => {
          setStatsTimeSpan(e.target.value)
          localStorage.setItem(STORAGE_KEY, e.target.value)
        }}
        style={{
          marginTop: 16,
          padding: 8,
          backgroundColor: "#f5f5f5",
          border: "1px solid grey",
          borderRadius: 5,
        }}
      >
        <option value="allTime">All time</option>
        <option value="last3Seasons">Last 3 seasons</option>
      </select>
      <div className="stats-grid">
        <div>
          <h3>Top 10 Most Wins</h3>
          <Table
            data={top10MostWins}
            columns={[
              {
                title: "Bot",
                getValue: (tt) => {
                  return (
                    <SiteLink
                      to={`/bot/${tt.botId}`}
                      textLink={true}
                      pageTitle={`Bot - ${tt.botName}`}
                    >
                      {tt.botName}
                    </SiteLink>
                  )
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
                  return (
                    <SiteLink
                      to={`/bot/${tt.botId}`}
                      textLink={true}
                      pageTitle={`Bot - ${tt.botName}`}
                    >
                      {tt.botName}
                    </SiteLink>
                  )
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
                  return (
                    <SiteLink
                      to={`/bot/${tt.botId}`}
                      textLink={true}
                      pageTitle={`Bot - ${tt.botName}`}
                    >
                      {tt.botName}
                    </SiteLink>
                  )
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
                  return (
                    <SiteLink
                      to={`/bot/${tt.botId}`}
                      textLink={true}
                      pageTitle={`Bot - ${tt.botName}`}
                    >
                      {tt.botName}
                    </SiteLink>
                  )
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
        <SiteLink
          to={`/bot/${mostMatchesPlayed.id}`}
          textLink={true}
          pageTitle={`Bot - ${mostMatchesPlayed.name}`}
        >
          {mostMatchesPlayed.name}
        </SiteLink>
      </p>
      <p>Total bots: {totalBots}</p>
      <p>Total fights: {totalFights}</p>
    </Page>
  )
}
