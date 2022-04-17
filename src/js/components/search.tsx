import * as React from "react"
import {useContext} from "react"
import {DbContext} from ".."
import {DbInterface} from "../types"

interface Props {
  searchTerm: string
  onSearchResultClick: (link: string) => void
}

export default function Search({searchTerm, onSearchResultClick}: Props) {
  const db = useContext(DbContext) as DbInterface
  const searchResults = db.search(searchTerm)

  const regEx = new RegExp(searchTerm, "i")

  return (
    <>
      <h3>Search Results</h3>
      {searchResults.map((sr, i) => {
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
                  `<strong>${searchTerm}</strong>`,
                ),
              }}
            />
          </p>
        )
      })}
    </>
  )
}
