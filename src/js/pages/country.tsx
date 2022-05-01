import * as React from "react"
import {useContext, useEffect} from "react"
import {useParams} from "react-router-dom"
import {DbContext} from ".."
import Page from "../components/page"
import StatBox from "../components/stat-box"
import Table from "../components/table"
import TextLink from "../components/text-link"
import {DbInterface} from "../types"
import {countryNameMap} from "../utils"

export default function Country() {
  const params = useParams()
  const countryId = params.countryId as string
  const db = useContext(DbContext) as DbInterface

  useEffect(() => {
    if (countryNameMap[countryId]) {
      document.title = `Battlebots DB - Country - ${countryNameMap[countryId]}`
    }
  }, [])

  const countryBots = db.getBotsForCountry(countryId)

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
            <img
              src={`${countryId}.svg`}
              style={{height: 48, marginRight: 16}}
            />
            <h1 style={{margin: 0}}>{countryNameMap[countryId]}</h1>
          </div>
        </>
      }
    >
      <div className="side-by-side">
        <div>
          <h3>Bots</h3>
          <Table
            data={countryBots}
            columns={[
              {
                title: "Bot",
                getValue: (cb) => {
                  return <TextLink to={`/bot/${cb.id}`} text={cb.name} />
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
        <div className="right-side-title-margin">
          <StatBox title="Total Bots" value={countryBots.length.toString()} />
        </div>
      </div>
    </Page>
  )
}
