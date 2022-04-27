/* eslint-disable @typescript-eslint/no-var-requires */

import {RawSeason} from "../src/js/types"

const data = {
  2015: require("../data/2015.json") as RawSeason,
  2016: require("../data/2016.json") as RawSeason,
  2018: require("../data/2018.json") as RawSeason,
  2019: require("../data/2019.json") as RawSeason,
  2020: require("../data/2020.json") as RawSeason,
  2021: require("../data/2021.json") as RawSeason,
}

Object.values(data).forEach((y) => {
  const yearBots = y.bots.reduce((acc, val) => {
    acc[val.name] = val.name
    return acc
  }, {} as Record<string, string>)

  y.fights.forEach((f) => {
    f.bots.forEach((b) => {
      if (yearBots[b] === undefined) {
        throw new Error(`${b} not listed for ${y.year}`)
      }
    })
  })

  console.log(`${y.year} Ok`)
})
