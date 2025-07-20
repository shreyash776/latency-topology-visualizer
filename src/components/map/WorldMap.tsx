import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function WorldMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12', 
        center: [-74.006, 40.7128],
        zoom: 1.5,
        bearing: 0,
        pitch: 30,
      });

     
      mapRef.current.on('style.load', () => {
        mapRef.current && mapRef.current.setProjection('globe');
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '80vh' }} />
  );
}

export default WorldMap;
