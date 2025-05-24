import React, { useRef, useState } from 'react';
import { Compass, Maximize, Minimize, Pause, Play } from 'lucide-react';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetView = () => {
    // Reset view functionality would go here
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative ${isFullscreen ? 'fullscreen' : 'w-full'}`} style={{ 
      height: isFullscreen ? '100vh' : '500px',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-lg shadow-lg" 
        style={{ 
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Globe visualization placeholder */}
        <div style={{ 
          width: '300px', 
          height: '300px', 
          borderRadius: '50%', 
          background: 'radial-gradient(circle at 30% 30%, #60a5fa, #1e40af)',
          boxShadow: '0 0 60px rgba(37, 99, 235, 0.5)',
          position: 'relative',
          animation: 'spin 20s linear infinite'
        }}>
          {/* Continents overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cpath fill=\'rgba(255,255,255,0.15)\' d=\'M30,20 Q40,20 50,30 T80,40 Q70,50 80,60 T70,80 Q60,70 40,80 T20,70 Q30,60 20,40 T30,20\'/%3E%3C/svg%3E") no-repeat center center',
            backgroundSize: 'cover',
            opacity: 0.7
          }}></div>
        </div>
        <div style={{ 
          position: 'absolute', 
          bottom: '2rem', 
          left: '2rem', 
          color: 'white',
          textAlign: 'left'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Interactive World Map</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>Explore our beautiful planet</p>
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4" style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          className="btn btn-icon"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(4px)', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            color: 'white'
          }}
          onClick={togglePause}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
        
        <button 
          className="btn btn-icon"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(4px)', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            color: 'white'
          }}
          onClick={resetView}
        >
          <Compass className="h-4 w-4" />
        </button>
        
        <button 
          className="btn btn-icon"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(4px)', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            color: 'white'
          }}
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </button>
      </div>
      
      {isFullscreen && (
        <button 
          className="btn"
          style={{ 
            position: 'absolute', 
            top: '1rem', 
            right: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(4px)', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            color: 'white'
          }}
          onClick={toggleFullscreen}
        >
          Close
        </button>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Map;