import { HStack, Box, Select, Text } from '@chakra-ui/react'
import { setCookies } from 'cookies-next'
import { useRouter } from 'next/router'
import { useRef, useEffect } from 'react'
import { useStore } from '../config/store'
import { motion } from 'framer-motion'

import AuthModal from './Authentication/AuthModal'

const Header = () => {
    const router = useRouter()

    // Zustard Store

    const { currency, setCurrency } = useStore()

    const currencySelectBox = useRef<HTMLSelectElement>(null)

    // Make currency "sticky"
    // Force select box display update & save currency value to cookie
    // Regular binding wouldn't work on page load

    useEffect(() => {
        setCookies('cur', currency)
        if (currencySelectBox && currencySelectBox.current) {
            currencySelectBox.current.value = currency
        }
    }, [currency])

    return (
        <Box display="flex" justifyContent="center">
            <HStack
                justifyContent="space-between"
                px="5"
                py="2"
                w="90%"
                maxW="800px"
            >
                {/* Header Home Logo */}

                <Box onClick={() => router.push('/')} cursor="pointer">
                    <motion.div
                        whileHover={{
                            scale: 1.04,
                            transition: {
                                duration: 0.2,
                            },
                        }}
                    >
                        <Text color="#EEBC1D" fontSize="xl" fontWeight="bold">
                            Crypto Tracker
                        </Text>
                    </motion.div>
                </Box>

                {/* Currency + Sign In & Out  */}

                <HStack>
                    <Select
                        w="50"
                        onChange={(e) => {
                            setCurrency(e.target.value)
                        }}
                        ref={currencySelectBox}
                    >
                        <option value="usd" label="USD" />
                        <option value="eur" label="EUR" />
                    </Select>

                    <AuthModal />
                </HStack>
            </HStack>
        </Box>
    )
}

export default Header
