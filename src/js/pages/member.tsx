import {groupBy, pipe, sortBy} from "ramda"
import * as React from "react"
import {useContext, useEffect} from "react"
import {useParams} from "react-router-dom"

import {DbContext} from ".."
import Page from "../components/page"
import SiteLink from "../components/site-link"
import Table from "../components/table"
import {DbInterface, MemberSeason} from "../types"
import {setTitle} from "../utils"
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

  const memberSeasons = pipe(
    groupBy((ms: MemberSeason) => ms.seasonId),
    Object.entries,
    sortBy((pair: [string, Array<MemberSeason>]) => pair[0]),
  )(db.getMemberSeasons(memberId))

  return (
    <Page headerComponent={<h1 className="m-0">{member.name}</h1>}>
      <h3>Seasons</h3>
      <Table
        data={memberSeasons.reverse()}
        columns={[
          {
            title: "Season",
            getValue: (pair) => {
              const {seasonId, seasonYear, seasonNumber} = pair[1][0]
              return (
                <SiteLink
                  to={`/season/${seasonId}`}
                  textLink={true}
                  pageTitle={`Season - ${seasonId}`}
                >
                  {seasonYear} (S{seasonNumber})
                </SiteLink>
              )
            },
            width: 3,
          },
          {
            title: "Bot(s)",
            getValue: (pair) => {
              const bots = sortBy((pair) => pair.botName, pair[1])

              return bots.map((b, i) => {
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
            width: 13,
          },
          {
            title: "Wins",
            getValue: (pair) => {
              const total = pair[1].reduce((acc, val) => {
                return acc + val.wins
              }, 0)

              return total
            },
            width: 2,
          },
        ]}
      />
    </Page>
  )
}
