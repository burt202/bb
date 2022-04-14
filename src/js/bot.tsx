import * as React from "react"
import {useContext} from "react"
import {useParams} from "react-router-dom"
import NotFound from "./not-found"
import {DbInterface} from "./types"
import {DbContext} from "."

export default function Bot() {
  const params = useParams()
  const botId = params.botId as string
  const db = useContext(DbContext) as DbInterface

  const bot = db.getBotById(botId)

  if (!bot) {
    return <NotFound title="Bot Not Found" />
  }

  return (
    <div style={{marginTop: 16}}>
      <h1 style={{margin: 0}}>{bot.name}</h1>
    </div>
  )
}
