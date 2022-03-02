import { createStandaloneToast } from '@chakra-ui/react'
import { FaDollarSign, FaEuroSign } from 'react-icons/fa'
// import { v4 as uuidv4 } from 'uuid'
// npm install --save-dev @types/uuid

export const numberWithCommas = (x: string) =>
    x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const isObject = (obj: unknown) => {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

export const currencySymbol = (currency = 'usd', size = '1em') => {
    return currency == 'usd' ? (
        <FaDollarSign size={size} />
    ) : (
        <FaEuroSign size={size} />
    )
}

export const showToast = (toastConfig: IToastConfig) => {
    const toast = createStandaloneToast()
    if (toastConfig.id && toast.isActive(toastConfig.id)) return
    toast(toastConfig)
}
