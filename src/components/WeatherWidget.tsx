import { useEffect, useState, useCallback } from 'react';
import { Cloud, Sun, Thermometer, AlertTriangle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchWeatherData } from '@/utils/api';
import { Skeleton } from '@/components/ui/skeleton';

const WeatherWidget = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cityInput, setCityInput] = useState('London');
  const [currentCityDisplay, setCurrentCityDisplay] = useState('London'); // City for which weather is shown
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

  const handleFetchWeather = useCallback(async (cityToFetch: string) => {
    if (!apiKey) {
      setErrorMessage("OpenWeather API key is missing. Please set VITE_OPEN_WEATHER_API_KEY in your environment.");
      setLoading(false);
      setWeather(null);
      return;
    }
    if (!cityToFetch.trim()) {
      setErrorMessage("Please enter a city name.");
      setWeather(null); // Clear any old weather data
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    // We only update currentCityDisplay when a fetch is successful or if it's a new valid attempt
    // This prevents the display name from changing if the input is then cleared and an error occurs.

    const data = await fetchWeatherData(cityToFetch);

    if (data && data.cod === 200) { // OpenWeatherMap uses 'cod: 200' for success
      setWeather(data);
      setCurrentCityDisplay(cityToFetch); // Update displayed city name
    } else {
      setWeather(null); // Clear old data
      const errorReason = data?.message || "Ensure the API key is set and the city is correct.";
      setErrorMessage(`Could not load weather for "${cityToFetch}". ${errorReason}`);
      // Do not change currentCityDisplay here, keep the last successful city name
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Fetch for the initial default city on mount
    handleFetchWeather(currentCityDisplay);
  }, [handleFetchWeather]); // handleFetchWeather is memoized with useCallback

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleFetchWeather(cityInput);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Sun className="h-6 w-6 text-yellow-500" />
          Weather - {currentCityDisplay}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Enter city name"
            className="flex-grow"
          />
          <Button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600">
            {loading ? <Skeleton className="h-5 w-5 rounded-full animate-spin" /> : <Search className="h-5 w-5" />}
            <span className="ml-2 sr-only">Search</span>
          </Button>
        </form>

        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {errorMessage && !loading && (
          <div className="text-red-600 bg-red-100 p-3 rounded-md flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {weather && !errorMessage && !loading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2 font-medium">
                <Thermometer className="h-6 w-6 text-red-500" />
                <span>{weather.main?.temp?.toFixed(1) ?? 'N/A'}°C</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Feels like: {weather.main?.feels_like?.toFixed(1) ?? 'N/A'}°C</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-md capitalize">
              <Cloud className="h-5 w-5 text-blue-500" />
              <span>{weather.weather?.[0]?.description ?? 'N/A'}</span>
            </div>
            <div className="text-sm text-gray-500 grid grid-cols-2 gap-x-4 gap-y-1 pt-2">
              <span>Humidity: {weather.main?.humidity ?? 'N/A'}%</span>
              <span>Pressure: {weather.main?.pressure ?? 'N/A'} hPa</span>
              <span>Wind: {weather.wind?.speed ?? 'N/A'} m/s</span>
              {weather.visibility && <span>Visibility: {(weather.visibility / 1000).toFixed(1)} km</span>}
            </div>
          </div>
        )}
         {!weather && !errorMessage && !loading && (
          <p className="text-gray-500">Enter a city to get the latest weather forecast.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;