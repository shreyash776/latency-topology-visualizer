import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

type Props = {
  map: mapboxgl.Map | null;
  endpoints: [number, number][];
};

export default function DynamicRegionMarkers({ map, endpoints }: Props) {
  useEffect(() => {
    if (!map || !endpoints) return;
    const markers: mapboxgl.Marker[] = [];

    endpoints.forEach(([lng, lat]) => {
      const dot = document.createElement('div');
      dot.style.width = '15px';
      dot.style.height = '15px';
      dot.style.borderRadius = '50%';
      dot.style.background = 'rgba(0, 0, 0, 0.7)';
      dot.style.border = '2.5px solid #000000';
      dot.style.boxShadow = '0 0 7px 2px #07358424';
      dot.title = `Region endpoint (${lng.toFixed(2)}, ${lat.toFixed(2)})`;

      const marker = new mapboxgl.Marker({ element: dot, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(map);

      markers.push(marker);
    });

    
    return () => { markers.forEach(m => m.remove()); };
  }, [map, endpoints]);

  return null;
}
