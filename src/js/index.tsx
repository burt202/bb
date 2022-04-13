/* eslint-disable @typescript-eslint/no-var-requires */

import * as React from "react"
import * as ReactDom from "react-dom"
import App from "./app"
import createDb from "./db"
import {DbInterface, RawSeason} from "./types"

require("../style.css")

const data = {
  2015: require("../../data/2015.json") as RawSeason,
  2016: require("../../data/2016.json") as RawSeason,
}

export const DbContext = React.createContext<DbInterface | null>(null)

createDb(Object.values(data))
  .then((db) => {
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
