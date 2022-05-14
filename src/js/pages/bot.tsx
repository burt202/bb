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
  const botFights = db.getBotFights(botId)

  const botFightWins = botFights.filter((bf) => bf.winnerId === botId)
  const koWins = botFightWins.filter((bf) => bf.ko)

  return (
    <Page
      headerComponent={
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <SiteLink
              to={`/country/${bot.country.toLowerCase()}`}
              pageTitle={`Country - ${
                countryNameMap[bot.country.toLowerCase()]
              }`}
            >
              <img
                src={`${bot.country.toLowerCase()}.svg`}
                style={{height: 48, marginRight: 16}}
                title={countryNameMap[bot.country.toLowerCase()]}
              />
            </SiteLink>
            <h1 style={{margin: 0}}>{bot.name}</h1>
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
                  {bs.seasonYear}
                </SiteLink>
              )
            },
            width: 3,
          },
          {
            title: "Stage",
            getValue: (bs) => {
              return stageNameMap[bs.stageName]
            },
            width: 3,
          },
          {
            title: "Key Members",
            getValue: (bs) => {
              return bs.members.map((m, i) => {
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
            width: 8,
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
      <div className="bot-stats">
        <h3>Fights</h3>
        <div style={{display: "flex", alignItems: "center"}}>
          <div style={{marginRight: 32}}>
            Total: <strong>{botFights.length}</strong>
          </div>
          <div style={{marginRight: 32}}>
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
            : row.seasonId !== data[i + 1].seasonId
        }}
        columns={[
          {
            title: "Season",
            getValue: (bf) => {
              return (
                <SiteLink
                  to={`/season/${bf.seasonId}`}
                  pageTitle={`Season - ${bf.seasonYear}`}
                  textLink={true}
                >
                  {bf.seasonYear}
                </SiteLink>
              )
            },
            width: 3,
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
            width: 9,
          },
          {
            title: "Win",
            alignCenter: true,
            getValue: (bf) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {bf.winnerId === botId ? (
                    <>
                      <img src="tick.svg" style={{height: 24}} />
                      {bf.ko && <span>KO</span>}
                    </>
                  ) : (
                    <img src="cross.svg" style={{height: 24}} />
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
