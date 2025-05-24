import { useEffect, useState } from 'react';
import { Cloud, Search, Sun, Thermometer, Wind, Droplets } from 'lucide-react';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('London');
  const [searchCity, setSearchCity] = useState('');

  const getWeather = async (cityName: string) => {
    setLoading(true);
    // Mock data for demonstration
    setTimeout(() => {
      setWeather({
        name: cityName,
        main: { temp: 22, feels_like: 23, humidity: 65 },
        weather: [{ main: 'Clear', description: 'clear sky' }],
        wind: { speed: 3.5 }
      });
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    getWeather(city);
  }, [city]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setCity(searchCity);
    }
  };

  // Weather icon mapping
  const getWeatherIcon = (weatherCode: string) => {
    const code = weatherCode?.toLowerCase() || '';
    if (code.includes('clear') || code.includes('sun')) {
      return <Sun className="h-12 w-12 text-yellow-500" />;
    } else if (code.includes('cloud')) {
      return <Cloud className="h-12 w-12 text-gray-500" />;
    } else if (code.includes('rain') || code.includes('drizzle')) {
      return <Droplets className="h-12 w-12 text-blue-500" />;
    } else {
      return <Thermometer className="h-12 w-12 text-red-500" />;
    }
  };

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="card-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
        <div className="card-title">
          <Sun className="h-5 w-5 text-yellow-500" />
          Weather
        </div>
      </div>
      <div className="card-content">
        <form onSubmit={handleSearch} style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '1rem' 
        }}>
          <input 
            placeholder="Search city..." 
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid rgba(0,0,0,0.1)',
              backgroundColor: 'rgba(255,255,255,0.8)',
              outline: 'none'
            }}
            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
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

        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '150px' 
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              border: '3px solid rgba(59, 130, 246, 0.2)', 
              borderTopColor: '#3b82f6',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>
        ) : (
          <div style={{ padding: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.25rem' }}>{weather.name}</h3>
                <p style={{ color: 'var(--muted-foreground)' }}>{weather.weather?.[0]?.description}</p>
              </div>
              <div>
                {getWeatherIcon(weather.weather?.[0]?.main)}
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem',
              background: 'rgba(59, 130, 246, 0.05)',
              borderRadius: '0.75rem',
              padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ 
                  width: '3rem', 
                  height: '3rem', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <Thermometer className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{Math.round(weather.main?.temp ?? 0)}°C</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    Feels like {Math.round(weather.main?.feels_like ?? 0)}°C
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wind className="h-4 w-4 text-blue-500" />
                  <span style={{ fontSize: '0.875rem' }}>{weather.wind?.speed ?? 0} m/s</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span style={{ fontSize: '0.875rem' }}>{weather.main?.humidity ?? 0}% humidity</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default WeatherWidget;