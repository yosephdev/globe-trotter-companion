import { useEffect, useState, useCallback, FormEvent } from 'react';
import { Clock, AlertTriangle, PlusCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchWorldTime } from '@/utils/api';
import { Skeleton } from '@/components/ui/skeleton';

const WorldClock = () => {
  // General Loading for initial setup
  const [initialLoading, setInitialLoading] = useState(true);

  // Local Time
  const [localTime, setLocalTime] = useState<string>(new Date().toLocaleTimeString());

  // London Time (Default)
  const [londonTimezoneIdentifier, setLondonTimezoneIdentifier] = useState<string>("Europe/London");
  const [displayedLondonTime, setDisplayedLondonTime] = useState<string>('');

  // User-added Timezone
  const [userTimezoneInput, setUserTimezoneInput] = useState<string>('');
  const [userTimezoneIdentifier, setUserTimezoneIdentifier] = useState<string | null>(null);
  const [displayedUserTime, setDisplayedUserTime] = useState<string | null>(null);
  const [userTimezoneLoading, setUserTimezoneLoading] = useState<boolean>(false);
  const [userTimezoneError, setUserTimezoneError] = useState<string | null>(null);

  // Fetch London time once to validate/get full identifier
  useEffect(() => {
    const getInitialLondonTime = async () => {
      setInitialLoading(true);
      const data = await fetchWorldTime("Europe/London");
      if (data && data.timezone) {
        setLondonTimezoneIdentifier(data.timezone); // Store the validated timezone
      } else {
        // Handle error for London time if necessary, though it's a default
        console.error("Failed to fetch initial London time data.");
      }
      setInitialLoading(false);
    };
    getInitialLondonTime();
  }, []);

  // Interval for updating all clocks
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString());

      if (londonTimezoneIdentifier) {
        setDisplayedLondonTime(new Date().toLocaleTimeString("en-US", { timeZone: londonTimezoneIdentifier }));
      }

      if (userTimezoneIdentifier) {
        setDisplayedUserTime(new Date().toLocaleTimeString("en-US", { timeZone: userTimezoneIdentifier }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [londonTimezoneIdentifier, userTimezoneIdentifier]); // Re-run if identifiers change

  const handleAddTimezone = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userTimezoneInput.trim()) {
      setUserTimezoneError("Please enter a timezone (e.g., America/New_York).");
      return;
    }

    setUserTimezoneLoading(true);
    setUserTimezoneError(null);
    setUserTimezoneIdentifier(null); // Clear previous user timezone
    setDisplayedUserTime(null);

    const data = await fetchWorldTime(userTimezoneInput);

    if (data && data.timezone) {
      setUserTimezoneIdentifier(data.timezone);
      setUserTimezoneInput(''); // Clear input on success
    } else {
      setUserTimezoneError(`Failed to load timezone: "${userTimezoneInput}". Check format (e.g., America/New_York) or API key.`);
    }
    setUserTimezoneLoading(false);
  };

  if (initialLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm w-full max-w-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            World Clock
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm w-full max-w-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          World Clock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Local Time</p>
            <p className="text-2xl font-semibold">{localTime}</p>
          </div>
          {londonTimezoneIdentifier && (
            <div>
              <p className="text-sm text-muted-foreground truncate" title={londonTimezoneIdentifier}>
                {londonTimezoneIdentifier.split('/').pop()?.replace('_', ' ') || 'London'}
              </p>
              <p className="text-2xl font-semibold">{displayedLondonTime || <Skeleton className="h-8 w-32 mt-1" />}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleAddTimezone} className="flex gap-2 items-start">
          <Input
            type="text"
            value={userTimezoneInput}
            onChange={(e) => setUserTimezoneInput(e.target.value)}
            placeholder="e.g., America/New_York"
            className="flex-grow"
            disabled={userTimezoneLoading}
          />
          <Button type="submit" disabled={userTimezoneLoading} className="bg-green-500 hover:bg-green-600">
            {userTimezoneLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <PlusCircle className="h-5 w-5" />
            )}
            <span className="ml-2 sr-only">Add Timezone</span>
          </Button>
        </form>

        {userTimezoneLoading && (
           <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <Loader2 className="h-4 w-4 animate-spin" />
             <span>Loading timezone...</span>
           </div>
        )}

        {userTimezoneError && (
          <div className="text-red-600 bg-red-100 p-3 rounded-md flex items-center gap-2 text-sm">
            <AlertTriangle className="h-5 w-5" />
            <p>{userTimezoneError}</p>
          </div>
        )}

        {userTimezoneIdentifier && displayedUserTime && !userTimezoneError && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground truncate" title={userTimezoneIdentifier}>
              {userTimezoneIdentifier.split('/').pop()?.replace('_', ' ') || userTimezoneIdentifier}
            </p>
            <p className="text-2xl font-semibold">{displayedUserTime}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorldClock;