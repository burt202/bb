import * as React from "react"
import * as ReactDom from "react-dom"

import data from "../../data"
import App from "./app"
import createDb from "./db"
import {DbInterface} from "./types"

import "../style.css"

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
  .catch((e) => {
    console.log("e", e)
    throw new Error("Failed to create db")
  })
