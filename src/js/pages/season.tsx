import * as React from "react"
import {useContext} from "react"
import {PieChart} from "react-minimal-pie-chart"
import {useParams, Link} from "react-router-dom"
import {DbContext} from ".."
import Page from "../components/page"
import StatBox from "../components/stat-box"
import Table from "../components/table"
import TextLink from "../components/text-link"
import {DbInterface} from "../types"
import {countryNameMap, getPercentage, stageNameMap} from "../utils"
import NotFound from "./not-found"

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
    <Page
      headerComponent={
        <div style={{display: "flex"}}>
          <h1 style={{margin: 0}}>Season {season.name}</h1>
          <div style={{display: "flex", alignItems: "center", marginLeft: 16}}>
            {previousSeason ? (
              <span style={{marginRight: 16}}>
                <TextLink to={`/season/${previousSeason}`} text="Previous" />
              </span>
            ) : (
              <a
                style={{
                  cursor: "not-allowed",
                  marginRight: 16,
                  color: "#ccc",
                }}
              >
                Previous
              </a>
            )}
            {nextSeason ? (
              <TextLink to={`/season/${nextSeason}`} text="Next" />
            ) : (
              <a
                style={{
                  cursor: "not-allowed",
                  marginRight: 16,
                  color: "#ccc",
                }}
              >
                Next
              </a>
            )}
          </div>
        </div>
      }
      showShowHome={true}
    >
      <h3>Bots</h3>
      <div style={{display: "flex"}}>
        <Table
          data={seasonBots}
          columns={[
            {
              title: "",
              getValue: (sb) => {
                return (
                  <Link to={`/country/${sb.botCountry.toLowerCase()}`}>
                    <img
                      src={`${sb.botCountry.toLowerCase()}.svg`}
                      title={countryNameMap[sb.botCountry.toLowerCase()]}
                      style={{height: 24}}
                    />
                  </Link>
                )
              },
              width: 1,
              alignCenter: true,
            },
            {
              title: "Bot",
              getValue: (sb) => {
                return <TextLink to={`/bot/${sb.botId}`} text={sb.botName} />
              },
              width: 4,
            },
            {
              title: "Stage",
              getValue: (sb) => {
                return stageNameMap[sb.stageName]
              },
              width: 4,
            },
          ]}
        />
        <div style={{marginLeft: 16}}>
          <StatBox title="Total Bots" value={seasonBots.length.toString()} />
          <StatBox
            title="Total Fights"
            value={seasonFights.length.toString()}
          />
          <div style={{width: 400, marginTop: 32}}>
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
          </div>
        </div>
      </div>

      <h3>Fights</h3>
      <Table
        data={seasonFights}
        columns={[
          {
            title: "Bots",
            getValue: (sf) => {
              return sf.bots.map((c, i) => {
                const isLastBot = i + 1 === sf.bots.length

                return (
                  <React.Fragment key={i}>
                    <span
                      style={{
                        fontWeight:
                          sf.winnerName === c.name ? "bold" : "normal",
                      }}
                    >
                      <TextLink to={`/bot/${c.id}`} text={c.name} />
                    </span>
                    {isLastBot ? "" : " v "}
                  </React.Fragment>
                )
              })
            },
            width: 10,
          },
          {
            title: "Stage",
            getValue: (sf) => {
              return stageNameMap[sf.stageName]
            },
            width: 4,
          },
          {
            title: "KO",
            getValue: (sf) => {
              return sf.ko ? (
                <img src="tick.svg" style={{height: 24}} />
              ) : (
                <img src="cross.svg" style={{height: 24}} />
              )
            },
            width: 4,
            alignCenter: true,
          },
        ]}
      />
    </Page>
  )
}
