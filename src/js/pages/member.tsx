import * as React from "react"
import {useContext} from "react"
import {useParams} from "react-router-dom"
import {DbContext} from ".."
import Page from "../components/page"
import Table from "../components/table"
import TextLink from "../components/text-link"
import {DbInterface, MemberSeason} from "../types"
import {groupBy} from "../utils"
import NotFound from "./not-found"

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

  const data = Object.entries(grouped).sort((a, b) => {
    return a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0
  })

  return (
    <Page headerComponent={<h1 style={{margin: 0}}>{member.name}</h1>}>
      <h3>Seasons</h3>
      <Table
        data={data}
        columns={[
          {
            title: "Season",
            getValue: (pair) => {
              const {seasonId, seasonName} = pair[1][0]
              return <TextLink to={`/season/${seasonId}`} text={seasonName} />
            },
            width: 4,
          },
          {
            title: "Bot",
            getValue: (pair) => {
              return pair[1].map((b, i) => {
                const isLastBot = i + 1 === pair[1].length

                return (
                  <React.Fragment key={i}>
                    <TextLink to={`/bot/${b.botId}`} text={b.botName} />
                    {isLastBot ? "" : ", "}
                  </React.Fragment>
                )
              })
            },
            width: 5,
          },
        ]}
      />
    </Page>
  )
}
