import * as React from "react"
import {useContext} from "react"
import {Link, useParams} from "react-router-dom"
import {DbContext} from ".."
import {DbInterface, MemberSeason} from "../types"
import {groupBy} from "../utils"
import NotFound from "./not-found"
import Page from "./page"

export default function Member() {
  const params = useParams()
  const memberId = params.memberId as string
  const db = useContext(DbContext) as DbInterface

  const member = db.getMemberById(memberId)

  if (!member) {
    return <NotFound title="Member Not Found" />
  }

  const memberSeasons = db.getMemberSeasons(memberId)
  const grouped = groupBy<MemberSeason>((ms) => ms.seasonId, memberSeasons)

  return (
    <Page
      headerComponent={
        <div>
          <h1 style={{margin: 0}}>{member.name}</h1>
        </div>
      }
      showShowHome={true}
    >
      <h3>Seasons</h3>
      <table>
        <thead>
          <tr>
            <th>Season</th>
            <th>Bot</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped)
            .sort((a, b) => {
              return a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0
            })
            .map((pair, i) => {
              const {seasonId, seasonName} = pair[1][0]

              return (
                <tr key={i}>
                  <td>
                    <Link style={{color: "#003366"}} to={`/season/${seasonId}`}>
                      {seasonName}
                    </Link>
                  </td>
                  <td>
                    {pair[1].map((b, i) => {
                      const isLastBot = i + 1 === pair[1].length

                      return (
                        <React.Fragment key={i}>
                          <Link
                            style={{color: "#003366"}}
                            to={`/bot/${b.botId}`}
                          >
                            {b.botName}
                          </Link>
                          {isLastBot ? "" : ", "}
                        </React.Fragment>
                      )
                    })}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </Page>
  )
}
