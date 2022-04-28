import * as React from "react"
import {useContext} from "react"
import {DbContext} from ".."
import {DbInterface, SearchResult} from "../types"
import {groupBy} from "../utils"

interface Props {
  searchTerm: string
  onSearchResultClick: (link: string) => void
}

export default function Search({searchTerm, onSearchResultClick}: Props) {
  const db = useContext(DbContext) as DbInterface
  const searchResults = db.search(searchTerm)

  const regEx = new RegExp(searchTerm, "i")

  const grouped = groupBy<SearchResult>((sr) => sr.type, searchResults)

  return (
    <>
      <h3>Search Results</h3>
      {searchResults.length === 0 ? (
        <div style={{display: "flex"}}>
          <p style={{margin: 0}}>No results</p>
        </div>
      ) : (
        <div
          style={{display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: 16}}
        >
          <div>
            {(grouped.bot || []).length === 0 ? (
              <p style={{margin: 0}}>No bot results</p>
            ) : (
              (grouped.bot || []).map((sr, i) => {
                return (
                  <p key={i} style={{marginTop: 0}}>
                    <a
                      style={{
                        color: "#003366",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() =>
                        onSearchResultClick(`/${sr.type}/${sr.id}`)
                      }
                      dangerouslySetInnerHTML={{
                        __html: sr.name.replace(
                          regEx,
                          (match) => `<strong>${match}</strong>`,
                        ),
                      }}
                    />
                  </p>
                )
              })
            )}
          </div>
          <div>
            {(grouped.member || []).length === 0 ? (
              <p style={{margin: 0}}>No member results</p>
            ) : (
              (grouped.member || []).map((sr, i) => {
                return (
                  <p key={i} style={{marginTop: 0}}>
                    <a
                      style={{
                        color: "#003366",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() =>
                        onSearchResultClick(`/${sr.type}/${sr.id}`)
                      }
                      dangerouslySetInnerHTML={{
                        __html: sr.name.replace(
                          regEx,
                          (match) => `<strong>${match}</strong>`,
                        ),
                      }}
                    />
                  </p>
                )
              })
            )}
          </div>
        </div>
      )}
    </>
  )
}
