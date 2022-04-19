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
      <div style={{display: "flex"}}>
        <table style={{height: "min-content"}}>
          <thead>
            <tr>
              <th style={{width: 250}}>Bot</th>
              <th>Wins</th>
            </tr>
          </thead>
          <tbody>
            {countryBots.map((cb, i) => {
              return (
                <tr key={i} style={{height: 40}}>
                  <td>
                    <Link style={{color: "#003366"}} to={`/bot/${cb.id}`}>
                      {cb.name}
                    </Link>
                  </td>
                  <td>{cb.wins}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
