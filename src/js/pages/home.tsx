import * as React from "react"
import {useContext} from "react"
import {DbContext} from ".."
import Page from "../components/page"
import SiteLink from "../components/site-link"
import Table from "../components/table"
import {DbInterface} from "../types"
import {round} from "../utils"

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
    <Page headerComponent={<h1 style={{margin: 0}}>Battlebots Database</h1>}>
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
                  color: "#003366",
                }}
              >
                {s.name}
              </div>
            </SiteLink>
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
