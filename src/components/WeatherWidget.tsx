import { Cloud, Sun, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WeatherWidget = () => {
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
            <span>24°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-blue-500" />
            <span>Partly Cloudy</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;