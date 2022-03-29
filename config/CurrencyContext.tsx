import React, { createContext, useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { FaDollarSign, FaEuroSign } from "react-icons/fa";

// Get the previous value of currency from cookie

const cookieCurrency: string = getCookie("cur") as string;

const initialCurrency: TCurrency = ["usd", "eur"].includes(cookieCurrency)
  ? (cookieCurrency as TCurrency)
  : "usd";

const initialCurrencySymbol =
  initialCurrency === "eur" ? <FaEuroSign /> : <FaDollarSign />;

export const CurrencyContext = createContext<ICurrencyContext | null>(null);

export const CurrencyProvider = ({
  children,
}: CurrencyContextProviderProps) => {
  const [ctxCurrency, setCtxCurrency] = useState<TCurrency>(initialCurrency);
  const [ctxCurrencyIcon, setCtxCurrencyIcon] = useState<unknown>(
    <FaDollarSign />
  );

  // Set currency Icon to match currency

  useEffect(() => {
    setCtxCurrencyIcon(
      ctxCurrency === "usd" ? <FaDollarSign /> : <FaEuroSign />
    );
  }, [ctxCurrency]);

  return (
    <CurrencyContext.Provider
      value={{ ctxCurrency, setCtxCurrency, ctxCurrencyIcon }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
