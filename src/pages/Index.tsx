import Map from '@/components/Map';
import WeatherWidget from '@/components/WeatherWidget';
import WorldClock from '@/components/WorldClock';
import CurrencyConverter from '@/components/CurrencyConverter';
import AirportMap from '@/components/AirportMap';
import Sidebar from '@/components/Sidebar';

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Sidebar />
      <main className="pl-16">
        <div className="container py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-primary">GlobeTrotter</h1>
          </div>
          
          <div className="grid gap-6">
            <Map />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <WeatherWidget />
                <WorldClock />
              </div>
              <div className="space-y-6">
                <CurrencyConverter />
                <AirportMap />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;