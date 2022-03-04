import { useState, useEffect } from 'react'

const useWindowResize = () => {
    if (typeof window === 'undefined') return { width: 0, height: 0 }

    const [width, setWidth] = useState(window.innerWidth)
    const [height, setHeight] = useState(window.innerHeight)

    const listener = () => {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    useEffect(() => {
        window.addEventListener('resize', listener)

        return () => {
            window.removeEventListener('resize', listener)
        }
    }, [])

    return {
        width,
        height,
    }
}

export default useWindowResize
