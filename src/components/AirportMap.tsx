import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
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

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

const center = {
  lat: 20,
  lng: 0,
};

const AirportMap = () => {
  const [selectedAirport, setSelectedAirport] = useState<typeof SAMPLE_AIRPORTS[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleMarkerClick = useCallback((airport: typeof SAMPLE_AIRPORTS[0]) => {
    setSelectedAirport(airport);
    toast({
      title: airport.name,
      description: `IATA Code: ${airport.code}`,
    });
  }, [toast]);

  const handleMapClick = useCallback(() => {
    setSelectedAirport(null);
  }, []);

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
          <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={2}
              center={center}
              onClick={handleMapClick}
              options={{
                styles: [
                  {
                    featureType: 'all',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#7c93a3' }],
                  },
                  {
                    featureType: 'administrative',
                    elementType: 'geometry',
                    stylers: [{ visibility: 'on' }],
                  },
                  {
                    featureType: 'water',
                    elementType: 'geometry.fill',
                    stylers: [{ color: '#d3d3d3' }],
                  },
                ],
              }}
            >
              {SAMPLE_AIRPORTS.map((airport) => (
                <Marker
                  key={airport.id}
                  position={{ lat: airport.lat, lng: airport.lng }}
                  onClick={() => handleMarkerClick(airport)}
                />
              ))}
              {selectedAirport && (
                <InfoWindow
                  position={{ lat: selectedAirport.lat, lng: selectedAirport.lng }}
                  onCloseClick={() => setSelectedAirport(null)}
                >
                  <div className="p-2">
                    <h3 className="font-medium">{selectedAirport.name}</h3>
                    <p className="text-sm text-gray-500">IATA: {selectedAirport.code}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        )}
      </CardContent>
    </Card>
  );
};

export default AirportMap;