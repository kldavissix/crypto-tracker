import { FormControl, Button, Input, VStack } from '@chakra-ui/react'
import { useState } from 'react'

const Signup = ({
    signUpEmail,
    setSignUpEmail,
    signUpPassword,
    setSignUpPassword,
    confirmPassword,
    setConfirmPassword,
    handleEmailAuth,
    toggleSignInSignUp,
}: ISignUp) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <>
            <VStack w="100%">
                <FormControl>
                    <Input
                        placeholder="Enter Email"
                        type="email"
                        size="sm"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <Input
                        placeholder="Enter Password"
                        type={showPassword ? 'text' : 'password'}
                        size="sm"
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                    />
                </FormControl>

                <FormControl>
                    <Input
                        placeholder="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        size="sm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                >
                    {`${showPassword ? 'Hide' : 'Show'} Passwords`}
                </Button>
            </VStack>

            <Button
                bgColor="#EEBC1D"
                color="black"
                size="sm"
                onClick={handleEmailAuth}
                w="100%"
            >
                Create Account
            </Button>

            <Button
                variant="ghost"
                size="xs"
                onClick={toggleSignInSignUp}
                fontWeight="light"
            >
                Already have an account? Click here.
            </Button>
        </>
    )
}

export default Signup
