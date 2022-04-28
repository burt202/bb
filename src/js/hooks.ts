import {useState, useEffect} from "react"

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const resize = () => setWidth(window.innerWidth)

    window.addEventListener("resize", resize)
    resize()

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [])

  return width
}
