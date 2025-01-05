import { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchExchangeRates } from '@/utils/api';
import { Skeleton } from '@/components/ui/skeleton';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [rates, setRates] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRates = async () => {
      setLoading(true);
      const data = await fetchExchangeRates(fromCurrency);
      setRates(data?.rates);
      setLoading(false);
    };

    getRates();
  }, [fromCurrency]);

  const convertedAmount = rates ? (amount * (rates[toCurrency] || 0)).toFixed(2) : '0.00';

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Currency Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="0"
            />
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Input type="number" value={convertedAmount} readOnly />
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;