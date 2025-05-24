import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (mapboxToken) {
      mapboxgl.accessToken = mapboxToken;
      setTokenError(null);
    } else {
      const errorMessage = 'Mapbox access token is not set. Please configure VITE_MAPBOX_ACCESS_TOKEN. Map functionality will be limited.';
      console.warn(errorMessage);
      setTokenError(errorMessage);
      // Do not initialize the map if the token is missing
      return; 
    }
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [30, 15],
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.scrollZoom.disable();

    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
    });

    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;
    let lastTime = 0;

    function spinGlobe(timestamp: number) {
      if (!map.current || !spinEnabled || userInteracting) {
        animationFrameId.current = requestAnimationFrame(spinGlobe);
        return;
      }

      const zoom = map.current.getZoom();
      if (zoom > maxSpinZoom) {
        animationFrameId.current = requestAnimationFrame(spinGlobe);
        return;
      }

      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }

      const center = map.current.getCenter();
      center.lng -= (distancePerSecond * deltaTime) / 1000;
      
      map.current.setCenter(center);
      animationFrameId.current = requestAnimationFrame(spinGlobe);
    }

    map.current.on('mousedown', () => {
      userInteracting = true;
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
    });

    // Start the animation
    animationFrameId.current = requestAnimationFrame(spinGlobe);

    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      map.current?.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px]">
      {tokenError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg shadow-lg p-4">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mt-4 text-red-600">{tokenError}</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className={`absolute inset-0 rounded-lg shadow-lg ${tokenError ? 'invisible' : ''}`} />
      {!tokenError && <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />}
    </div>
  );
};

export default Map;