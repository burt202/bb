import * as querystring from "query-string"
import * as React from "react"
import {useContext, useEffect, useState} from "react"
import {DbContext} from ".."
import Page from "../components/page"
import Table from "../components/table"
import {DbInterface} from "../types"
import {setTitle, primaryWeaponTypeNameMap} from "../utils"

function updateUrlParams(season?: string) {
  const params = {} as Record<string, string>

  if (season) {
    params.season = season
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

  const [season, setSeason] = useState<string | undefined>(
    parsed.season as string | undefined,
  )

  const db = useContext(DbContext) as DbInterface

  const data = db.getPrimaryWeaponTypeWinCountBreakdown(
    season === "all" ? undefined : season,
  )
  const seasons = db.getAllSeasons()

  useEffect(() => {
    setTitle("Primary Weapon Types")
  }, [])

  return (
    <Page headerComponent={<h1 style={{margin: 0}}>Primary Weapon Types</h1>}>
      <select
        value={season}
        onChange={(e) => {
          setSeason(e.target.value)
          updateUrlParams(e.target.value === "all" ? undefined : e.target.value)
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
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          )
        })}
      </select>
      <Table
        data={data}
        columns={[
          {
            title: "Primary Weapon Type",
            getValue: (pwt) => {
              return primaryWeaponTypeNameMap[pwt.primaryWeaponType]
            },
            width: 5,
          },
          {
            title: "Wins",
            getValue: (pwt) => {
              return pwt.count
            },
            width: 4,
          },
        ]}
      />
    </Page>
  )
}
