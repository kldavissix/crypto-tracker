import { useState, useEffect } from "react"

const useWindowResize = (): [number, number] => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const listener = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }

  useEffect(() => {
    window.addEventListener("resize", listener)
    listener()

    return () => {
      window.removeEventListener("resize", listener)
    }
  }, [])

  if (typeof window === "undefined") return [0, 0]
  return [width, height]
}

export default useWindowResize
