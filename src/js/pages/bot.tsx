import {prop, sortBy} from "ramda"
import * as React from "react"
import {useContext, useEffect} from "react"
import {useParams} from "react-router-dom"

import {DbContext} from ".."
import Page from "../components/page"
import SiteLink from "../components/site-link"
import Table from "../components/table"
import {DbInterface} from "../types"
import {
  countryNameMap,
  getPercentage,
  stageNameMap,
  setTitle,
  primaryWeaponTypeNameMap,
} from "../utils"
import NotFound from "./not-found"

export default function Bot() {
  const params = useParams()
  const botId = params.botId as string
  const db = useContext(DbContext) as DbInterface

  const bot = db.getBotById(botId)

  useEffect(() => {
    if (bot) {
      setTitle(`Bot - ${bot.name}`)
    }
  }, [])

  if (!bot) {
    return <NotFound title="Bot Not Found" />
  }

  const botSeasons = db.getBotSeasons(botId)
  const botCompetitions = db.getBotCompetitions(botId)
  const botFights = db.getBotFights(botId)

  const botFightWins = botFights.filter((bf) => bf.winnerId === botId)
  const koWins = botFightWins.filter((bf) => bf.ko)

  return (
    <Page
      headerComponent={
        <>
          <div className="flex justify-between items-center">
            <SiteLink
              to={`/country/${bot.country.toLowerCase()}`}
              pageTitle={`Country - ${
                countryNameMap[bot.country.toLowerCase()]
              }`}
            >
              <img
                src={`${bot.country.toLowerCase()}.svg`}
                className="h-[48px] mr-s"
                title={countryNameMap[bot.country.toLowerCase()]}
              />
            </SiteLink>
            <h1 className="m-0">{bot.name}</h1>
          </div>
        </>
      }
    >
      <h3>Seasons</h3>
      <Table
        data={botSeasons}
        columns={[
          {
            title: "Season",
            getValue: (bs) => {
              return (
                <SiteLink
                  to={`/season/${bs.seasonId}`}
                  textLink={true}
                  pageTitle={`Season - ${bs.seasonYear}`}
                >
                  {bs.seasonYear} (S{bs.seasonNumber})
                </SiteLink>
              )
            },
            width: 3,
          },
          {
            title: "Key Members",
            getValue: (bs) => {
              return sortBy(prop("ordinal"), bs.members).map((m, i) => {
                const isLastMember = i + 1 === bs.members.length

                return (
                  <React.Fragment key={i}>
                    <SiteLink
                      to={`/member/${m.id}`}
                      textLink={true}
                      pageTitle={`Member - ${m.name}`}
                    >
                      {m.name}
                    </SiteLink>
                    {isLastMember ? "" : ", "}
                  </React.Fragment>
                )
              })
            },
            width: 9,
          },
          {
            title: "Wins",
            getValue: (bs) => {
              return bs.wins
            },
            width: 2,
          },
          {
            title: "Primary Weapon Type",
            getValue: (bs) => {
              return (
                <SiteLink
                  to={`/primary-weapon-types?primaryWeaponType=${bs.primaryWeaponType}&season=${bs.seasonId}`}
                  textLink={true}
                  pageTitle="Primary Weapon Types"
                >
                  {primaryWeaponTypeNameMap[bs.primaryWeaponType]}
                </SiteLink>
              )
            },
            width: 4,
          },
        ]}
      />
      <h3>Competitions Entered</h3>
      <Table
        data={botCompetitions}
        columns={[
          {
            title: "Name",
            getValue: (bc) => {
              return (
                <SiteLink
                  to={`/season/${bc.seasonId}?competition=${bc.competitionName}`}
                  pageTitle={`Season - ${bc.seasonYear} (S${bc.seasonNumber}) - ${bc.competitionName}`}
                  textLink={true}
                >
                  {bc.competitionName}
                </SiteLink>
              )
            },
            width: 6,
          },
          {
            title: "Season",
            getValue: (bc) => {
              return (
                <SiteLink
                  to={`/season/${bc.seasonId}`}
                  textLink={true}
                  pageTitle={`Season - ${bc.seasonYear}`}
                >
                  {bc.seasonYear} (S{bc.seasonNumber})
                </SiteLink>
              )
            },
            width: 6,
          },
          {
            title: "Stage",
            getValue: (bc) => {
              return stageNameMap[bc.stageName]
            },
            width: 6,
          },
        ]}
      />
      <div className="flex flex-col mb-m m:justify-between m:flex-row m:mb-0">
        <h3>Fights</h3>
        <div className="flex items-center">
          <div className="mr-l">
            Total: <strong>{botFights.length}</strong>
          </div>
          <div className="mr-l">
            Wins:{" "}
            <strong>
              {botFightWins.length} (
              {getPercentage(botFights.length, botFightWins.length)})
            </strong>
          </div>
          <div>
            KO's:{" "}
            <strong>
              {koWins.length} ({getPercentage(botFights.length, koWins.length)})
            </strong>
          </div>
        </div>
      </div>
      <Table
        data={botFights}
        shouldShowDivider={(data, row, i) => {
          return data[i + 1] === undefined
            ? false
            : row.seasonId !== data[i + 1].seasonId ||
                row.competitionId !== data[i + 1].competitionId
        }}
        columns={[
          {
            title: "Competition / Season",
            getValue: (bf) => {
              return (
                <>
                  <SiteLink
                    to={`/season/${bf.seasonId}?competition=${bf.competitionName}`}
                    pageTitle={`Season - ${bf.seasonYear} (S${bf.seasonNumber}) - ${bf.competitionName}`}
                    textLink={true}
                  >
                    {bf.competitionName}
                  </SiteLink>
                  {" / "}
                  <SiteLink
                    to={`/season/${bf.seasonId}`}
                    pageTitle={`Season - ${bf.seasonYear} (S${bf.seasonNumber})`}
                    textLink={true}
                  >
                    {bf.seasonYear} (S{bf.seasonNumber})
                  </SiteLink>
                </>
              )
            },
            width: 5,
          },
          {
            title: "Against",
            getValue: (bf) => {
              return bf.against.map((c, i) => {
                const isLastBot = i + 1 === bf.against.length

                return (
                  <React.Fragment key={i}>
                    <SiteLink
                      to={`/bot/${c.id}`}
                      textLink={true}
                      pageTitle={`Bot - ${c.name}`}
                    >
                      {c.name}
                    </SiteLink>
                    {isLastBot ? "" : ", "}
                  </React.Fragment>
                )
              })
            },
            width: 7,
          },
          {
            title: "Win",
            alignCenter: true,
            getValue: (bf) => {
              return (
                <div className="flex justify-center items-center">
                  {bf.winnerId === botId ? (
                    <>
                      <img src="tick.svg" className="h-[24px]" />
                      {bf.ko && <span>KO</span>}
                    </>
                  ) : (
                    <img src="cross.svg" className="h-[24px]" />
                  )}
                </div>
              )
            },
            width: 3,
          },
          {
            title: "Stage",
            getValue: (bf) => {
              return stageNameMap[bf.stageName]
            },
            width: 3,
          },
        ]}
      />
    </Page>
  )
}
