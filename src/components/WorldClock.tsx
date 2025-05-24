import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchWorldTime } from '@/utils/api';
import { Skeleton } from '@/components/ui/skeleton';

const WorldClock = () => {
  const [localTime, setLocalTime] = useState<string>('');
  const [destinationTime, setDestinationTime] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTime = async () => {
      setLoading(true);
      const data = await fetchWorldTime('Europe/London'); // Default timezone
      if (data) {
        setDestinationTime(new Date(data.datetime).toLocaleTimeString());
      }
      setLocalTime(new Date().toLocaleTimeString());
      setLoading(false);
    };

    getTime();
    const interval = setInterval(getTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            World Clock
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          World Clock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Local Time</p>
            <p className="text-lg font-semibold">{localTime}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">London</p>
            <p className="text-lg font-semibold">{destinationTime}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldClock;