import { HStack, Text, VStack } from '@chakra-ui/react'
import { WarningTwoIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'

const NotFound = ({ type }: INotFound) => {
    const router = useRouter()

    return (
        <HStack h="180px" bgColor="default" justifyContent="center">
            <WarningTwoIcon color="#EEBC1D" fontSize="xxx-large" mr="2" />
            <VStack ml="2" alignItems="flex-start">
                <Text fontSize="sm">
                    The {type || 'page'} you&apos;re looking for was not found.
                </Text>

                <Text
                    color="#EEBC1D"
                    cursor="pointer"
                    fontSize="sm"
                    onClick={() => router.replace('/')}
                >
                    Click here to return to the home page.
                </Text>
            </VStack>
        </HStack>
    )
}

export default NotFound
