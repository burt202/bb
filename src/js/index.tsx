/* eslint-disable @typescript-eslint/no-var-requires */

import * as React from "react"
import * as ReactDom from "react-dom"

import App from "./app"
import createDb from "./db"
import {DbInterface, RawSeason} from "./types"

import "../style.css"

const data = {
  s06: require("../../data/s06.json") as RawSeason,
  s07: require("../../data/s07.json") as RawSeason,
  s08: require("../../data/s08.json") as RawSeason,
  s09: require("../../data/s09.json") as RawSeason,
  s10: require("../../data/s10.json") as RawSeason,
  s11: require("../../data/s11.json") as RawSeason,
}

export const DbContext = React.createContext<DbInterface | null>(null)

const startTime = performance.now()

createDb(Object.values(data))
  .then((db) => {
    const endTime = performance.now()

    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "page_load", {
        db_load_time: endTime - startTime,
      })
    }

    ReactDom.render(
      <DbContext.Provider value={db}>
        <App />
      </DbContext.Provider>,
      document.body.querySelector("#container"),
    )
  })
  .catch(() => {
    throw new Error("Failed to create db")
  })
