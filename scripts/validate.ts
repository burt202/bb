import {flatten, pluck} from "ramda"

import data from "../data"

Object.values(data).forEach((s) => {
  const seasonBots = s.bots.reduce((acc, val) => {
    acc[val.name] = val.name
    return acc
  }, {} as Record<string, string>)

  const seasonFights = flatten(pluck("fights", s.competitions))

  seasonFights.forEach((f) => {
    f.bots.forEach((b) => {
      if (seasonBots[b] === undefined) {
        throw new Error(`${b} not listed for season ${s.season}`)
      }
    })
  })

  console.log(`Season ${s.season} Ok`)
})
