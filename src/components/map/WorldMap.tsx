import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SERVER_MAPPING } from '../../data/serverMapping';
import ExchangeMarkers, { Exchange } from './ExchangeMarkers';
import LatencyLines from './LatencyLines';
import MapLegend from './MapLegend';
// import ReferenceRegionMarkers from './ReferenceRegionMarkers';
import DynamicRegionMarkers from './DynamicRegionMarkers';
type CountryLatency = { [country: string]: number; };

export default function WorldMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [latency, setLatency] = useState<CountryLatency>({});
  const [targetEndpoints, setTargetEndpoints] = useState<[number, number][]>([]);


  
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/exchanges')
      .then(res => res.json())
      .then(data => setExchanges(data));
  }, []);

  
  useEffect(() => {
    async function fetchLatency() {
      const countries = [
        'JP', 'SG', 'HK', 'GB', 'DE', 'NL', 'LU', 'US', 'AU', 'CN'
      ];
      const results: CountryLatency = {};
      await Promise.all(countries.map(async (cc) => {
        try {
          const r = await fetch(
            `https://radar.cloudflare.com/api/v1/network/quality?country_code=${cc}`
          );
          const json = await r.json();
          if (json?.data?.latency?.median)
            results[cc] = json.data.latency.median;
        } catch {}
      }));
      setLatency(results);
    }
    fetchLatency();
    const intv = setInterval(fetchLatency, 10000);
    return () => clearInterval(intv);
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

  return (
    <div style={{ position: 'relative', width: '100%', height: '80vh' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      {mapRef.current && (
        <>
          <ExchangeMarkers map={mapRef.current} exchanges={exchanges} />
          <LatencyLines
  map={mapRef.current}
  exchanges={exchanges}
  latency={latency}
  
  setTargetEndpoints={setTargetEndpoints}
/>
         
          <DynamicRegionMarkers map={mapRef.current} endpoints={targetEndpoints} />
        </>
      )}
      <MapLegend />
    </div>
  );
}
