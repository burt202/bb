import * as React from "react"

interface Props {
  searchTerm: string
}

export default function Search({searchTerm}: Props) {
  return (
    <>
      <h3>Search Results</h3>
      <p>{searchTerm}</p>
    </>
  )
}
