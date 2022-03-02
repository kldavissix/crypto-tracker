import create from 'zustand'
import { getCookie } from 'cookies-next'
import { FaDollarSign, FaEuroSign } from 'react-icons/fa'

// Get the previous value of currency from cookie

const cookieCurrency: string = getCookie('cur') as string

const initialCurrency: string = ['usd', 'eur'].includes(cookieCurrency)
    ? cookieCurrency
    : 'usd'

const initialCurrencySymbol =
    initialCurrency === 'eur' ? <FaEuroSign /> : <FaDollarSign />

export const useStore = create<ICryptoStore>((set) => ({
    user: null,
    setUser: (newUser) => set({ user: newUser }),
    currency: initialCurrency,
    setCurrency: (newCurrency) => {
        set({ currency: newCurrency })
        set({
            currencySymbol:
                newCurrency === 'eur' ? <FaEuroSign /> : <FaDollarSign />,
        })
    },
    currencySymbol: initialCurrencySymbol,
    search: '',
    setSearch: (newSearch) => set({ search: newSearch }),
    pageNum: 1,
    setPageNum: (newNum) => set(() => ({ pageNum: newNum })),
    sortField: 'market_cap',
    setSortField: (newSortField) => set({ sortField: newSortField }),
    sortDir: 'desc',
    setSortDir: (newSortDir) => set({ sortDir: newSortDir }),
    chartDays: 1,
    setChartDays: (newChartDays) => set({ chartDays: newChartDays }),
    favorites: [],
    setFavorites: (newFavorites) => set({ favorites: newFavorites }),
    clearFavorites: () => set({ favorites: [] }),
    favoritesOnly: false,
    setFavoritesOnly: (newFavoritesOnly) =>
        set({ favoritesOnly: newFavoritesOnly }),
}))
