import { toast } from "@/components/ui/use-toast";

export const fetchWeatherData = async (city: string) => {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPEN_WEATHER_API_KEY}`);
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