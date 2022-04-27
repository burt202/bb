import * as React from "react"
import {HashRouter, Routes, Route} from "react-router-dom"
import Bot from "./pages/bot"
import Country from "./pages/country"
import Home from "./pages/home"
import Member from "./pages/member"
import NotFound from "./pages/not-found"
import Season from "./pages/season"

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/season/:seasonId" element={<Season />} />
        <Route path="/bot/:botId" element={<Bot />} />
        <Route path="/member/:memberId" element={<Member />} />
        <Route path="/country/:countryId" element={<Country />} />
        <Route path="*" element={<NotFound title="Page Not Found" />} />
      </Routes>
    </HashRouter>
  )
}
