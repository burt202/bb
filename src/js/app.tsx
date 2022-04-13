import * as React from "react"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./home"
import Season from "./season"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/season/:seasonId" element={<Season />} />
      </Routes>
    </BrowserRouter>
  )
}
