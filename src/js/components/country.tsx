import * as React from "react"
import {useContext} from "react"
import {Link, useParams} from "react-router-dom"
import {DbContext} from ".."
import {DbInterface} from "../types"
import {countryNameMap} from "../utils"
import Page from "./page"

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
      <table>
        <thead>
          <tr>
            <th>Bot</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          {countryBots.map((cd, i) => {
            return (
              <tr key={i}>
                <td>
                  <Link style={{color: "#003366"}} to={`/bot/${cd.id}`}>
                    {cd.name}
                  </Link>
                </td>
                <td>???</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Page>
  )
}
