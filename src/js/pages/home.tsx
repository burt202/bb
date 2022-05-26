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
    <Page headerComponent={<h1 className="m-0">{SITE_NAME}</h1>}>
      <h3>Seasons</h3>
      <div className="grid gap-m grid-cols-1 m:grid-cols-2 l:grid-cols-3">
        {seasons.map((s, i) => (
          <div className="bg-grey w-[100%] h-[135px]" key={i}>
            <SiteLink
              to={`/season/${s.id}`}
              pageTitle={`Season - ${s.year}`}
              textLink={true}
            >
              <div className="flex items-center justify-center h-[135px] text-5xl">
                {s.year}
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
        className="mt-m p-s bg-input border-grey rounded"
      >
        <option value="allTime">All time</option>
        <option value="last3Seasons">Last 3 seasons</option>
      </select>
      <div className="grid gap-m grid-cols-1 l:grid-cols-2">
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
      <div className="flex flex-col-reverse m:justify-between m:flex-row">
        <div>
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
        </div>
        <div>
          <p>
            <SiteLink
              to="/primary-weapon-types"
              textLink={true}
              pageTitle="Primary Weapon Types"
            >
              Primary Weapon Stats
            </SiteLink>
          </p>
        </div>
      </div>
    </Page>
  )
}
