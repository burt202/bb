import * as React from "react"
import {useLayoutEffect} from "react"
import {HashRouter, Routes, Route, useLocation} from "react-router-dom"
import Bot from "./pages/bot"
import Country from "./pages/country"
import Home from "./pages/home"
import Member from "./pages/member"
import NotFound from "./pages/not-found"
import Search from "./pages/search"
import Season from "./pages/season"

interface Props {
  children: JSX.Element
}

const Wrapper = ({children}: Props) => {
  const location = useLocation()

  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0)
  }, [location.pathname])

  return children
}

export default function App() {
  return (
    <HashRouter>
      <Wrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/season/:seasonId" element={<Season />} />
          <Route path="/bot/:botId" element={<Bot />} />
          <Route path="/member/:memberId" element={<Member />} />
          <Route path="/country/:countryId" element={<Country />} />
          <Route path="*" element={<NotFound title="Page Not Found" />} />
        </Routes>
      </Wrapper>
    </HashRouter>
  )
}
