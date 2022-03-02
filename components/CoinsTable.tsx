import {
    Input,
    VStack,
    Text,
    Image,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Box,
    HStack,
    InputGroup,
    InputRightElement,
    Button,
    IconButton,
    Checkbox,
    Progress,
    Stack,
} from '@chakra-ui/react'
import {
    ChevronUpIcon,
    ChevronDownIcon,
    CloseIcon,
    StarIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
} from '@chakra-ui/icons'
import axios from 'axios'
import { CoinList } from '../config/api'
import { useQuery } from 'react-query'
import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useStore } from '../config/store'
import { motion } from 'framer-motion'
import { numberWithCommas, showToast } from '../config/utils'
import { updateDBFavorites } from '../config/firebase'
import { orderBy } from 'lodash'
import useDebounce from '../hooks/useDebounce'
import usePagination from '../hooks/usePagination'

const CoinsTable = () => {
    // Zustard Store

    const {
        user,
        currency,
        currencySymbol,
        pageNum,
        setPageNum,
        search,
        setSearch,
        sortField,
        setSortField,
        sortDir,
        setSortDir,
        favorites,
        favoritesOnly,
        setFavoritesOnly,
    } = useStore()

    const router = useRouter()

    // Flag first render

    const firstRender = useRef(true)
    const searchField = useRef<HTMLInputElement>(null)

    let favoriteCellClicked: string = ''

    const debouncedSearch = useDebounce({ value: search, delay: 500 })

    // Reset page number when search/sort conditions change

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false
            return
        }
        setPageNum(1)
    }, [debouncedSearch, sortField, sortDir, favoritesOnly, setPageNum])

    const setCoinsToDisplay = () => {
        const lowerSearch = debouncedSearch.toLowerCase()
        const favoritesSet = new Set(favorites)

        const filteredCoins = allCoins
            ?.filter(
                (coin) =>
                    (coin.name.toLowerCase().includes(lowerSearch) ||
                        coin.symbol.toLowerCase().includes(lowerSearch)) &&
                    (!favoritesOnly ||
                        (favoritesOnly && favoritesSet.has(coin.symbol)))
            )
            .map((coin) => {
                return {
                    ...coin,
                    isFavorite: favoritesSet.has(coin.symbol),
                }
            })

        // Sorting the filtered coins

        return orderBy(filteredCoins, [sortField], [sortDir])
    }

    const handleSortChanged = (newField: string) => {
        if (newField === sortField) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
            return
        }

        setSortDir(newField === 'symbol' ? 'asc' : 'desc')
        setSortField(newField)
    }

    // React Query API data fetching

    const fetchCoins = () => axios(CoinList(currency))
    const { isLoading, isError, data } = useQuery(
        ['CoinsTable', currency],
        fetchCoins
    )
    const allCoins: ICoinsFromAPI[] = data?.data
    const coinsToDisplay: ICoinsInTable[] = setCoinsToDisplay()

    const pageSize = 8
    const maxLinks = 9
    const [buttonLabels, enableFwd, enableBack] = usePagination({
        pageNum,
        itemCount: coinsToDisplay.length,
        pageSize,
        maxLinks,
    })

    const handleCoinRowClicked = (id: string, symbol: string) => {
        if (favoriteCellClicked) {
            if (!user) {
                showToast({
                    id: `not-signed-in`,
                    description: 'Please sign in to create favorites.',
                    status: 'warning',
                    isClosable: true,
                })

                favoriteCellClicked = ''
                return
            }

            if (user?.uid) {
                updateDBFavorites({
                    userId: user.uid,
                    symbol,
                    bAdd: favoriteCellClicked === 'add',
                    bDocExists: favorites.length > 0,
                })
            }

            favoriteCellClicked = ''
            return
        }

        // Show coin detail page

        router.push(`/coin/${id}`)
    }

    const createTableColumnWidths = () => (
        <colgroup>
            <col style={{ width: '25%' }}></col>
            <col style={{ width: '10%' }}></col>
            <col style={{ width: '10%' }}></col>
            <col style={{ width: '10%' }}></col>
            <col style={{ width: '1%' }}></col>
        </colgroup>
    )
    const createTableHeader = () => {
        const fields = {
            symbol: 'Coin',
            current_price: 'Price',
            price_change_percentage_24h: '24h Change',
            market_cap: 'Market Cap',
        }

        return (
            <Thead>
                <Tr background="#EEBC1D" h="8" borderRadius="5">
                    {Object.entries(fields).map((field) => {
                        const iconSize: number = 4
                        return (
                            <Th
                                key={field[0]}
                                color="black"
                                textTransform="capitalize"
                                fontWeight="bold"
                                isNumeric={field[0] !== 'symbol'}
                                cursor="pointer"
                                onClick={() => handleSortChanged(field[0])}
                            >
                                {field[1]}
                                {sortField === field[0] &&
                                    (sortDir == 'asc' ? (
                                        <ChevronUpIcon
                                            h={iconSize}
                                            w={iconSize}
                                            ml="1"
                                        />
                                    ) : (
                                        <ChevronDownIcon
                                            h={iconSize}
                                            w={iconSize}
                                            ml="1"
                                        />
                                    ))}
                            </Th>
                        )
                    })}

                    <Th>
                        <StarIcon color="black" mb="1" ml="1" />
                    </Th>
                </Tr>
            </Thead>
        )
    }

    const createTableBody = () => {
        return (
            <Tbody>
                {coinsToDisplay
                    ?.slice(
                        (pageNum - 1) * pageSize,
                        (pageNum - 1) * pageSize + pageSize
                    )
                    .map((coin) => {
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
                                    handleCoinRowClicked(id, symbol)
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
                                            display={[
                                                'none',
                                                'inline',
                                                'inline',
                                            ]}
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
                                    <HStack
                                        spacing="0"
                                        justifyContent="flex-end"
                                    >
                                        {currencySymbol}
                                        <Text>
                                            {numberWithCommas(
                                                current_price.toFixed(2)
                                            )}
                                        </Text>
                                    </HStack>
                                </Td>

                                {/* {24hr Change Column } */}

                                <Td isNumeric color={loss ? 'red' : 'default'}>
                                    {priceChange24HoursDisplay}
                                </Td>

                                {/* {Market Cap Column } */}

                                <Td>
                                    <HStack
                                        spacing="0"
                                        justifyContent="flex-end"
                                    >
                                        {currencySymbol}
                                        <Text>
                                            {numberWithCommas(
                                                market_cap
                                                    .toString()
                                                    .slice(0, -6)
                                            )}
                                            &nbsp;M
                                        </Text>
                                    </HStack>
                                </Td>

                                {/* {Favorites Column } */}

                                <Td
                                    onClick={() => {
                                        favoriteCellClicked = isFavorite
                                            ? 'remove'
                                            : 'add'
                                    }}
                                >
                                    <HStack justifyContent="center" spacing="0">
                                        <StarIcon
                                            p="0"
                                            m="0"
                                            color={
                                                isFavorite
                                                    ? '#EEBC1D'
                                                    : 'default'
                                            }
                                        />
                                    </HStack>
                                </Td>
                            </Tr>
                        )
                    })}
            </Tbody>
        )
    }

    const createPaginationButtons = () => {
        if (!coinsToDisplay?.length) return null

        const disabledButtonStyle = {
            color: '#62656D',
            bgColor: '#222633',
            cursor: 'default',
            _hover: {},
        }

        const disabledButtonStyles = [
            enableBack ? {} : disabledButtonStyle,
            enableFwd ? {} : disabledButtonStyle,
        ]

        return (
            <HStack display="flex" pb={6} pt={2} justifyContent="space-between">
                <IconButton
                    aria-label="previous page"
                    size="xs"
                    {...disabledButtonStyles[0]}
                    _focus={{}}
                    icon={<ChevronLeftIcon />}
                    onClick={() => enableBack && setPageNum(pageNum - 1)}
                />

                {buttonLabels.map((label, i) => {
                    const isClickable = label !== '...'
                    const addDisabledStyles = isClickable
                        ? {}
                        : disabledButtonStyle
                    return (
                        <Button
                            key={i}
                            size="xs"
                            _focus={{}}
                            border="none"
                            bgColor={
                                label === String(pageNum)
                                    ? '#EEBC1D'
                                    : 'trasparent'
                            }
                            color={
                                label === String(pageNum) ? 'black' : 'white'
                            }
                            {...addDisabledStyles}
                            onClick={(e) => {
                                isClickable && setPageNum(Number(label))
                            }}
                        >
                            {label}
                        </Button>
                    )
                })}

                <IconButton
                    aria-label="next page"
                    size="xs"
                    {...disabledButtonStyles[1]}
                    _focus={{}}
                    icon={<ChevronRightIcon />}
                    onClick={() => enableFwd && setPageNum(pageNum + 1)}
                />
            </HStack>
        )
    }

    const noFavorites = () => {
        return (
            <VStack minH={['75px', null, '60px']} justifyContent="center">
                <Stack direction={['column', null, 'row']}>
                    <Text fontSize="sm">Your account has no favorites.</Text>

                    <Text
                        color="#EEBC1D"
                        cursor="pointer"
                        fontSize="sm"
                        onClick={() => {
                            setFavoritesOnly(false)
                        }}
                    >
                        Click here to display all coins.
                    </Text>
                </Stack>
            </VStack>
        )
    }

    // Show loading progress bar

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="12em"
            >
                <Progress
                    size="xs"
                    isIndeterminate
                    w="60%"
                    maxW="450px"
                    colorScheme="yellow"
                />
            </Box>
        )
    }

    return (
        <Box display="flex" justifyContent="center" mt="1">
            <VStack w="90%" maxW="800px">
                {/* { Search Box & Favorites Only Checkbox } */}

                <HStack w="100%" py="2" justifyContent="space-between">
                    <InputGroup w={['68%', '72%', '82%']}>
                        <Input
                            variant="outline"
                            value={search}
                            size="sm"
                            placeholder="Search for a Crypto Currency..."
                            borderRadius={5}
                            ref={searchField}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={(e) => {
                                if (searchField && searchField.current) {
                                    searchField.current.select()
                                }
                            }}
                        />
                        <InputRightElement>
                            <CloseIcon
                                mb="1.5"
                                fontSize="8pt"
                                cursor="pointer"
                                onClick={(e) => setSearch('')}
                            />
                        </InputRightElement>
                    </InputGroup>
                    <Checkbox
                        size="sm"
                        onChange={(e) => setFavoritesOnly(e?.target?.checked)}
                        isChecked={favoritesOnly}
                        isDisabled={!user}
                    >
                        Favorites Only
                    </Checkbox>
                </HStack>

                {/* Table with fade-in animation */}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1] }}
                    transition={{ duration: 0.24 }}
                    style={{ width: '100%' }}
                    key={sortField + sortDir + pageNum + currency}
                >
                    <Table size="sm" variant="simple">
                        {createTableColumnWidths()}
                        {createTableHeader()}
                        {createTableBody()}
                    </Table>
                </motion.div>
                {createPaginationButtons()}

                {/* User has no favorites */}

                {favoritesOnly && !favorites.length && noFavorites()}
            </VStack>
        </Box>
    )
}

export default CoinsTable
