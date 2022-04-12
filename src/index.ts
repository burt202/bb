/* eslint-disable @typescript-eslint/no-var-requires */

import createDb from "./db"
import {Season} from "./types"

const data = {
  2015: require("../data/2015.json") as Season,
  2016: require("../data/2016.json") as Season,
}

const allData = Object.values(data)

createDb(allData)
  .then((db) => {
    console.log(db.getAllSeasons())
  })
  .catch(() => {
    throw new Error(`Failed to create db`)
  })
