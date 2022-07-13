import {prop, sortBy} from "ramda"
import * as React from "react"
import {useContext, useEffect} from "react"

import {DbContext} from ".."
import Page from "../components/page"
import SiteLink from "../components/site-link"
import Table from "../components/table"
import {DbInterface} from "../types"
import {setTitle} from "../utils"

export default function Winners() {
  const db = useContext(DbContext) as DbInterface

  useEffect(() => {
    setTitle(`Winners`)
  }, [])

  const winners = db.getAllWinners()

  return (
    <Page headerComponent={<h1 className="m-0">Winners</h1>}>
      <div className="mt-l">
        <Table
          shouldShowDivider={(data, row, i) => {
            return data[i + 1] === undefined
              ? false
              : row.seasonId !== data[i + 1].seasonId
          }}
          data={winners}
          columns={[
            {
              title: "Competition / Season",
              getValue: (w) => {
                return (
                  <>
                    <SiteLink
                      to={`/season/${w.seasonId}?competition=${w.competitionName}`}
                      pageTitle={`Season - ${w.seasonYear} (S${w.seasonNumber}) - ${w.competitionName}`}
                      textLink={true}
                    >
                      {w.competitionName}
                    </SiteLink>
                    {" / "}
                    <SiteLink
                      to={`/season/${w.seasonId}`}
                      pageTitle={`Season - ${w.seasonYear} (S${w.seasonNumber})`}
                      textLink={true}
                    >
                      {w.seasonYear} (S{w.seasonNumber})
                    </SiteLink>
                  </>
                )
              },
              width: 5,
            },
            {
              title: "Bot",
              getValue: (w) => {
                return (
                  <SiteLink
                    to={`/bot/${encodeURIComponent(w.botId)}`}
                    pageTitle={`Bot - ${w.botName}`}
                    textLink={true}
                  >
                    {w.botName}
                  </SiteLink>
                )
              },
              width: 5,
            },
            {
              title: "Key Members",
              getValue: (w) => {
                return sortBy(prop("ordinal"), w.members).map((m, i) => {
                  const isLastMember = i + 1 === w.members.length

                  return (
                    <React.Fragment key={i}>
                      <SiteLink
                        to={`/member/${m.id}`}
                        textLink={true}
                        pageTitle={`Member - ${m.name}`}
                      >
                        {m.name}
                      </SiteLink>
                      {isLastMember ? "" : ", "}
                    </React.Fragment>
                  )
                })
              },
              width: 8,
            },
          ]}
        />
      </div>
    </Page>
  )
}
