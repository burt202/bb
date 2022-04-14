import * as React from "react"
import {useContext} from "react"
import {Link, useParams} from "react-router-dom"
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

  const memberSeasons = db.getMemberSeasons(memberId)

  return (
    <div style={{marginTop: 16}}>
      <h1 style={{margin: 0}}>{member.name}</h1>
      <h3>Seasons</h3>
      <table>
        <thead>
          <tr>
            <th>Season</th>
            <th>Bot</th>
          </tr>
        </thead>
        <tbody>
          {memberSeasons.map((ms, i) => {
            return (
              <tr key={i}>
                <td>
                  <Link
                    style={{color: "#003366"}}
                    to={`/season/${ms.seasonId}`}
                  >
                    {ms.seasonName}
                  </Link>
                </td>
                <td>
                  <Link style={{color: "#003366"}} to={`/bot/${ms.botId}`}>
                    {ms.botName}
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
