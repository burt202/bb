import * as React from "react"
import SiteLink from "./site-link"

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
          <SiteLink to="/search" pageTitle="Search">
            <img
              src="search.svg"
              style={{height: 24, cursor: "pointer"}}
              title="Search"
            />
          </SiteLink>
          <div style={{marginLeft: 16}}>
            <SiteLink to="/" pageTitle="Home">
              <img
                src="home.svg"
                style={{height: 24, cursor: "pointer"}}
                title="Home"
              />
            </SiteLink>
          </div>
        </div>
      </div>
      {React.Children.map(children, (c) => c)}
    </div>
  )
}
