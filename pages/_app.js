import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import Header from "../components/Header";
import theme from "../styles/theme";
import "react-alice-carousel/lib/alice-carousel.css";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { CategoryScale } from "chart.js/auto";
import { useEffect } from "react";
import { useStore } from "../config/store";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { CurrencyProvider } from "../config/CurrencyContext";

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();

  // Zustand Store

  const { user, setFavorites } = useStore();

  useEffect(() => {
    if (user) {
      const favoritesRef = doc(db, "favorites", user.uid);

      var unsubscribe = onSnapshot(favoritesRef, (res) => {
        if (res.exists()) {
          setFavorites(res.data().coins);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user, setFavorites]);

  return (
    <CurrencyProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Header />
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </CurrencyProvider>
  );
}

export default MyApp;
