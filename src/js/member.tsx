import * as React from "react"
import {useContext} from "react"
import {useParams} from "react-router-dom"
import NotFound from "./not-found"
import {DbInterface} from "./types"
import {DbContext} from "."

export default function Member() {
  const params = useParams()
  const memberId = params.memberId as string
  const db = useContext(DbContext) as DbInterface

  const member = db.getMemberById(memberId)

  if (!member) {
    return <NotFound title="Member Not Found" />
  }

  return (
    <div style={{marginTop: 16}}>
      <h1 style={{margin: 0}}>{member.name}</h1>
    </div>
  )
}
