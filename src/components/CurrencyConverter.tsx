import { useEffect, useState, useCallback } from 'react';
import { DollarSign, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchExchangeRates, fetchCurrencySymbols } from '@/utils/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Currency {
  code: string;
  name: string;
}

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>(''); // Initialize empty, set after fetch
  const [toCurrency, setToCurrency] = useState<string>('');   // Initialize empty, set after fetch
  
  const [rates, setRates] = useState<any>(null);
  const [ratesLoading, setRatesLoading] = useState<boolean>(true); // For fetching exchange rates

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currenciesLoading, setCurrenciesLoading] = useState<boolean>(true);
  const [currenciesError, setCurrenciesError] = useState<string | null>(null);
  const [ratesError, setRatesError] = useState<string | null>(null);

  // Fetch currency symbols on mount
  useEffect(() => {
    const loadCurrencySymbols = async () => {
      setCurrenciesLoading(true);
      setCurrenciesError(null);
      const symbolsData = await fetchCurrencySymbols();
      if (symbolsData) {
        const currencyArray: Currency[] = Object.entries(symbolsData).map(([code, name]) => ({
          code,
          name: name as string,
        }));
        setCurrencies(currencyArray);
        // Set default currencies only after symbols are loaded
        if (currencyArray.length > 0) {
          // Check if USD and EUR exist, otherwise use first two available
          const defaultFrom = currencyArray.find(c => c.code === 'USD') ? 'USD' : currencyArray[0]?.code;
          const defaultTo = currencyArray.find(c => c.code === 'EUR') ? 'EUR' : currencyArray[1]?.code || currencyArray[0]?.code;
          
          if (defaultFrom) setFromCurrency(defaultFrom);
          if (defaultTo) setToCurrency(defaultTo);
        }
      } else {
        setCurrenciesError("Could not load currency list. Please try again later.");
        // Fallback to minimal hardcoded list if API fails
        const fallbackCurrencies = [
          { code: 'USD', name: 'US Dollar' },
          { code: 'EUR', name: 'Euro' },
          { code: 'GBP', name: 'British Pound' },
        ];
        setCurrencies(fallbackCurrencies);
        setFromCurrency('USD');
        setToCurrency('EUR');
      }
      setCurrenciesLoading(false);
    };
    loadCurrencySymbols();
  }, []);

  // Fetch exchange rates when fromCurrency changes (and is valid)
  useEffect(() => {
    if (!fromCurrency) return; // Don't fetch if fromCurrency isn't set yet

    const getRates = async () => {
      setRatesLoading(true);
      setRatesError(null); // Clear previous rates error
      const data = await fetchExchangeRates(fromCurrency);
      if (data && data.rates) {
        setRates(data.rates);
      } else {
        setRates(null); // Clear old rates
        setRatesError(`Could not fetch exchange rates for ${fromCurrency}. The API might be down or the currency is not supported by the provider.`);
        // The toast notification for this error is handled in api.ts by fetchExchangeRates
      }
      setRatesLoading(false);
    };

    getRates();
  }, [fromCurrency]);

  const convertedAmount = rates && rates[toCurrency] ? (amount * rates[toCurrency]).toFixed(2) : '0.00';

  // Combined loading state for initial display
  const initialLoading = currenciesLoading || (ratesLoading && !rates);


  if (initialLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm w-full max-w-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Currency Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-2" />
            <p className="text-muted-foreground">Loading converter...</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm w-full max-w-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currenciesError && !currenciesLoading && (
          <div className="mb-4 text-red-600 bg-red-100 p-3 rounded-md flex items-center gap-2 text-sm">
            <AlertTriangle className="h-5 w-5" />
            <p>{currenciesError} Using fallback currencies.</p>
          </div>
        )}

        {ratesError && !ratesLoading && (
          <div className="mb-4 text-orange-600 bg-orange-100 p-3 rounded-md flex items-center gap-2 text-sm">
            <AlertTriangle className="h-5 w-5" />
            <p>{ratesError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="0"
              className="text-lg"
              disabled={currencies.length === 0 || !fromCurrency || !toCurrency}
            />
            <Select 
              value={fromCurrency} 
              onValueChange={setFromCurrency}
              disabled={currencies.length === 0 || currenciesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="From currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code} title={currency.name}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Input 
              type="text" 
              value={ratesLoading && fromCurrency ? 'Loading...' : convertedAmount} 
              readOnly 
              className="text-lg bg-gray-100"
              disabled={currencies.length === 0 || !fromCurrency || !toCurrency}
            />
            <Select 
              value={toCurrency} 
              onValueChange={setToCurrency}
              disabled={currencies.length === 0 || currenciesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="To currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code} title={currency.name}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {ratesLoading && fromCurrency && (
          <div className="mt-2 text-sm text-muted-foreground flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Fetching exchange rates for {fromCurrency}...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;