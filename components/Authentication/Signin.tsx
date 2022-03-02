import { FormControl, Button, Input, HStack, VStack } from '@chakra-ui/react'
import { useState } from 'react'

const Signin = ({
    signInEmail,
    setSignInEmail,
    signInPassword,
    setSignInPassword,
    handleEmailAuth,
    handlePreForgotPassword,
    toggleSignInSignUp,
}: ISignIn) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <>
            <VStack w="100%">
                <FormControl>
                    <Input
                        placeholder="Enter Email"
                        type="email"
                        size="sm"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <Input
                        placeholder="Enter Password"
                        type={showPassword ? 'text' : 'password'}
                        size="sm"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                    />
                </FormControl>

                <Button
                    variant="ghost"
                    size="xs"
                    fontWeight="light"
                    _focus={{}}
                    onClick={() =>
                        setShowPassword((prevShowPassword) => !prevShowPassword)
                    }
                >{`${showPassword ? 'Hide' : 'Show'} Password`}</Button>
            </VStack>

            <Button
                bgColor="#EEBC1D"
                color="black"
                size="sm"
                onClick={handleEmailAuth}
                w="100%"
            >
                Sign In
            </Button>

            <HStack w="100%" justifyContent={'space-between'}>
                <Button
                    variant="ghost"
                    size="xs"
                    fontWeight="light"
                    onClick={handlePreForgotPassword}
                >
                    Forgot Password?
                </Button>

                <Button
                    variant="ghost"
                    size="xs"
                    onClick={toggleSignInSignUp}
                    fontWeight="light"
                >
                    Create Account
                </Button>
            </HStack>
        </>
    )
}

export default Signin
