import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WorldClock = () => {
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
            <p className="text-lg font-semibold">12:00 PM</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Destination</p>
            <p className="text-lg font-semibold">8:00 PM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorldClock;