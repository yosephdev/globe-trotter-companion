import { useEffect, useState } from 'react';
import { DollarSign, RefreshCw, ArrowRight } from 'lucide-react';

// Common currencies with symbols
const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [rates, setRates] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchRates = async () => {
    setLoading(true);
    // Mock data for demonstration
    setTimeout(() => {
      const mockRates: Record<string, number> = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.78,
        JPY: 150.56,
        CAD: 1.35,
        AUD: 1.52,
        CHF: 0.88,
        CNY: 7.24,
        INR: 83.12,
        SGD: 1.34
      };
      setRates(mockRates);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = rates ? (amount * (rates[toCurrency] / rates[fromCurrency] || 0)).toFixed(2) : '0.00';
  
  const getSymbol = (code: string) => {
    return CURRENCIES.find(currency => currency.code === code)?.symbol || '';
  };

  return (
    <div className="card">
      <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '2rem', 
              height: '2rem', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
            <span>Currency Converter</span>
          </div>
          <button 
            onClick={fetchRates} 
            className="btn btn-ghost btn-sm"
            style={{ 
              width: '2rem', 
              height: '2rem', 
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Refresh rates"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      <div className="card-content">
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem',
                color: 'var(--muted-foreground)'
              }}>
                From
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ flex: '1' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: 'white',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }} className="dark:bg-gray-800 dark:border-gray-700">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      min="0"
                      style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        backgroundColor: 'transparent'
                      }}
                      className="dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
                <select 
                  value={fromCurrency} 
                  onChange={(e) => setFromCurrency(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(0,0,0,0.1)',
                    backgroundColor: 'white',
                    outline: 'none',
                    width: '5rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {CURRENCIES.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'var(--muted-foreground)',
                marginTop: '0.25rem'
              }}>
                {CURRENCIES.find(c => c.code === fromCurrency)?.name}
              </p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <button 
                onClick={handleSwapCurrencies}
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease'
                }}
                className="dark:bg-gray-800 dark:border-gray-700"
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'rotate(180deg)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                marginBottom: '0.5rem',
                color: 'var(--muted-foreground)'
              }}>
                To
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ flex: '1' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }} className="dark:bg-gray-700 dark:border-gray-600">
                    <input
                      type="text"
                      value={`${getSymbol(toCurrency)} ${convertedAmount}`}
                      readOnly
                      style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        backgroundColor: 'transparent',
                        fontWeight: '600'
                      }}
                      className="dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <select 
                  value={toCurrency} 
                  onChange={(e) => setToCurrency(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(0,0,0,0.1)',
                    backgroundColor: 'white',
                    outline: 'none',
                    width: '5rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {CURRENCIES.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.code}
                    </option>
                  ))}
                </select>
              </div>
              <p style={{ 
                fontSize: '0.75rem', 
                color: 'var(--muted-foreground)',
                marginTop: '0.25rem'
              }}>
                {CURRENCIES.find(c => c.code === toCurrency)?.name}
              </p>
            </div>
          </div>
        </div>
        
        {lastUpdated && (
          <p style={{ 
            fontSize: '0.75rem', 
            color: 'var(--muted-foreground)',
            textAlign: 'right'
          }}>
            Last updated: {lastUpdated}
          </p>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;