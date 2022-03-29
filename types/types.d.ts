type SortDir = "asc" | "desc";

interface IUser {
  uid: string | null;
  email: string | null;
  photoURL: string | null;
}

interface ICryptoStore {
  user: IUser | null;
  setUser: (newUser: IUser | null) => void;
  search: string;
  setSearch: (newSearch: string) => void;
  pageNum: number;
  setPageNum: (newNum: number) => void;
  sortField: string;
  setSortField: (newSortField: string) => void;
  sortDir: SortDir;
  setSortDir: (newSortDir: SortDir) => void;
  favorites: string[];
  setFavorites: (newFavorites: string[]) => void;
  clearFavorites: () => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (newFavoritesOnly: boolean) => void;
  windowWidth: number;
  setWindowWidth: (newWindowWidth: number) => void;
  windowHeight: number;
  setWindowHeight: (newWindowHeight: number) => void;
  pageSize: number;
  setPageSize: (newPageSize: number) => void;
}

interface IUpdateDBFavorites {
  userId: string;
  symbol: string;
  bAdd: boolean;
  bDocExists: boolean;
}

interface ITrendingCoin {
  id: string;
  symbol: string;
  image: string;
  name: string;
  price_change_percentage_24h: number;
  current_price: number;
}

interface ICarousel {
  trendingCoins: TrendingCoin[];
  currency: string;
  currencySymbol: unknown;
  isLoading: boolean;
  isError: boolean;
  windowHeight: number;
}

interface ICoinsFromAPI {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

interface ICoinsInTable extends ICoinsFromAPI {
  isFavorite: boolean;
}

interface IUseDebounce {
  value: any;
  delay: number;
}

interface IUsePagination {
  pageNum: number;
  itemCount: number;
  pageSize: number;
  maxLinks: number;
}

interface ICoinDetail {
  coinData: ICoinData;
  chartData: [number, number][];
  marketCapRank: number;
  currentPrice: number;
  marketCap: number;
  days: number;
}

interface ICoinData {
  id: string;
  symbol: string;
  image: {
    large: string;
  };
  name: string;
  description: {
    en: string;
  };
  links: {
    homepage: string[];
  };
}

interface ISignIn {
  signInEmail: string;
  setSignInEmail: (val: string) => void;
  signInPassword: string;
  setSignInPassword: (val: string) => void;
  handleEmailAuth: () => void;
  handlePreForgotPassword: () => void;
  toggleSignInSignUp: () => void;
}

interface ISignUp {
  signUpEmail: string;
  setSignUpEmail: (val: string) => void;
  signUpPassword: string;
  setSignUpPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  handleEmailAuth: () => void;
  toggleSignInSignUp: () => void;
}

interface IForgotPassword {
  forgotPasswordEmail: string;
  setForgotPasswordEmail: (val: string) => void;
  handleResetPassword: () => void;
  handlePostForgotPassword: () => void;
}

interface INotFound {
  type: string | null;
}

interface IToastConfig {
  id?: string;
  title?: string;
  description: string;
  status: "success" | "warning" | "error" | undefined;
  isClosable: boolean;
}

interface ICoinsTableRows {
  coins: ICoinsInTable[];
  handleCoinRowClicked: (
    id: string,
    symbol: string,
    favoriteAction: string
  ) => void;
}

interface ICurrencyContext {
  ctxCurrency: TCurrency;
  setCtxCurrency: (c: TCurrency) => void;
  ctxCurrencyIcon: unknown;
}

type TCurrency = "usd" | "eur";
type CurrencyContextProviderProps = {
  children: React.ReactNode;
};
