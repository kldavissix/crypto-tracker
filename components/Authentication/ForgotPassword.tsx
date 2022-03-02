import { Box, Button, FormControl, Input } from '@chakra-ui/react'
import React from 'react'

const ForgotPassword = ({
    forgotPasswordEmail,
    setForgotPasswordEmail,
    handlePostForgotPassword,
    handleResetPassword,
}: IForgotPassword) => {
    return (
        <>
            <FormControl>
                <Input
                    placeholder="Enter Email"
                    type="email"
                    size="sm"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                />
            </FormControl>

            <Button
                bgColor="#EEBC1D"
                color="black"
                size="sm"
                onClick={handleResetPassword}
                w="100%"
            >
                Request Password Reset Email
            </Button>

            <Button
                variant="ghost"
                size="xs"
                onClick={handlePostForgotPassword}
                fontWeight="light"
            >
                Return to Sign In
            </Button>
        </>
    )
}

export default ForgotPassword
