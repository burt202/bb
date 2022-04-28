import * as React from "react"

const BASE_UNIT = 50

export interface Column<T> {
  title: string
  getValue: (item: T) => string | React.ReactNode
  width: number
  alignCenter?: boolean
}

interface Props<T> {
  width: number
  data: Array<T>
  columns: Array<Column<T>>
  shouldShowDivider?: (data: Array<T>, row: T, index: number) => boolean
}

export default function Table<T>({
  width,
  data,
  columns,
  shouldShowDivider,
}: Props<T>) {
  return (
    <table style={{width, height: "min-content"}}>
      <thead>
        <tr>
          {columns.map((c, i) => {
            return (
              <th
                key={i}
                style={{
                  width: c.width * BASE_UNIT,
                  textAlign: c.alignCenter ? "center" : "left",
                }}
              >
                {c.title}
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => {
          const thickBottomBorder = shouldShowDivider
            ? shouldShowDivider(data, row, i)
            : false

          return (
            <tr
              key={i}
              style={{
                height: 35,
                borderBottom: thickBottomBorder ? "3px solid" : 1,
              }}
            >
              {columns.map((c, j) => {
                return (
                  <td
                    key={j}
                    style={{
                      width: c.width * BASE_UNIT,
                      textAlign: c.alignCenter ? "center" : "left",
                    }}
                  >
                    {c.getValue(row)}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
