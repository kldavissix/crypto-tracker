import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import firebaseConfig from './firebaseConfig'
import {
    getFirestore,
    arrayRemove,
    arrayUnion,
    doc,
    updateDoc,
    setDoc,
} from 'firebase/firestore'
import { showToast } from './utils'

const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

export { auth, db }

export const updateDBFavorites = async ({userId, symbol, bAdd, bDocExists} : IUpdateDBFavorites) => {
    const favoritesDocRef = doc(db, 'favorites', userId)

    try {
        if(bDocExists) {

            // Update existing doc
            await updateDoc(favoritesDocRef, {
                coins: bAdd ? arrayUnion(symbol) : arrayRemove(symbol),
            })
        }
        else {
            // Add new doc 
            await setDoc(favoritesDocRef, {coins: [symbol]} )
        }

    } catch (error: unknown) {
        let message: string = 'Unknown Error'

        if (error instanceof Error) message = error.message

        showToast({
            title: 'Error',
            description: 'Unable to Update Favorite',
            status: 'error',
            isClosable: true
        })
    }
}
