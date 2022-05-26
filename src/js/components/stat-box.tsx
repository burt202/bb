import * as React from "react"

interface Props {
  title: string
  value: string
}

export default function StatBox({title, value}: Props) {
  return (
    <div className="bg-grey p-m w-[100%] text-right l:w-[400px]">
      <p className="m-0 text-3xl font-normal">{title}</p>
      <p className="m-0 text-6xl font-normal">{value}</p>
    </div>
  )
}
