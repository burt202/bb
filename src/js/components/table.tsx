import * as React from "react"
import {useWindowWidth} from "../hooks"

const BASE_UNIT = 50
const PAGE_WIDTH = 900

export interface Column<T> {
  title: string
  getValue: (item: T) => string | React.ReactNode
  width: number
  alignCenter?: boolean
}

interface Props<T> {
  data: Array<T>
  columns: Array<Column<T>>
  shouldShowDivider?: (data: Array<T>, row: T, index: number) => boolean
}

function calculateColumnWidth(
  usePercentages: boolean,
  tableWidth: number,
  columnWidth: number,
) {
  if (usePercentages) {
    return `${(columnWidth / tableWidth) * 100}%`
  }
  return `${columnWidth * BASE_UNIT}px`
}

export default function Table<T>({data, columns, shouldShowDivider}: Props<T>) {
  const windowWidth = useWindowWidth()
  const tableWidth = columns.reduce((acc, val) => {
    return acc + val.width
  }, 0)

  if (tableWidth * BASE_UNIT > PAGE_WIDTH / 2 && windowWidth <= PAGE_WIDTH) {
    return (
      <table style={{width: "100%", height: "min-content"}}>
        <tbody>
          {data.map((row, i) => {
            const isLastRow = i + 1 === data.length

            return columns.map((col, j) => {
              const shouldShowDivider = isLastRow
                ? false
                : j + 1 === columns.length

              return (
                <tr
                  key={j}
                  style={{
                    height: 35,
                    borderBottom: shouldShowDivider ? "3px solid" : 1,
                  }}
                >
                  <th style={{width: "33%"}}>{col.title}</th>
                  <td style={{width: "67%"}}>{col.getValue(row)}</td>
                </tr>
              )
            })
          })}
        </tbody>
      </table>
    )
  }

  const usePercentages =
    tableWidth * BASE_UNIT <= PAGE_WIDTH / 2 && windowWidth <= PAGE_WIDTH

  return (
    <table
      style={{width: usePercentages ? "100%" : "auto", height: "min-content"}}
    >
      <thead>
        <tr>
          {columns.map((col, i) => {
            return (
              <th
                key={i}
                style={{
                  width: calculateColumnWidth(
                    usePercentages,
                    tableWidth,
                    col.width,
                  ),
                  textAlign: col.alignCenter ? "center" : "left",
                }}
              >
                {col.title}
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
              {columns.map((col, j) => {
                return (
                  <td
                    key={j}
                    style={{
                      width: calculateColumnWidth(
                        usePercentages,
                        tableWidth,
                        col.width,
                      ),
                      textAlign: col.alignCenter ? "center" : "left",
                    }}
                  >
                    {col.getValue(row)}
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
