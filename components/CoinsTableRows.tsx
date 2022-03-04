import { StarIcon } from '@chakra-ui/icons'
import { Td, Tr, Text, HStack, Box, Image } from '@chakra-ui/react'
import { useStore } from '../config/store'
import { numberWithCommas } from '../config/utils'

const CoinsTableRows = ({ coins, handleCoinRowClicked }: ICoinsTableRows) => {
    // Zustard store

    const { currencySymbol } = useStore()

    let favoriteAction: string = ''

    return (
        <>
            {coins.map((coin) => {
                const {
                    id,
                    name,
                    symbol,
                    image,
                    current_price,
                    price_change_percentage_24h,
                    market_cap,
                    isFavorite,
                } = coin

                let priceChange24HoursDisplay: string = `${price_change_percentage_24h?.toFixed(
                    2
                )}%`

                if (priceChange24HoursDisplay === '-0.00%')
                    priceChange24HoursDisplay =
                        priceChange24HoursDisplay.replace('-', '')
                const loss = priceChange24HoursDisplay.startsWith('-')

                return (
                    <Tr
                        onClick={(e) =>
                            handleCoinRowClicked(id, symbol, favoriteAction)
                        }
                        cursor="pointer"
                        key={id}
                        _hover={{ backgroundColor: '#222633' }}
                    >
                        {/* {Coin Column } */}

                        <Td py="1.5" px={[0, 1, 1]}>
                            <HStack>
                                <Image
                                    src={image}
                                    alt={name}
                                    display={['none', 'inline', 'inline']}
                                    h="30px"
                                />
                                <Box pl={[0, 1, 1]}>
                                    <Text
                                        fontWeight="semibold"
                                        textTransform="uppercase"
                                    >
                                        {symbol}
                                    </Text>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="light"
                                        color="#A0AEC0"
                                        textTransform="capitalize"
                                    >
                                        {id}
                                    </Text>
                                </Box>
                            </HStack>
                        </Td>

                        {/* {Price Column } */}

                        <Td>
                            <HStack spacing="0" justifyContent="flex-end">
                                {currencySymbol}
                                <Text>
                                    {numberWithCommas(current_price.toFixed(2))}
                                </Text>
                            </HStack>
                        </Td>

                        {/* {24hr Change Column } */}

                        <Td isNumeric color={loss ? 'red' : 'default'}>
                            {priceChange24HoursDisplay}
                        </Td>

                        {/* {Market Cap Column } */}

                        <Td>
                            <HStack spacing="0" justifyContent="flex-end">
                                {currencySymbol}
                                <Text>
                                    {numberWithCommas(
                                        market_cap.toString().slice(0, -6)
                                    )}
                                    &nbsp;M
                                </Text>
                            </HStack>
                        </Td>

                        <Td
                            onClick={() => {
                                favoriteAction = isFavorite ? 'remove' : 'add'
                            }}
                        >
                            <HStack justifyContent="center" spacing="0">
                                <StarIcon
                                    p="0"
                                    m="0"
                                    color={isFavorite ? '#EEBC1D' : 'default'}
                                />
                            </HStack>
                        </Td>
                    </Tr>
                )
            })}
        </>
    )
}

export default CoinsTableRows
