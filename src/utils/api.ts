import { toast } from "@/components/ui/use-toast";

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to check if cache is valid
const isCacheValid = (key: string): boolean => {
  const item = cache.get(key);
  if (!item) return false;
  return Date.now() - item.timestamp < CACHE_DURATION;
};

// Helper for handling API errors
const handleApiError = (error: unknown, title: string): null => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error(`${title}:`, error);
  
  toast({
    title,
    description: errorMessage,
    variant: "destructive",
  });
  
  return null;
};

export const fetchWeatherData = async (city: string) => {
  const cacheKey = `weather-${city}`;
  
  // Return cached data if valid
  if (isCacheValid(cacheKey)) {
    return cache.get(cacheKey)?.data;
  }
  
  try {
    // Use real API in production, mock in development
    if (import.meta.env.PROD && import.meta.env.VITE_OPEN_WEATHER_API_KEY) {
      const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`,
        { signal: AbortSignal.timeout(10000) } // 10 second timeout
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } else {
      // Mock data for development
      const mockData = {
        name: city,
        main: { temp: 18, feels_like: 17, humidity: 65 },
        weather: [{ main: "Clear", description: "clear sky" }],
        wind: { speed: 3.5 }
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      cache.set(cacheKey, { data: mockData, timestamp: Date.now() });
      return mockData;
    }
  } catch (error) {
    return handleApiError(error, "Error fetching weather data");
  }
};

export const fetchWorldTime = async (timezone: string) => {
  try {
    // Use local time calculation to avoid API issues
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      timeZone: timezone === 'local' ? undefined : timezone,
      hour12: false,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = formatter.format(now);
    
    // Parse the formatted date back to create a datetime string
    const dateObj = new Date(formattedDate);
    
    return {
      datetime: dateObj.toISOString(),
      timezone: timezone
    };
  } catch (error) {
    return handleApiError(error, "Error fetching time data");
  }
};

export const fetchExchangeRates = async (base: string) => {
  const cacheKey = `exchange-${base}`;
  
  // Return cached data if valid
  if (isCacheValid(cacheKey)) {
    return cache.get(cacheKey)?.data;
  }
  
  try {
    // Use real API in production, mock in development
    if (import.meta.env.PROD) {
      const response = await fetch(
        `https://api.exchangerate.host/latest?base=${base}`,
        { signal: AbortSignal.timeout(10000) } // 10 second timeout
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Exchange rate API error: ${response.status}`);
      }
      
      const data = await response.json();
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } else {
      // Mock data for development
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
      
      // Adjust rates based on base currency
      const baseRate = mockRates[base] || 1;
      const rates: Record<string, number> = {};
      
      Object.entries(mockRates).forEach(([currency, rate]) => {
        rates[currency] = rate / baseRate;
      });
      
      const data = { base, rates };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    }
  } catch (error) {
    return handleApiError(error, "Error fetching exchange rates");
  }
};

// Clear cache periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, 60000); // Check every minute