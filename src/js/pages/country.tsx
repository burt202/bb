import * as React from "react"
import {useContext} from "react"
import {useParams} from "react-router-dom"
import {DbContext} from ".."
import Page from "../components/page"
import Table from "../components/table"
import TextLink from "../components/text-link"
import {DbInterface} from "../types"
import {countryNameMap} from "../utils"

export default function Country() {
  const params = useParams()
  const countryId = params.countryId as string
  const db = useContext(DbContext) as DbInterface

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
      showShowHome={true}
    >
      <h3>Bots</h3>
      <div style={{display: "flex"}}>
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
          width={450}
        />
        <div style={{marginLeft: 16}}>
          <div
            style={{
              background: "#ccc",
              padding: 16,
              width: 380,
              textAlign: "right",
              marginBottom: 16,
            }}
          >
            <p style={{margin: 0, fontSize: 30, fontWeight: 400}}>Total Bots</p>
            <p style={{margin: 0, fontSize: 60, fontWeight: 400}}>
              {countryBots.length}
            </p>
          </div>
        </div>
      </div>
    </Page>
  )
}
