import { Box, Text, VStack } from '@chakra-ui/react'
import { lazy, Suspense, useEffect, useMemo } from 'react'
import Carousel from './Carousel'
import { TrendingCoinsStatic } from '../../config/TrendingCoinsStatic'
import { useStore } from '../../config/store'
import axios from 'axios'
import { TrendingCoins } from '../../config/api'
import { useQuery } from 'react-query'

const Banner = () => {
    const { currency, currencySymbol } = useStore()

    // Trending coins API data fetching

    const { isLoading, isError, data } = useQuery(
        ['TrendingCoins', currency],
        () => axios(TrendingCoins(currency))
    )
    const trendingCoins = data?.data

    // Memoize carousel to keep it from rerendering/restarting
    // its animation on every render

    const memoCarousel = useMemo(() => {
        return (
            <Carousel
                trendingCoins={trendingCoins}
                currency={currency}
                currencySymbol={currencySymbol}
                isLoading={isLoading}
                isError={isError}
            />
        )
    }, [trendingCoins])

    return (
        <VStack bgImage={'../../../banner2.jpg'} h={280}>
            <VStack alignItems="center">
                <VStack>
                    <Text fontSize="32pt" fontWeight="extrabold">
                        Crypto Tracker
                    </Text>
                    <Text fontSize="inherit">
                        Get All The Info Regarding Your Favorite Crypto Currency
                    </Text>
                </VStack>
            </VStack>
            {memoCarousel}
        </VStack>
    )
}

export default Banner
