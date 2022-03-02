import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Coin = () => {
    const router = useRouter()

    useEffect(() => {
        router?.push('/')
    }, [])
    return <></>
}

export default Coin
