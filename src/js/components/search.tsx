import * as React from "react"

interface Props {
  searchTerm: string
}

export default function Search({searchTerm}: Props) {
  return <div>{searchTerm}</div>
}
