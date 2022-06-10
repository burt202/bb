import * as querystring from "query-string"
import * as React from "react"
import {useContext, useEffect, useState} from "react"
import {useLocation, useParams} from "react-router-dom"

import {DbContext} from ".."
import Page from "../components/page"
import SiteLink from "../components/site-link"
import StatBox from "../components/stat-box"
import Table from "../components/table"
import {DbCompetition, DbInterface, DbSeason} from "../types"
import {countryNameMap, getPercentage, setTitle, stageNameMap} from "../utils"
import NotFound from "./not-found"

function updateUrlParams(competition: string) {
  const params = {} as Record<string, string>

  params.competition = competition

  if (Object.keys(params).length === 0) {
    history.replaceState(null, "", window.location.hash.split("?")[0])
  }

  const queryParams = querystring.stringify(params)

  history.replaceState(
    null,
    "",
    window.location.hash.split("?")[0] + "?" + queryParams.toString(),
  )
}

export default function SeasonOuter() {
  const params = useParams()
  const location = useLocation()
  const seasonId = params.seasonId as string

  const db = useContext(DbContext) as DbInterface

  const season = db.getSeasonById(seasonId)

  useEffect(() => {
    if (season) {
      setTitle(`Season - ${season.year}`)
    }
  }, [])

  if (!season) {
    return <NotFound title="Season Not Found" />
  }

  const competitions = db.getCompetitionsForSeason(season.id)

  const parsed = querystring.parse(location.search.split("?")[1] || "")

  const match = competitions.find(
    (c) => c.name === (parsed.competition ?? competitions[0].name),
  )

  if (!match) {
    return <NotFound title="Competition Not Found" />
  }

  return (
    <Season season={season} competition={match} competitions={competitions} />
  )
}

interface Props {
  season: DbSeason
  competitions: Array<DbCompetition>
  competition: DbCompetition
}

function Season({season, competitions, competition}: Props) {
  const [selectedCompetition, setSelectedCompetition] = useState(competition)

  useEffect(() => {
    setSelectedCompetition(competition)
  }, [competition])

  const db = useContext(DbContext) as DbInterface

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

  const seasonBots = db.getCompetitionBots(selectedCompetition.id)
  const seasonFights = db.getCompetitionFights(selectedCompetition.id)

  const koFights = seasonFights.filter((f) => f.ko)

  return (
    <Page headerComponent={<h1 className="m-0">Season {season.year}</h1>}>
      <div className="mt-s">
        {previousSeason ? (
          <span className="mr-m">
            <SiteLink
              to={`/season/${previousSeason}`}
              textLink={true}
              pageTitle={`Season - ${previousSeason}`}
            >
              Previous
            </SiteLink>
          </span>
        ) : (
          <a className="cursor-not-allowed mr-m text-grey">Previous</a>
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
          <a className="cursor-not-allowed mr-m text-grey">Next</a>
        )}
      </div>
      {competitions.length > 1 && (
        <div>
          Competitions:{" "}
          <select
            value={selectedCompetition.name}
            onChange={(e) => {
              const match = competitions.find((c) => c.name === e.target.value)

              if (match) {
                setSelectedCompetition(match)
                updateUrlParams(match.name)
              }
            }}
            className="mt-m mb-m p-s bg-input border-grey rounded"
          >
            {competitions.map((c) => {
              return (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              )
            })}
          </select>
        </div>
      )}
      <div className="flex gap-x-m flex-col-reverse l:flex-row">
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
                        className="h-[24px]"
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
        <div className="mt-m l:mt-[51px]">
          <StatBox title="Total Bots" value={seasonBots.length.toString()} />
          <div className="mt-m">
            <StatBox
              title="Total Fights"
              value={seasonFights.length.toString()}
            />
          </div>
          <div className="mt-m">
            <StatBox
              title="KO Percentage"
              value={getPercentage(seasonFights.length, koFights.length)}
            />
          </div>
          <p className="text-left l:text-right">
            <SiteLink
              to={`/primary-weapon-types?season=${season.id}`}
              textLink={true}
              pageTitle="Primary Weapon Types"
            >
              {season.year} Primary Weapon Stats
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
                      className={
                        sf.winnerName === c.name ? "font-bold" : "font-normal"
                      }
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
                <img src="tick.svg" className="h-[24px]" />
              ) : (
                <img src="cross.svg" className="h-[24px]" />
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
