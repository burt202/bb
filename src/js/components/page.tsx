import * as React from "react"
import SiteLink from "./site-link"

interface Props {
  headerComponent: JSX.Element
  children: React.ReactNode
}

export default function Page({children, headerComponent}: Props) {
  return (
    <div className="mt-m">
      <div className="flex justify-between">
        <div>{headerComponent}</div>
        <div className="flex">
          <SiteLink to="/search" pageTitle="Search">
            <img
              src="search.svg"
              className="h-[24px] cursor-pointer"
              title="Search"
            />
          </SiteLink>
          <div className="ml-m">
            <SiteLink to="/" pageTitle="Home">
              <img
                src="home.svg"
                className="h-[24px] cursor-pointer"
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
