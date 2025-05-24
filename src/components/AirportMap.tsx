import React, { useState } from 'react';
import { Search, X, Plane, MapPin } from 'lucide-react';

// Extended airport data
const AIRPORTS = [
  { id: 1, name: "London Heathrow", code: "LHR", lat: 51.4700, lng: -0.4543, country: "United Kingdom", terminals: 5 },
  { id: 2, name: "John F. Kennedy", code: "JFK", lat: 40.6413, lng: -73.7781, country: "United States", terminals: 6 },
  { id: 3, name: "Tokyo Narita", code: "NRT", lat: 35.7720, lng: 140.3929, country: "Japan", terminals: 3 },
  { id: 4, name: "Singapore Changi", code: "SIN", lat: 1.3644, lng: 103.9915, country: "Singapore", terminals: 4 },
  { id: 5, name: "Dubai International", code: "DXB", lat: 25.2532, lng: 55.3657, country: "UAE", terminals: 3 },
  { id: 6, name: "Paris Charles de Gaulle", code: "CDG", lat: 49.0097, lng: 2.5479, country: "France", terminals: 3 },
  { id: 7, name: "Amsterdam Schiphol", code: "AMS", lat: 52.3105, lng: 4.7683, country: "Netherlands", terminals: 1 },
  { id: 8, name: "Hong Kong International", code: "HKG", lat: 22.3080, lng: 113.9185, country: "Hong Kong", terminals: 2 },
];

const AirportMap = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAirports, setFilteredAirports] = useState(AIRPORTS);
  const [selectedAirport, setSelectedAirport] = useState<typeof AIRPORTS[0] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '') {
      setFilteredAirports(AIRPORTS);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = AIRPORTS.filter(airport => 
      airport.name.toLowerCase().includes(query) || 
      airport.code.toLowerCase().includes(query) ||
      airport.country.toLowerCase().includes(query)
    );
    
    setFilteredAirports(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredAirports(AIRPORTS);
  };

  const selectAirport = (airport: typeof AIRPORTS[0]) => {
    setSelectedAirport(airport);
  };

  return (
    <div className="card">
      <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              width: '2rem', 
              height: '2rem', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(14, 165, 233, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Plane className="h-4 w-4 text-sky-500" />
            </div>
            <span>Airport Map</span>
          </div>
        </div>
      </div>
      <div className="card-content">
        <form onSubmit={handleSearch} style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '1rem' 
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input 
              placeholder="Search airports..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 2rem 0.5rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(0,0,0,0.1)',
                backgroundColor: 'rgba(255,255,255,0.8)',
                outline: 'none'
              }}
              className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary btn-sm" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.5rem',
            height: '2.5rem',
            padding: 0
          }}>
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div style={{ 
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)',
          borderRadius: '0.75rem',
          padding: '0.5rem',
          height: '300px',
          overflowY: 'auto'
        }}>
          {filteredAirports.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {filteredAirports.map(airport => (
                <div 
                  key={airport.id} 
                  style={{ 
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: selectedAirport?.id === airport.id ? 'rgba(14, 165, 233, 0.1)' : 'rgba(255, 255, 255, 0.7)',
                    border: selectedAirport?.id === airport.id ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedAirport?.id === airport.id ? '0 4px 12px rgba(14, 165, 233, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                  className={selectedAirport?.id === airport.id ? 'dark:bg-sky-900/30' : 'dark:bg-gray-800/50'}
                  onClick={() => selectAirport(airport)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div style={{ 
                        width: '2.5rem', 
                        height: '2.5rem', 
                        borderRadius: '50%', 
                        backgroundColor: 'rgba(14, 165, 233, 0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <MapPin className="h-4 w-4 text-sky-500" />
                      </div>
                      <div>
                        <h3 style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>{airport.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ 
                            backgroundColor: 'rgba(14, 165, 233, 0.1)', 
                            color: '#0ea5e9', 
                            padding: '0.125rem 0.375rem', 
                            borderRadius: '0.25rem', 
                            fontSize: '0.75rem', 
                            fontWeight: '500' 
                          }}>
                            {airport.code}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                            {airport.country}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                        Terminals: {airport.terminals}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <Plane className="h-12 w-12 text-gray-300 mb-4" />
              <p style={{ color: 'var(--muted-foreground)' }}>No airports found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AirportMap;