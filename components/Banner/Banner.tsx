import { Text, VStack } from '@chakra-ui/react'
import { useMemo } from 'react'
import Carousel from './Carousel'
import { useStore } from '../../config/store'
import axios from 'axios'
import { TrendingCoins } from '../../config/api'
import { useQuery } from 'react-query'

const Banner = () => {
    const { currency, currencySymbol, windowHeight } = useStore()

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
                windowHeight={windowHeight}
            />
        )
    }, [trendingCoins])

    return (
        <VStack
            bgImage={'../../../banner2.jpg'}
            h={windowHeight < 860 ? 260 : 280}
        >
            <VStack alignItems="center">
                <VStack>
                    <Text
                        fontSize={windowHeight < 850 ? '28pt' : '32pt'}
                        fontWeight="extrabold"
                    >
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
