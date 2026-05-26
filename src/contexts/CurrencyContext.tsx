import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { companyService } from '../services/api';

interface CurrencyContextValue {
  currencyCode: string;
  formatCurrency: (val?: number | null) => string;
  refreshCurrency: () => void;
}

const DEFAULT_CURRENCY = 'GBP';

const CurrencyContext = createContext<CurrencyContextValue>({
  currencyCode: DEFAULT_CURRENCY,
  formatCurrency: (val) => (val != null ? `£${val.toFixed(2)}` : '—'),
  refreshCurrency: () => {},
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY);

  const fetchCurrency = useCallback(() => {
    companyService
      .getProfile()
      .then((res) => {
        if (res.data?.currency) setCurrencyCode(res.data.currency);
      })
      .catch((err: unknown) => {
        console.warn('[CurrencyContext] Failed to fetch currency, using default:', err);
      });
  }, []);

  useEffect(() => {
    fetchCurrency();
  }, [fetchCurrency]);

  const formatCurrency = useCallback(
    (val?: number | null): string => {
      if (val == null) return '—';
      try {
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(val);
      } catch {
        return val.toFixed(2);
      }
    },
    [currencyCode]
  );

  return (
    <CurrencyContext.Provider value={{ currencyCode, formatCurrency, refreshCurrency: fetchCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};
