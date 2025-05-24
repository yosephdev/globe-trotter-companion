import { toast } from "@/components/ui/use-toast";

export const fetchWeatherData = async (city: string) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_OPEN_WEATHER_API_KEY}`);
    if (!response.ok) throw new Error('Weather data fetch failed');
    return await response.json();
  } catch (error) {
    toast({
      title: "Error fetching weather data",
      description: "Please try again later",
      variant: "destructive",
    });
    return null;
  }
};

export const fetchCurrencySymbols = async () => {
  try {
    // Using Frankfurter API for currency list as it doesn't require an API key for symbols
    const response = await fetch('https://api.frankfurter.app/currencies');
    if (!response.ok) {
      // Try to get error message from API response if available
      let errorDetails = `Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetails += `, Message: ${errorData.message || 'Unknown error'}`;
      } catch (e) {
        // Ignore if parsing error data fails
      }
      throw new Error(`Currency symbols fetch failed. ${errorDetails}`);
    }
    return await response.json();
  } catch (error: any) {
    toast({
      title: "Error fetching currency list",
      description: error.message || "Could not retrieve currency symbols. Please try again later.",
      variant: "destructive",
    });
    return null;
  }
};

export const fetchWorldTime = async (timezone: string) => {
  try {
    const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
    if (!response.ok) throw new Error('Time data fetch failed');
    return await response.json();
  } catch (error) {
    toast({
      title: "Error fetching time data",
      description: "Please try again later",
      variant: "destructive",
    });
    return null;
  }
};

export const fetchExchangeRates = async (base: string) => {
  try {
    const response = await fetch(`https://api.exchangerate.host/latest?base=${base}`);
    if (!response.ok) throw new Error('Exchange rate fetch failed');
    return await response.json();
  } catch (error) {
    toast({
      title: "Error fetching exchange rates",
      description: "Please try again later",
      variant: "destructive",
    });
    return null;
  }
};