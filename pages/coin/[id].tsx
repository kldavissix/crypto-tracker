import { useRouter } from 'next/router'
import { HistoricalChart, SingleCoin } from '../../config/api'
import axios from 'axios'
import {
    Box,
    Stack,
    HStack,
    VStack,
    Text,
    Image,
    Heading,
    StackDivider,
    Table,
    Tr,
    Td,
    Tbody,
    Button,
} from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import htmlParse from 'html-react-parser'
import { isObject, numberWithCommas } from '../../config/utils'
import { Line } from 'react-chartjs-2'
import { useStore } from '../../config/store'
import { getCookie } from 'cookies-next'
import { updateDBFavorites } from '../../config/firebase'
import { GetServerSideProps } from 'next'
import dayjs from 'dayjs'
import { motion } from 'framer-motion'
import NotFound from '../../components/NotFound'

const CoinDetail = ({
    coinData,
    chartData,
    marketCapRank,
    currentPrice,
    marketCap,
    days,
}: ICoinDetail) => {
    // Flag first render

    const firstRender = useRef(true)

    // Show currency symbols after first render

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }
    }, [])

    const router = useRouter()

    const { id, symbol, image, name, description } = coinData

    const coinWebsite = coinData.links.homepage[0] || ''

    // Zustand Store

    const { user, currency, currencySymbol, favorites } = useStore()

    const isFavorite = favorites.includes(symbol)

    // Reload server side data when currency changes

    useEffect(() => {
        router.replace(`/coin/${id}?d=${days}`)
    }, [currency])

    if (!chartData) {
        return <NotFound type="coin" />
    }

    const handleToggleFavorite = () => {
        if (user?.uid) {
            updateDBFavorites({
                userId: user.uid,
                symbol,
                bAdd: !isFavorite,
                bDocExists: favorites.length > 0,
            })
        }
    }

    const removeLinksFromDesc = (data: string) => {
        const parsedData = htmlParse(data)
        if (Array.isArray(parsedData)) {
            return parsedData.reduce((a, b) => {
                if (isObject(b) && b?.type === 'a') {
                    // Remove the link and get its inner text
                    return a + b.props.children
                }
                return a + b
            }, '')
        }
        return data
    }

    const descWithoutLinks =
        description.en.length > 0
            ? removeLinksFromDesc(description?.en.split('. ')[0])
            : ''

    const marketCapRankDisplay = numberWithCommas(
        (marketCapRank || 0).toString()
    )
    const currentPriceDisplay = numberWithCommas((currentPrice || 0).toFixed(2))
    const marketCapDisplay = `${numberWithCommas(
        marketCap.toString().slice(0, -6)
    )} M`

    const chartLabels = () => {
        return chartData.map((price) => {
            const date: Date = new Date(price[0])
            if (days === 1) {
                // Return time
                return dayjs(date).format('h:mm A')
            }
            // Return date
            return dayjs(date).format('M/D/YY')
        })
    }

    const chartDataSet = () => chartData.map((price) => price[1])

    const chartDurationButtons = () => {
        const duration = new Map([
            ['24 Hours', 1],
            ['30 Days', 30],
            ['3 Months', 90],
            ['1 Year', 365],
        ])

        return Array.from(duration).map(([key, value]) => {
            const active = days === value

            return (
                <Button
                    key={key}
                    color={active ? 'black' : 'white'}
                    backgroundColor={active ? '#EEBC1D' : 'transparent'}
                    size="xs"
                    fontSize={['xs', null, 'sm']}
                    _focus={{}}
                    onClick={() => router.replace(`/coin/${id}?d=${value}`)}
                >
                    {key}
                </Button>
            )
        })
    }

    return (
        <Box display="flex" justifyContent="center" mt={['2', null, '5']}>
            <Stack
                direction={['column', 'column', 'row']}
                spacing={['2', null, '8']}
                px={['0', null, '4']}
                divider={true && <StackDivider borderColor="#2D3748" />}
                maxW="1100px"
                minH="500px"
                alignItems="center"
            >
                <VStack
                    w={['100%', '100%', '35%']}
                    h={['100%', null, '95%']}
                    justifyContent="space-between"
                    alignItems="center"
                    mb={['2', null, null]}
                    minW="300px"
                >
                    <VStack
                        spacing="2"
                        cursor={coinWebsite.length ? 'pointer' : 'default'}
                        onClick={() => {
                            if (coinWebsite.length) {
                                window.open(coinWebsite, '_blank')
                            }
                        }}
                    >
                        <motion.div
                            whileHover={{
                                scale: 1.1,
                                transition: {
                                    duration: 0.2,
                                },
                            }}
                        >
                            <Image
                                src={image.large}
                                alt={name}
                                h={['55', null, '130']}
                            />
                        </motion.div>
                        <Heading
                            fontSize={['2xl', null, '4xl']}
                            textAlign="center"
                        >
                            {name}
                        </Heading>
                    </VStack>

                    <Text fontSize="sm" align="center">
                        {descWithoutLinks}
                    </Text>

                    <Table size="sm">
                        <Tbody>
                            <Tr>
                                <Td>
                                    <Text fontSize="large" fontWeight="bold">
                                        Rank:
                                    </Text>
                                </Td>
                                <Td isNumeric>
                                    <Text fontSize="large">
                                        {marketCapRankDisplay}
                                    </Text>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td>
                                    <Text fontSize="large" fontWeight="bold">
                                        Current Price:
                                    </Text>
                                </Td>
                                <Td isNumeric>
                                    <HStack
                                        spacing="0"
                                        justifyContent="flex-end"
                                    >
                                        {!firstRender.current && currencySymbol}
                                        <Text fontSize="large">
                                            {currentPriceDisplay}
                                        </Text>
                                    </HStack>
                                </Td>
                            </Tr>
                            <Tr>
                                <Td>
                                    <Text fontSize="large" fontWeight="bold">
                                        Market Cap:
                                    </Text>
                                </Td>
                                <Td isNumeric>
                                    <HStack
                                        spacing="0"
                                        justifyContent="flex-end"
                                    >
                                        {!firstRender.current && currencySymbol}
                                        <Text fontSize="large">
                                            {marketCapDisplay}
                                        </Text>
                                    </HStack>
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>

                    {user && (
                        <Button
                            onClick={() => handleToggleFavorite()}
                            size="sm"
                            color="black"
                            bgColor="#EEBC1D"
                            _focus={{}}
                            fontSize={['xs', null, 'sm']}
                        >
                            {`${
                                isFavorite ? 'Remove from' : 'Add To'
                            } Favorites`}
                        </Button>
                    )}
                </VStack>
                <VStack
                    w={['90%', '90%', '65%']}
                    justifyContent="center"
                    alignItems="center"
                    mt={['2', null, null]}
                    minW={['375px', null, '600px']}
                >
                    <Line
                        data={{
                            labels: chartLabels(),
                            datasets: [
                                {
                                    data: chartDataSet(),
                                    label: `Price (Past ${
                                        days === 1 ? '24' : days
                                    } ${
                                        days === 1 ? 'Hours' : 'Days'
                                    }) in ${currency.toUpperCase()}`,
                                    borderColor: '#EEBC1D',
                                    pointRadius: 0,
                                    pointHoverBorderWidth: 3,
                                },
                            ],
                        }}
                    />
                    <HStack
                        w={['100%', null, '60%']}
                        justifyContent="space-between"
                        pt="15"
                        spacing={['8', null, '4']}
                    >
                        {chartDurationButtons()}
                    </HStack>
                </VStack>
                )
            </Stack>
        </Box>
    )
}

