import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Sample airport data (we can replace this with API data later)
const SAMPLE_AIRPORTS = [
  { id: 1, name: "London Heathrow", code: "LHR", lat: 51.4700, lng: -0.4543 },
  { id: 2, name: "John F. Kennedy", code: "JFK", lat: 40.6413, lng: -73.7781 },
  { id: 3, name: "Tokyo Narita", code: "NRT", lat: 35.7720, lng: 140.3929 },
];

const AirportMap = () => {
  const [selectedAirport, setSelectedAirport] = useState<typeof SAMPLE_AIRPORTS[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAirportClick = (airport: typeof SAMPLE_AIRPORTS[0]) => {
    setSelectedAirport(airport);
    toast({
      title: airport.name,
      description: `IATA Code: ${airport.code}`,
    });
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Airport Map</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Airport Map</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="relative w-full h-[400px] bg-gray-100 rounded-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Map integration coming soon...</p>
            </div>
            {/* Display airport list temporarily */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                {SAMPLE_AIRPORTS.map((airport) => (
                  <button
                    key={airport.id}
                    onClick={() => handleAirportClick(airport)}
                    className="text-left p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="font-medium">{airport.name}</span>
                    <span className="ml-2 text-sm text-gray-500">({airport.code})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AirportMap;