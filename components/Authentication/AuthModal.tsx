import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
    Text,
    VStack,
} from '@chakra-ui/react'
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
} from 'firebase/auth'
import { useEffect, useState } from 'react'
import GoogleButton from 'react-google-button'
import { auth } from '../../config/firebase'
import { useStore } from '../../config/store'
import { showToast } from '../../config/utils'
import ForgotPassword from './ForgotPassword'
import Signin from './Signin'
import Signout from './Signout'
import Signup from './Signup'

enum Mode {
    SignIn = 'Sign In',
    SignUp = 'Create Account',
    ForgotPassword = 'Forgot Password',
}

function AuthModal() {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [mode, setMode] = useState<Mode>(Mode.SignIn)
    const [signInEmail, setSignInEmail] = useState('')
    const [signInPassword, setSignInPassword] = useState('')
    const [signUpEmail, setSignUpEmail] = useState('')
    const [signUpPassword, setSignUpPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')

    // Zustard Store

    const { user, setUser, clearFavorites, setFavoritesOnly } = useStore()

    const googleProvider = new GoogleAuthProvider()

    useEffect(() => {
        onAuthStateChanged(auth, (userFirebase) => {
            setUser(userFirebase)
            if (!userFirebase) {
                clearFavorites()
                setFavoritesOnly(false)
            }
        })
    }, [])

    useEffect(() => {}, [])

    const toggleSignInSignUp = () => {
        resetForm()
        setMode((prevMode) =>
            mode === Mode.SignIn ? Mode.SignUp : Mode.SignIn
        )
    }

    const handleCloseModal = () => {
        resetForm()
        setMode(Mode.SignIn)
        onClose()
    }

    const handlePostForgotPassword = () => {
        setSignInPassword('')
        setMode(Mode.SignIn)
    }

    const handlePreForgotPassword = () => {
        setForgotPasswordEmail(signInEmail)
        setMode(Mode.ForgotPassword)
    }

    const resetForm = () => {
        setSignInEmail('')
        setSignInPassword('')
        setSignUpEmail('')
        setSignUpPassword('')
        setConfirmPassword('')
        setForgotPasswordEmail('')
    }

    const alertEmptyFields = () => {
        showToast({
            title: `${mode} Error`,
            description: 'All fields are required',
            status: 'error',
            isClosable: true,
        })
    }

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            showToast({
                title: `${mode} Successful`,
                description: `Welcome ${result.user.email}!`,
                status: 'success',
                isClosable: true,
            })
            onClose()
        } catch (error: unknown) {
            let message: string = 'Unknown Error'
            if (error instanceof Error) message = error.message

            showToast({
                title: 'Unable to Sign Up',
                description: message,
                status: 'error',
                isClosable: true,
            })
        }
    }

    const handleResetPassword = async () => {
        try {
            const result = await sendPasswordResetEmail(
                auth,
                forgotPasswordEmail
            )
            showToast({
                title: 'Password Reset',
                description: `Password reset email was sent`,
                status: 'success',
                isClosable: true,
            })
        } catch (error: unknown) {
            let message: string = 'Unknown Error'
            if (error instanceof Error) message = error.message

            showToast({
                title: 'Password Reset Error',
                description: message,
                status: 'error',
                isClosable: true,
            })
        }
    }

    const handleEmailAuth = async () => {
        if (mode === Mode.SignIn) {
            if (!signInEmail || !signInPassword) {
                alertEmptyFields()
                return
            }

            try {
                const result = await signInWithEmailAndPassword(
                    auth,
                    signInEmail,
                    signInPassword
                )

                showToast({
                    title: 'Sign In Successful',
                    description: `Welcome ${result.user.email}`,
                    status: 'success',
                    isClosable: true,
                })
                onClose()
            } catch (error: unknown) {
                let message: string = 'Unknown Error'
                if (error instanceof Error) message = error.message

                showToast({
                    title: 'Unable to Sign In',
                    description: message,
                    status: 'error',
                    isClosable: true,
                })
            }
        }

        if (mode === Mode.SignUp) {
            if (!signUpEmail || !signUpPassword || !confirmPassword) {
                alertEmptyFields()
                return
            }

            if (signUpPassword !== confirmPassword) {
                showToast({
                    title: 'Registration Error',
                    description: 'Passwords do not match',
                    status: 'error',
                    isClosable: true,
                })
                return
            }

            try {
                const result = await createUserWithEmailAndPassword(
                    auth,
                    signUpEmail,
                    signUpPassword
                )

                showToast({
                    description: `Welcome ${result.user.email}`,
                    status: 'success',
                    isClosable: true,
                })
                onClose()
            } catch (error: unknown) {
                let message: string = 'Unknown Error'

                if (error instanceof Error) message = error.message

                showToast({
                    title: 'Registration Error',
                    description: message,
                    status: 'error',
                    isClosable: true,
                })
            }
        }
    }

    return (
        <>
            {/* Display Sign In or Avatar/Sign Out */}

            {user ? (
                <Signout />
            ) : (
                <Button
                    onClick={onOpen}
                    size="sm"
                    color="black"
                    bgColor="#EEBC1D"
                >
                    Sign In
                </Button>
            )}

            <Modal isOpen={isOpen} onClose={handleCloseModal} size="xs">
                <ModalOverlay />
                <ModalContent>
                    <ModalBody
                        paddingTop="4"
                        paddingBottom="6"
                        display="flex"
                        justifyContent="center"
                    >
                        <VStack
                            w="89%"
                            justifyContent="space-between"
                            spacing="4"
                        >
                            <Text>{mode}</Text>

                            {mode === Mode.SignIn && (
                                <Signin
                                    signInEmail={signInEmail}
                                    setSignInEmail={setSignInEmail}
                                    signInPassword={signInPassword}
                                    setSignInPassword={setSignInPassword}
                                    handleEmailAuth={handleEmailAuth}
                                    handlePreForgotPassword={
                                        handlePreForgotPassword
                                    }
                                    toggleSignInSignUp={toggleSignInSignUp}
                                />
                            )}

                            {mode === Mode.SignUp && (
                                <Signup
                                    signUpEmail={signUpEmail}
                                    setSignUpEmail={setSignUpEmail}
                                    signUpPassword={signUpPassword}
                                    setSignUpPassword={setSignUpPassword}
                                    confirmPassword={confirmPassword}
                                    setConfirmPassword={setConfirmPassword}
                                    handleEmailAuth={handleEmailAuth}
                                    toggleSignInSignUp={toggleSignInSignUp}
                                />
                            )}

                            {mode === Mode.ForgotPassword && (
                                <ForgotPassword
                                    forgotPasswordEmail={forgotPasswordEmail}
                                    setForgotPasswordEmail={
                                        setForgotPasswordEmail
                                    }
                                    handleResetPassword={handleResetPassword}
                                    handlePostForgotPassword={
                                        handlePostForgotPassword
                                    }
                                />
                            )}
                            <Text fontSize="xs" pt="0">
                                or...
                            </Text>
                            <GoogleButton onClick={signInWithGoogle} />
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AuthModal
