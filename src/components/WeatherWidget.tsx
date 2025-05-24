import { useEffect, useState } from 'react';
import { Cloud, Sun, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchWeatherData } from '@/utils/api';
import { Skeleton } from '@/components/ui/skeleton';

const WeatherWidget = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      const data = await fetchWeatherData('London'); // Default city
      setWeather(data);
      setLoading(false);
    };

    getWeather();
  }, []);

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" />
            Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Sun className="h-5 w-5 text-yellow-500" />
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <span>{weather?.main?.temp ?? 'N/A'}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-blue-500" />
            <span>{weather?.weather?.[0]?.description ?? 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;