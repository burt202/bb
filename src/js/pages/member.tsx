import * as React from "react"
import {useContext, useEffect} from "react"
import {useParams} from "react-router-dom"
import {DbContext} from ".."
import Page from "../components/page"
import SiteLink from "../components/site-link"
import Table from "../components/table"
import {DbInterface, MemberSeason} from "../types"
import {groupBy, setTitle} from "../utils"
import NotFound from "./not-found"

export default function Member() {
  const params = useParams()
  const memberId = params.memberId as string
  const db = useContext(DbContext) as DbInterface

  const member = db.getMemberById(memberId)

  useEffect(() => {
    if (member) {
      setTitle(`Member - ${member.name}`)
    }
  }, [])

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
              return (
                <SiteLink
                  to={`/season/${seasonId}`}
                  textLink={true}
                  pageTitle={`Season - ${seasonId}`}
                >
                  {seasonName}
                </SiteLink>
              )
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
                    <SiteLink
                      to={`/bot/${b.botId}`}
                      textLink={true}
                      pageTitle={`Bot - ${b.botName}`}
                    >
                      {b.botName}
                    </SiteLink>
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
