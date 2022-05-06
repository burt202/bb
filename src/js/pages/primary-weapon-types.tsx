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
  stageNameMap,
  getPercentage,
  countryNameMap,
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

  const primaryWeaponTypeFights = hasSpecificPrimaryWeaponTypeSelected
    ? db.getPrimaryWeaponTypeWins(
        primaryWeaponTypeId,
        seasonId === "all" ? undefined : seasonId,
      )
    : []
  const koWins = primaryWeaponTypeFights.filter((pwtf) => pwtf.ko)

  const primaryWeaponTypeBots =
    hasSpecificSeasonSelected && hasSpecificPrimaryWeaponTypeSelected
      ? db.getPrimaryWeaponTypeBots(primaryWeaponTypeId, seasonId)
      : []

  return (
    <Page headerComponent={<h1 style={{margin: 0}}>Primary Weapon Types</h1>}>
      <select
        value={seasonId}
        onChange={(e) => {
          setSeasonId(e.target.value)
          updateUrlParams(
            e.target.value === "all" ? undefined : e.target.value,
            primaryWeaponTypeId,
          )
        }}
        style={{
          marginTop: 16,
          marginBottom: 16,
          padding: 8,
          backgroundColor: "#f5f5f5",
          border: "1px solid grey",
          borderRadius: 5,
        }}
      >
        <option value="all">All seasons</option>
        {seasons.map((s) => {
          return (
            <option key={s.id} value={s.id}>
              {s.name}
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
        style={{
          marginTop: 16,
          marginBottom: 16,
          marginLeft: 16,
          padding: 8,
          backgroundColor: "#f5f5f5",
          border: "1px solid grey",
          borderRadius: 5,
        }}
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
                    style={{
                      color: "#003366",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
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
                    style={{
                      color: "#003366",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
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
          <div className="bot-stats">
            <h3>Wins</h3>
            <div style={{display: "flex", alignItems: "center"}}>
              <div style={{marginRight: 32}}>
                Total: <strong>{primaryWeaponTypeFights.length}</strong>
              </div>
              <div>
                KO %:{" "}
                <strong>
                  {getPercentage(primaryWeaponTypeFights.length, koWins.length)}
                </strong>
              </div>
            </div>
          </div>
          <Table
            data={primaryWeaponTypeFights}
            shouldShowDivider={(data, row, i) => {
              return data[i + 1] === undefined
                ? false
                : row.seasonId !== data[i + 1].seasonId
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
                          style={{
                            fontWeight:
                              pwtf.winnerName === c.name ? "bold" : "normal",
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
                title: "Season",
                getValue: (pwtf) => {
                  return (
                    <SiteLink
                      to={`/season/${pwtf.seasonId}`}
                      pageTitle={`Season - ${pwtf.seasonName}`}
                      textLink={true}
                    >
                      {pwtf.seasonName}
                    </SiteLink>
                  )
                },
                width: 4,
              },
              {
                title: "KO",
                getValue: (pwtf) => {
                  return pwtf.ko ? (
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
                  getValue: (pwtb) => {
                    return (
                      <SiteLink
                        to={`/bot/${pwtb.botId}`}
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
                  title: "Stage",
                  getValue: (pwtb) => {
                    return stageNameMap[pwtb.stageName]
                  },
                  width: 4,
                },
              ]}
            />
          </div>
          <div className="bot-stats">
            <h3>Wins</h3>
            <div style={{display: "flex", alignItems: "center"}}>
              <div style={{marginRight: 32}}>
                Total: <strong>{primaryWeaponTypeFights.length}</strong>
              </div>
              <div>
                KO %:{" "}
                <strong>
                  {getPercentage(primaryWeaponTypeFights.length, koWins.length)}
                </strong>
              </div>
            </div>
          </div>
          <Table
            data={primaryWeaponTypeFights}
            columns={[
              {
                title: "Bots",
                getValue: (pwtf) => {
                  return pwtf.bots.map((c, i) => {
                    const isLastBot = i + 1 === pwtf.bots.length

                    return (
                      <React.Fragment key={i}>
                        <span
                          style={{
                            fontWeight:
                              pwtf.winnerName === c.name ? "bold" : "normal",
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
                getValue: (pwtf) => {
                  return stageNameMap[pwtf.stageName]
                },
                width: 4,
              },
              {
                title: "KO",
                getValue: (pwtf) => {
                  return pwtf.ko ? (
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
        </>
      )}
    </Page>
  )
}
