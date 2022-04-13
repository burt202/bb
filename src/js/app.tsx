import * as React from "react"
import {HashRouter, Routes, Route} from "react-router-dom"
import Home from "./home"
import NotFound from "./not-found"
import Season from "./season"

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/season/:seasonId" element={<Season />} />
        <Route path="*" element={<NotFound title="Page Not Found" />} />
      </Routes>
    </HashRouter>
  )
}
