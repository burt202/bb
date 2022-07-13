import * as React from "react"
import {useContext, useEffect} from "react"
import {useParams} from "react-router-dom"

import {DbContext} from ".."
import Page from "../components/page"
import SiteLink from "../components/site-link"
import StatBox from "../components/stat-box"
import Table from "../components/table"
import {DbInterface} from "../types"
import {countryNameMap, setTitle} from "../utils"
import NotFound from "./not-found"

export default function Country() {
  const params = useParams()
  const countryId = params.countryId as string
  const db = useContext(DbContext) as DbInterface

  useEffect(() => {
    if (countryNameMap[countryId]) {
      setTitle(`Country - ${countryNameMap[countryId]}`)
    }
  }, [])

  if (!countryNameMap[countryId]) {
    return <NotFound title="Country Not Found" />
  }

  const countryBots = db.getBotsForCountry(countryId)

  return (
    <Page
      headerComponent={
        <>
          <div className="flex items-center justify-between">
            <img src={`${countryId}.svg`} className="h-[48px] mr-m" />
            <h1 className="m-0">{countryNameMap[countryId]}</h1>
          </div>
        </>
      }
    >
      <div className="flex gap-x-m flex-col-reverse l:flex-row">
        <div>
          <h3>Bots</h3>
          <Table
            data={countryBots}
            columns={[
              {
                title: "Bot",
                getValue: (cb) => {
                  return (
                    <SiteLink
                      to={`/bot/${encodeURIComponent(cb.id)}`}
                      pageTitle={`Bot - ${cb.name}`}
                      textLink={true}
                    >
                      {cb.name}
                    </SiteLink>
                  )
                },
                width: 5,
              },
              {
                title: "Wins",
                getValue: (cb) => {
                  return cb.wins
                },
                width: 4,
              },
            ]}
          />
        </div>
        <div className="mt-m l:mt-[51px]">
          <StatBox title="Total Bots" value={countryBots.length.toString()} />
        </div>
      </div>
    </Page>
  )
}
