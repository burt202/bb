import * as React from "react"
import {HashRouter, Routes, Route} from "react-router-dom"
import Bot from "./components/bot"
import Home from "./components/home"
import Member from "./components/member"
import NotFound from "./components/not-found"
import Season from "./components/season"

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/season/:seasonId" element={<Season />} />
        <Route path="/bot/:botId" element={<Bot />} />
        <Route path="/member/:memberId" element={<Member />} />
        <Route path="*" element={<NotFound title="Page Not Found" />} />
      </Routes>
    </HashRouter>
  )
}
