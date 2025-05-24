import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import allAirportsData from '../data/airports.json'; // Import the new airport list

interface Airport {
  id: number;
  name: string;
  code: string;
  lat: number;
  lng: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

const initialCenter = {
  lat: 20, // Centered more globally
  lng: 0,
};

const AirportMap = () => {
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>(allAirportsData);

  const { toast } = useToast();

  // Memoize the airport data to prevent re-parsing on every render
  const airports = useMemo(() => allAirportsData as Airport[], []);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (!lowerSearchTerm) {
      setFilteredAirports(airports); // Show all if search is empty
    } else {
      const results = airports.filter(
        (airport) =>
          airport.name.toLowerCase().includes(lowerSearchTerm) ||
          airport.code.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredAirports(results);
    }
  }, [searchTerm, airports]);

  const handleMarkerClick = useCallback((airport: Airport) => {
    setSelectedAirport(airport);
    if (mapInstance) {
        mapInstance.panTo({ lat: airport.lat, lng: airport.lng });
    }
    toast({
      title: airport.name,
      description: `IATA Code: ${airport.code}`,
    });
  }, [toast, mapInstance]);

  const handleMapClick = useCallback(() => {
    setSelectedAirport(null);
  }, []);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Airport Map</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Google Maps API key is missing. Please configure VITE_GOOGLE_MAPS_API_KEY.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Function to handle map load and store map instance
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapInstance(map);
  }, []);


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Airport Map</CardTitle>
        <div className="mt-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search airports (e.g., London, LAX)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
      </CardHeader>
      <CardContent>
        <LoadScript googleMapsApiKey={googleMapsApiKey} loadingElement={<div className="flex items-center justify-center h-[400px]"><Loader2 className="h-8 w-8 animate-spin" /> <span className="ml-2">Loading Map...</span></div>}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={2} // Initial zoom to show a global view
            center={initialCenter}
            onClick={handleMapClick}
            onLoad={onMapLoad} // Store map instance
            options={{
              styles: [ // Basic styling, can be expanded
                { featureType: 'poi', stylers: [{ visibility: 'off' }] }, // Hide points of interest
                { featureType: 'transit', stylers: [{ visibility: 'off' }] }, // Hide transit stations
                {
                  featureType: 'road',
                  elementType: 'labels.icon',
                  stylers: [{ visibility: 'off' }],
                }, // Hide road icons
                 {
                    featureType: 'all',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#7c93a3' }], // Default label color
                  },
                  { // Example: Darker water for contrast
                    featureType: 'water',
                    elementType: 'geometry.fill',
                    stylers: [{ color: '#AEB8C2' }], // A muted blue/grey
                  },
                  { // Example: Lighter landmass
                    featureType: 'landscape',
                    elementType: 'geometry.fill',
                    stylers: [{ color: '#F0F0F0' }], // A very light grey
                  },
              ],
              mapTypeControl: false, // Disable map type (Satellite/Terrain) control
              streetViewControl: false, // Disable Street View control
              fullscreenControl: false, // Disable fullscreen control
            }}
          >
            {filteredAirports.map((airport) => (
              <Marker
                key={airport.id}
                position={{ lat: airport.lat, lng: airport.lng }}
                onClick={() => handleMarkerClick(airport)}
                title={airport.name} // Tooltip on hover
              />
            ))}
            {selectedAirport && (
              <InfoWindow
                position={{ lat: selectedAirport.lat, lng: selectedAirport.lng }}
                onCloseClick={() => setSelectedAirport(null)}
                options={{ pixelOffset: new google.maps.Size(0, -30) }} // Adjust InfoWindow position
              >
                <div className="p-2 max-w-xs">
                  <h3 className="font-bold text-md mb-1">{selectedAirport.name}</h3>
                  <p className="text-sm text-gray-600">IATA: {selectedAirport.code}</p>
                  <p className="text-xs text-gray-500 mt-1">Lat: {selectedAirport.lat.toFixed(4)}, Lng: {selectedAirport.lng.toFixed(4)}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
         {filteredAirports.length === 0 && searchTerm && (
          <p className="text-center text-muted-foreground mt-4">
            No airports found matching "{searchTerm}".
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AirportMap;