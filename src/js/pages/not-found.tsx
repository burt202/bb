import * as React from "react"
import {useEffect} from "react"
import SiteLink from "../components/site-link"
import {setTitle} from "../utils"

interface Props {
  title: string
}

export default function NotFound({title}: Props) {
  useEffect(() => {
    setTitle(title)
  }, [])

  return (
    <div className="flex justify-center">
      <div className="text-center border border-black border-solid mt-l p-l w-[400px]">
        <h1 className="mt-0">{title}</h1>
        <SiteLink textLink={true} to="/" pageTitle="Home">
          Back to home
        </SiteLink>
      </div>
    </div>
  )
}
