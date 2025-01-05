import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHRqcTNtbWwwMXBqMmlvNjZ5ZWV2aDl2In0.a9qz8O0xN9UmpiYHGtgRJw';
    
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
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
};

export default Map;