import * as querystring from "query-string"
import * as React from "react"
import {useContext, useEffect, useState} from "react"

import {DbContext} from ".."
import Page from "../components/page"
import SiteLink from "../components/site-link"
import Table from "../components/table"
import {DbInterface} from "../types"
import {
  setTitle,
  primaryWeaponTypeNameMap,
  getPercentage,
  countryNameMap,
  stageNameMap,
} from "../utils"

function updateUrlParams(seasonId?: string, primaryWeaponTypeId?: string) {
  const params = {} as Record<string, string>

  if (seasonId && seasonId !== "all") {
    params.season = seasonId
  }

  if (primaryWeaponTypeId && primaryWeaponTypeId !== "all") {
    params.primaryWeaponType = primaryWeaponTypeId
  }

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

export default function PrimaryWeaponTypes() {
  const parsed = querystring.parse(window.location.hash.split("?")[1] || "")

  const [seasonId, setSeasonId] = useState(
    (parsed.season as string | undefined) ?? "all",
  )

  const [primaryWeaponTypeId, setPrimaryWeaponTypeId] = useState(
    (parsed.primaryWeaponType as string | undefined) ?? "all",
  )

  const db = useContext(DbContext) as DbInterface

  const seasons = db.getAllSeasons()
  const primaryWeaponTypes = db.getAllPrimaryWeapons()

  useEffect(() => {
    setTitle("Primary Weapon Types")
  }, [])

  const hasAllSeasonsSelected = !seasonId || seasonId === "all"
  const hasSpecificSeasonSelected = seasonId && seasonId !== "all"
  const hasAllPrimaryWeaponTypeSelected =
    !primaryWeaponTypeId || primaryWeaponTypeId === "all"
  const hasSpecificPrimaryWeaponTypeSelected =
    primaryWeaponTypeId && primaryWeaponTypeId !== "all"

  const seasonData =
    hasAllSeasonsSelected || hasSpecificSeasonSelected
      ? db.getPrimaryWeaponTypeWinCountBreakdown(
          seasonId === "all" ? undefined : seasonId,
        )
      : []

  const primaryWeaponTypeWins = hasSpecificPrimaryWeaponTypeSelected
    ? db.getPrimaryWeaponTypeWins(
        primaryWeaponTypeId,
        seasonId === "all" ? undefined : seasonId,
      )
    : []
  const koWins = primaryWeaponTypeWins.filter((pwtf) => pwtf.ko)

  const primaryWeaponTypeBots =
    hasSpecificSeasonSelected && hasSpecificPrimaryWeaponTypeSelected
      ? db.getPrimaryWeaponTypeBots(primaryWeaponTypeId, seasonId)
      : []

  return (
    <Page headerComponent={<h1 className="m-0">Primary Weapon Types</h1>}>
      <select
        value={seasonId}
        onChange={(e) => {
          setSeasonId(e.target.value)
          updateUrlParams(
            e.target.value === "all" ? undefined : e.target.value,
            primaryWeaponTypeId,
          )
        }}
        className="mt-m mb-m p-s bg-input border-grey rounded"
      >
        <option value="all">All seasons</option>
        {seasons.map((s) => {
          return (
            <option key={s.id} value={s.id}>
              {s.year} (S{s.number})
            </option>
          )
        })}
      </select>
      <select
        value={primaryWeaponTypeId}
        onChange={(e) => {
          setPrimaryWeaponTypeId(e.target.value)
          updateUrlParams(
            seasonId,
            e.target.value === "all" ? undefined : e.target.value,
          )
        }}
        className="mt-m mb-m ml-m p-s bg-input border-grey rounded"
      >
        <option value="all">All weapon types</option>
        {primaryWeaponTypes.map((pwt) => {
          return (
            <option key={pwt.id} value={pwt.id}>
              {primaryWeaponTypeNameMap[pwt.name]}
            </option>
          )
        })}
      </select>
      {hasAllSeasonsSelected && hasAllPrimaryWeaponTypeSelected && (
        <Table
          data={seasonData}
          columns={[
            {
              title: "Primary Weapon Type",
              getValue: (pwt) => {
                return (
                  <a
                    className="text-link cursor-pointer underline"
                    onClick={() => {
                      setPrimaryWeaponTypeId(pwt.id)
                      updateUrlParams(seasonId, pwt.id)
                    }}
                  >
                    {primaryWeaponTypeNameMap[pwt.name]}
                  </a>
                )
              },
              width: 5,
            },
            {
              title: "Wins",
              getValue: (pwt) => {
                return pwt.wins
              },
              width: 4,
            },
          ]}
        />
      )}
      {hasSpecificSeasonSelected && hasAllPrimaryWeaponTypeSelected && (
        <Table
          data={seasonData}
          columns={[
            {
              title: "Primary Weapon Type",
              getValue: (pwt) => {
                return (
                  <a
                    className="text-link cursor-pointer underline"
                    onClick={() => {
                      setPrimaryWeaponTypeId(pwt.id)
                      updateUrlParams(seasonId, pwt.id)
                    }}
                  >
                    {primaryWeaponTypeNameMap[pwt.name]}
                  </a>
                )
              },
              width: 5,
            },
            {
              title: "Wins",
              getValue: (pwt) => {
                return pwt.wins
              },
              width: 2,
            },
            {
              title: "Bot Count",
              getValue: (pwt) => {
                return pwt.botCount
              },
              width: 2,
            },
          ]}
        />
      )}
      {hasAllSeasonsSelected && hasSpecificPrimaryWeaponTypeSelected && (
        <>
          <div className="flex flex-col mb-m m:justify-between m:flex-row m:mb-0">
            <h3>Wins</h3>
            <div className="flex items-center">
              <div className="mr-l">
                Total: <strong>{primaryWeaponTypeWins.length}</strong>
              </div>
              <div>
                KO %:{" "}
                <strong>
                  {getPercentage(primaryWeaponTypeWins.length, koWins.length)}
                </strong>
              </div>
            </div>
          </div>
          <Table
            data={primaryWeaponTypeWins}
            shouldShowDivider={(data, row, i) => {
              return data[i + 1] === undefined
                ? false
                : row.seasonId !== data[i + 1].seasonId ||
                    row.competitionId !== data[i + 1].competitionId
            }}
            columns={[
              {
                title: "Bots",
                getValue: (pwtf) => {
                  return pwtf.bots.map((c, i) => {
                    const isLastBot = i + 1 === pwtf.bots.length

                    return (
                      <React.Fragment key={i}>
                        <span
                          className={
                            pwtf.winnerName === c.name
                              ? "font-bold"
                              : "font-normal"
                          }
                        >
                          <SiteLink
                            to={`/bot/${encodeURIComponent(c.id)}`}
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
                title: "Competition / Season",
                getValue: (pwtf) => {
                  return (
                    <>
                      <SiteLink
                        to={`/season/${pwtf.seasonId}?competition=${pwtf.competitionName}`}
                        pageTitle={`Season - ${pwtf.seasonYear} (S${pwtf.seasonNumber}) - ${pwtf.competitionName}`}
                        textLink={true}
                      >
                        {pwtf.competitionName}
                      </SiteLink>
                      {" / "}
                      <SiteLink
                        to={`/season/${pwtf.seasonId}`}
                        pageTitle={`Season - ${pwtf.seasonYear} (S${pwtf.seasonNumber})`}
                        textLink={true}
                      >
                        {pwtf.seasonYear} (S{pwtf.seasonNumber})
                      </SiteLink>
                    </>
                  )
                },
                width: 4,
              },
              {
                title: "KO",
                getValue: (pwtf) => {
                  return pwtf.ko ? (
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
        </>
      )}
      {hasSpecificSeasonSelected && hasSpecificPrimaryWeaponTypeSelected && (
        <>
          <div>
            <h3>Bots ({primaryWeaponTypeBots.length})</h3>
            <Table
              data={primaryWeaponTypeBots}
              columns={[
                {
                  title: "",
                  getValue: (pwtb) => {
                    return (
                      <SiteLink
                        to={`/country/${pwtb.botCountry.toLowerCase()}`}
                        pageTitle={`Country - ${
                          countryNameMap[pwtb.botCountry.toLowerCase()]
                        }`}
                      >
                        <img
                          src={`${pwtb.botCountry.toLowerCase()}.svg`}
                          title={countryNameMap[pwtb.botCountry.toLowerCase()]}
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
                  getValue: (pwtb) => {
                    return (
                      <SiteLink
                        to={`/bot/${encodeURIComponent(pwtb.botId)}`}
                        textLink={true}
                        pageTitle={`Bot - ${pwtb.botName}`}
                      >
                        {pwtb.botName}
                      </SiteLink>
                    )
                  },
                  width: 4,
                },
                {
                  title: "Competitions Entered",
                  getValue: (pwtb) => {
                    return pwtb.competitions.map((c, i) => {
                      const isLastCompetition =
                        i + 1 === pwtb.competitions.length

                      return (
                        <React.Fragment key={i}>
                          <SiteLink
                            to={`/season/${c.seasonId}?competition=${c.competitionName}`}
                            pageTitle={`Season - ${c.seasonYear} (S${c.seasonNumber}) - ${c.competitionName}`}
                            textLink={true}
                          >
                            {c.competitionName}
                          </SiteLink>
                          {isLastCompetition ? "" : ", "}
                        </React.Fragment>
                      )
                    })
                  },
                  width: 4,
                },
              ]}
            />
          </div>
          <div className="flex flex-col mb-m m:justify-between m:flex-row m:mb-0">
            <h3>Wins</h3>
            <div className="flex items-center">
              <div className="mr-l">
                Total: <strong>{primaryWeaponTypeWins.length}</strong>
              </div>
              <div>
                KO %:{" "}
                <strong>
                  {getPercentage(primaryWeaponTypeWins.length, koWins.length)}
                </strong>
              </div>
            </div>
          </div>
          <Table
            data={primaryWeaponTypeWins}
            columns={[
              {
                title: "Bots",
                getValue: (pwtf) => {
                  return pwtf.bots.map((c, i) => {
                    const isLastBot = i + 1 === pwtf.bots.length

                    return (
                      <React.Fragment key={i}>
                        <span
                          className={
                            pwtf.winnerName === c.name
                              ? "font-bold"
                              : "font-normal"
                          }
                        >
                          <SiteLink
                            to={`/bot/${encodeURIComponent(c.id)}`}
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
                title: "Stage / Competition",
                getValue: (pwtf) => {
                  return (
                    <>
                      {stageNameMap[pwtf.stageName]}
                      {" / "}
                      <SiteLink
                        to={`/season/${pwtf.seasonId}?competition=${pwtf.competitionName}`}
                        pageTitle={`Season - ${pwtf.seasonYear} (S${pwtf.seasonNumber}) - ${pwtf.competitionName}`}
                        textLink={true}
                      >
                        {pwtf.competitionName}
                      </SiteLink>
                    </>
                  )
                },
                width: 5,
              },
              {
                title: "KO",
                getValue: (pwtf) => {
                  return pwtf.ko ? (
                    <img src="tick.svg" className="h-[24px]" />
                  ) : (
                    <img src="cross.svg" className="h-[24px]" />
                  )
                },
                width: 3,
                alignCenter: true,
              },
            ]}
          />
        </>
      )}
    </Page>
  )
}
