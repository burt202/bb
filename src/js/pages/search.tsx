import * as React from "react"
import {useContext, useState, useEffect} from "react"

import {DbContext} from ".."
import Page from "../components/page"
import SiteLink from "../components/site-link"
import {DbInterface, SearchResult} from "../types"
import {groupBy, setTitle} from "../utils"

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("")
  const db = useContext(DbContext) as DbInterface
  const searchResults = searchTerm.length > 1 ? db.search(searchTerm) : []

  useEffect(() => {
    setTitle("Search")
  }, [])

  const regEx = new RegExp(searchTerm, "i")

  const grouped = groupBy<SearchResult>((sr) => sr.type, searchResults)

  return (
    <Page headerComponent={<h1 className="m-0">Search</h1>}>
      <div className="my-m">
        <input
          type="search"
          placeholder="Search bots/members"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          className="p-s w-[100%] bg-input border-grey border border-solid rounded"
          autoFocus
        />
      </div>

      {searchResults.length === 0 ? (
        <div className="flex">
          <p className="m-0">No results</p>
        </div>
      ) : (
        <div className="grid gap-m grid-cols-2">
          <div>
            {(grouped.bot || []).length === 0 ? (
              <p className="m-0">No bot results</p>
            ) : (
              (grouped.bot || []).map((sr, i) => {
                return (
                  <p key={i} className="mt-0">
                    <SiteLink
                      to={`/bot/${sr.id}`}
                      pageTitle={`Bot - ${sr.name}`}
                      textLink={true}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: sr.name.replace(
                            regEx,
                            (match) => `<strong>${match}</strong>`,
                          ),
                        }}
                      />
                    </SiteLink>
                  </p>
                )
              })
            )}
          </div>
          <div>
            {(grouped.member || []).length === 0 ? (
              <p className="m-0">No member results</p>
            ) : (
              (grouped.member || []).map((sr, i) => {
                return (
                  <p key={i} className="mt-0">
                    <SiteLink
                      to={`/member/${sr.id}`}
                      pageTitle={`Member - ${sr.name}`}
                      textLink={true}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: sr.name.replace(
                            regEx,
                            (match) => `<strong>${match}</strong>`,
                          ),
                        }}
                      />
                    </SiteLink>
                  </p>
                )
              })
            )}
          </div>
        </div>
      )}
    </Page>
  )
}
