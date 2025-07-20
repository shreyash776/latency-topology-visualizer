import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { SERVER_MAPPING } from '../../data/serverMapping';
import { Exchange } from './ExchangeMarkers';
import { getLineColor } from '../../utils/mapHelpers';

const countryCodeMap: Record<string, string> = {
  'Singapore': 'SG', 'Japan': 'JP', 'Hong Kong': 'HK', 'United Kingdom': 'GB', 'Germany': 'DE', 'Netherlands': 'NL',
  'Luxembourg': 'LU', 'United States': 'US', 'Australia': 'AU', 'China': 'CN',
};

type Latency = { [country: string]: number };

type Props = {
  map: mapboxgl.Map | null;
  exchanges: Exchange[];
  latency: Latency;
  setTargetEndpoints?: (endpoints: [number, number][]) => void; 
};

export default function LatencyLines({ map, exchanges, latency, setTargetEndpoints }: Props) {
  useEffect(() => {
    if (!map) return;
    if (map.getSource('latency-lines')) {
      map.removeLayer('latency-lines');
      map.removeSource('latency-lines');
    }

    
    const targetPointsSet = new Set<string>();

    const features: GeoJSON.Feature<GeoJSON.LineString, GeoJSON.GeoJsonProperties>[] = exchanges
      .map((exchange) => {
        const server = SERVER_MAPPING[exchange.name];
        if (!server) return null;
        let cc = countryCodeMap[exchange.country || ''] || 'US';
        const latencyMs = latency[cc] ?? 100;

        
        const targetCoords: [number, number] = [server.lng, server.lat + 13];
        targetPointsSet.add(JSON.stringify(targetCoords));

        return {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [server.lng, server.lat],
              targetCoords
            ]
          },
          properties: {
            latencyMs,
            color: getLineColor(latencyMs),
            exName: exchange.name,
            country: exchange.country,
          }
        } as GeoJSON.Feature<GeoJSON.LineString, GeoJSON.GeoJsonProperties>;
      })
      .filter((f): f is GeoJSON.Feature<GeoJSON.LineString, GeoJSON.GeoJsonProperties> => f !== null);

   
    if (setTargetEndpoints) {
      const uniqueEndpoints = Array.from(targetPointsSet).map(str => JSON.parse(str));
      setTargetEndpoints(uniqueEndpoints);
    }

    map.addSource('latency-lines', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features }
    });

    map.addLayer({
      id: 'latency-lines',
      type: 'line',
      source: 'latency-lines',
      layout: { 'line-cap': 'round' },
      paint: {
        'line-width': 3,
        'line-color': ['get', 'color'],
        'line-opacity': 0.9
      }
    });

    map.on('click', 'latency-lines', e => {
      const feature = e.features?.[0];
      if (!feature || !feature.properties) return;
      new mapboxgl.Popup()
        .setLngLat((feature.geometry as any).coordinates[1])
        .setHTML(
          `<div style="padding:11px 18px;font-size:15px;">
            <b>${feature.properties.exName}</b><br/>
            <span style="margin-top:9px;display:inline-block;">Latency: <b style="color:${feature.properties.color}">${feature.properties.latencyMs} ms</b></span><br/>
            <span style="font-size:13px;color:#666;">Country: ${feature.properties.country}</span>
          </div>`
        )
        .addTo(map);
    });

    return () => {
      if (map.getSource('latency-lines')) {
        map.removeLayer('latency-lines');
        map.removeSource('latency-lines');
      }
    };
  }, [map, exchanges, latency, setTargetEndpoints]);

  return null;
}
