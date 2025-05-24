import { useState, useEffect } from 'react';
import Map from '@/components/Map';
import WeatherWidget from '@/components/WeatherWidget';
import WorldClock from '@/components/WorldClock';
import CurrencyConverter from '@/components/CurrencyConverter';
import AirportMap from '@/components/AirportMap';
import Sidebar from '@/components/Sidebar';

const Index = () => {
  const [activeSection, setActiveSection] = useState('map');
  const [mounted, setMounted] = useState(false);

  // Wait for component to mount to avoid hydration issues with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'map':
        return <Map />;
      case 'weather':
        return <WeatherWidget />;
      case 'clock':
        return <WorldClock />;
      case 'currency':
        return <CurrencyConverter />;
      case 'airports':
        return <AirportMap />;
      default:
        return <Map />;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900" style={{ transition: 'background-color 0.3s' }}>
      <Sidebar onSectionChange={setActiveSection} />
      <main style={{ paddingLeft: '5rem' }}>
        <div className="container py-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 className="app-title">GlobeTrotter</h1>
          </div>
          
          <div style={{ display: 'grid', gap: '1.5rem' }} className="animate-fade-in">
            {/* Main section - always visible */}
            {renderSection()}
            
            {/* Widgets section - always visible */}
            <div style={{ 
              display: 'grid', 
              gap: '1.5rem', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
            }}>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {activeSection !== 'weather' && <WeatherWidget />}
                {activeSection !== 'clock' && <WorldClock />}
              </div>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {activeSection !== 'currency' && <CurrencyConverter />}
                {activeSection !== 'airports' && <AirportMap />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;