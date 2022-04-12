/* eslint-disable @typescript-eslint/no-var-requires */

import * as React from "react"
import * as ReactDom from "react-dom"
import createDb from "./db"
import Main from "./main"
import {Season} from "./types"

require("./style.css")

const data = {
  2015: require("../data/2015.json") as Season,
  2016: require("../data/2016.json") as Season,
}

const DbContext = React.createContext({})

createDb(Object.values(data))
  .then((db) => {
    ReactDom.render(
      <DbContext.Provider value={db}>
        <Main db={db} />
      </DbContext.Provider>,
      document.body.querySelector("#container"),
    )
  })
  .catch(() => {
    throw new Error("Failed to create db")
  })
