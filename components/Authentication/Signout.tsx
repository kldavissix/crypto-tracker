import {
    Avatar,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@chakra-ui/react'
import { signOut } from 'firebase/auth'
import React from 'react'
import { auth } from '../../config/firebase'
import { useStore } from '../../config/store'
import { showToast } from '../../config/utils'

const Signout = () => {
    const { user } = useStore()

    const handleSignOut = () => {
        signOut(auth)
        showToast({
            title: '',
            description: 'Sign Out Successful!',
            status: 'success',
            isClosable: true,
        })
    }

    return (
        <>
            <Popover>
                <PopoverTrigger>
                    <Avatar
                        size="sm"
                        src={user?.photoURL || ''}
                        cursor="pointer"
                    ></Avatar>
                </PopoverTrigger>
                <PopoverContent
                    w="85px"
                    textAlign="center"
                    cursor="pointer"
                    onClick={handleSignOut}
                >
                    Sign Out
                </PopoverContent>
            </Popover>
        </>
    )
}

export default Signout
