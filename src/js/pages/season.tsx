import * as React from "react"
import {useContext, useEffect} from "react"
import {useParams} from "react-router-dom"
import {DbContext} from ".."
import Page from "../components/page"
import SiteLink from "../components/site-link"
import StatBox from "../components/stat-box"
import Table from "../components/table"
import {DbInterface} from "../types"
import {countryNameMap, getPercentage, setTitle, stageNameMap} from "../utils"
import NotFound from "./not-found"

export default function Season() {
  const params = useParams()
  const seasonId = params.seasonId as string
  const db = useContext(DbContext) as DbInterface

  const season = db.getSeasonById(seasonId)

  useEffect(() => {
    if (season) {
      setTitle(`Season - ${season.name}`)
    }
  }, [])

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
    <Page headerComponent={<h1 style={{margin: 0}}>Season {season.name}</h1>}>
      <div style={{marginTop: 8}}>
        {previousSeason ? (
          <span style={{marginRight: 16}}>
            <SiteLink
              to={`/season/${previousSeason}`}
              textLink={true}
              pageTitle={`Season - ${previousSeason}`}
            >
              Previous
            </SiteLink>
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
          <SiteLink
            to={`/season/${nextSeason}`}
            textLink={true}
            pageTitle={`Season - ${nextSeason}`}
          >
            Next
          </SiteLink>
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
      <div className="side-by-side">
        <div>
          <h3>Bots</h3>
          <Table
            data={seasonBots}
            columns={[
              {
                title: "",
                getValue: (sb) => {
                  return (
                    <SiteLink
                      to={`/country/${sb.botCountry.toLowerCase()}`}
                      pageTitle={`Country - ${
                        countryNameMap[sb.botCountry.toLowerCase()]
                      }`}
                    >
                      <img
                        src={`${sb.botCountry.toLowerCase()}.svg`}
                        title={countryNameMap[sb.botCountry.toLowerCase()]}
                        style={{height: 24}}
                      />
                    </SiteLink>
                  )
                },
                width: 1,
                alignCenter: true,
              },
              {
                title: "Bot",
                getValue: (sb) => {
                  return (
                    <SiteLink
                      to={`/bot/${sb.botId}`}
                      textLink={true}
                      pageTitle={`Bot - ${sb.botName}`}
                    >
                      {sb.botName}
                    </SiteLink>
                  )
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
        </div>
        <div className="right-side-title-margin">
          <StatBox title="Total Bots" value={seasonBots.length.toString()} />
          <div style={{marginTop: 16}}>
            <StatBox
              title="Total Fights"
              value={seasonFights.length.toString()}
            />
          </div>
          <div style={{marginTop: 16}}>
            <StatBox
              title="KO Percentage"
              value={getPercentage(seasonFights.length, koFights.length)}
            />
          </div>
          <p className="season-pwt-link">
            <SiteLink
              to={`/primary-weapon-types?season=${season.id}`}
              textLink={true}
              pageTitle="Primary Weapon Types"
            >
              Primary Weapon Stats
            </SiteLink>
          </p>
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
                      <SiteLink
                        to={`/bot/${c.id}`}
                        textLink={true}
                        pageTitle={`Bot - ${c.name}`}
                      >
                        {c.name}
                      </SiteLink>
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
