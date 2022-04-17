import * as React from "react"
import {useState} from "react"
import {Link} from "react-router-dom"
import Search from "./search"

interface Props {
  headerComponent: JSX.Element
  children: React.ReactNode
  showShowHome?: boolean
}

export default function Page({children, headerComponent, showShowHome}: Props) {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div style={{marginTop: 16}}>
      <div style={{display: "flex", justifyContent: "space-between"}}>
        <div>{headerComponent}</div>
        <div style={{display: "flex"}}>
          <div className="search-container">
            <input
              className="search-input"
              id="searchright"
              type="search"
              placeholder="Search bots/members"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <label className="search-button" htmlFor="searchright">
              <span>&#9906;</span>
            </label>
          </div>
          {showShowHome && (
            <div style={{marginLeft: 16, height: 40, lineHeight: "40px"}}>
              <Link
                style={{
                  color: "#003366",
                }}
                to="/"
              >
                Home
              </Link>
            </div>
          )}
        </div>
      </div>
      {searchTerm.length > 0 ? (
        <Search
          searchTerm={searchTerm}
          onSearchResultClick={(link) => {
            setSearchTerm("")
            window.location.hash = link
          }}
        />
      ) : (
        React.Children.map(children, (c) => c)
      )}
    </div>
  )
}
