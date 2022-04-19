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
      <div style={{display: "flex"}}>
        <div style={{width: 300}}>
          {grouped.bot.map((sr, i) => {
            return (
              <p key={i}>
                <a
                  style={{
                    color: "#003366",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => onSearchResultClick(`/${sr.type}/${sr.id}`)}
                  dangerouslySetInnerHTML={{
                    __html: sr.name.replace(
                      regEx,
                      (match) => `<strong>${match}</strong>`,
                    ),
                  }}
                />
              </p>
            )
          })}
        </div>
        <div style={{width: 300}}>
          {grouped.member.map((sr, i) => {
            return (
              <p key={i}>
                <a
                  style={{
                    color: "#003366",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => onSearchResultClick(`/${sr.type}/${sr.id}`)}
                  dangerouslySetInnerHTML={{
                    __html: sr.name.replace(
                      regEx,
                      (match) => `<strong>${match}</strong>`,
                    ),
                  }}
                />
              </p>
            )
          })}
        </div>
      </div>
    </>
  )
}