export default CoinDetail

export const getServerSideProps: GetServerSideProps = async ({
    query,
    req,
    res,
}) => {
    // Get the query params

    let coinId: string = ''
    let d: string = ''

    if (typeof query.id === 'string') coinId = query.id
    if (typeof query.d === 'string') d = query.d

    const days: number = ['1', '30', '90', '365'].includes(d) ? parseInt(d) : 1
    let currency: string = getCookie('cur', { req, res }) as string

    if (!['usd', 'eur'].includes(currency)) currency = 'usd'

    let coinData = null
    let chartData = null
    let marketCapRank = null
    let currentPrice = null
    let marketCap = null

    const fetchData = async () => {
        const coinFetch = axios(SingleCoin(coinId))
        const chartFetch = axios(HistoricalChart(coinId, days, currency))

        try {
            return await Promise.all([coinFetch, chartFetch])
        } catch (e) {}
    }

    const data = await fetchData()

    if (data) {
        coinData = data[0].data
        chartData = data[1].data.prices
        marketCapRank = coinData.market_cap_rank
        currentPrice = coinData.market_data.current_price[currency]
        marketCap = coinData.market_data.market_cap[currency]
    }

    return {
        props: {
            coinData,
            chartData,
            marketCapRank,
            currentPrice,
            marketCap,
            days,
        },
    }
}
