import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SERVER_MAPPING } from '../../data/serverMapping';

type Exchange = {
  id: string,
  name: string,
  image: string,
};

function getColor(provider: string) {
  if (provider === 'AWS') return 'orange';
  if (provider === 'GCP') return 'green';
  if (provider === 'Azure') return 'blue';
  return 'gray';
}

export default function WorldMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);

  
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/exchanges')
      .then(res => res.json())
      .then(data => setExchanges(data));
  }, []);

  
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12', 
        center: [0, 20],
        zoom: 1.5,
        bearing: 0,
        pitch: 30,
      });
      mapRef.current.on('style.load', () => {
        mapRef.current && mapRef.current.setProjection('globe');
      });
    }
    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

 
  useEffect(() => {
    if (!mapRef.current) return;

    exchanges.forEach((exchange) => {
      const server = SERVER_MAPPING[exchange.name];
      if (!server) return;
      const marker = new mapboxgl.Marker({ color: getColor(server.provider) })
        .setLngLat([server.lng, server.lat])
        .setPopup(new mapboxgl.Popup().setHTML(
          `<strong>${exchange.name}</strong><br/>
           ${server.location} (${server.provider})<br/>
           <img src='${exchange.image}' alt='${exchange.name}' width='40' height='40'/>`
        ))
        .addTo(mapRef.current!);
    });
  }, [exchanges]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '80vh' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <div style={{
        position: 'absolute', bottom: 20, left: 20, background: '#fff', borderRadius: 6,
        padding: '8px 18px', fontSize: 14, boxShadow: '0 2px 6px #0002',
      }}>
        <strong>Legend:</strong>
        <span style={{ color: 'orange', marginLeft: 8 }}>■ AWS</span>
        <span style={{ color: 'green', marginLeft: 16 }}>■ GCP</span>
        <span style={{ color: 'blue', marginLeft: 16 }}>■ Azure</span>
      </div>
    </div>
  );
}
