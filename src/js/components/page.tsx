import * as React from "react"
import {Link} from "react-router-dom"

interface Props {
  headerComponent: JSX.Element
  children: React.ReactNode
}

export default function Page({children, headerComponent}: Props) {
  return (
    <div style={{marginTop: 16}}>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div>{headerComponent}</div>
        <div style={{display: "flex"}}>
          <Link to="/search">
            <img
              src="search.svg"
              style={{height: 24, cursor: "pointer"}}
              title="Search"
            />
          </Link>
          <div style={{marginLeft: 16}}>
            <Link to="/">
              <img
                src="home.svg"
                style={{height: 24, cursor: "pointer"}}
                title="Home"
              />
            </Link>
          </div>
        </div>
      </div>
      {React.Children.map(children, (c) => c)}
    </div>
  )
}
