import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { REGION_REFERENCE_POINTS } from '../../data/regionReferencePoints';

type Props = { map: mapboxgl.Map | null };

export default function ReferenceRegionMarkers({ map }: Props) {
  useEffect(() => {
    if (!map) return;
    const markers: mapboxgl.Marker[] = [];
    Object.values(REGION_REFERENCE_POINTS).forEach(region => {
      const dot = document.createElement('div');
      dot.style.width = '28px';
      dot.style.height = '28px';
      dot.style.borderRadius = '50%';
      dot.style.background = 'rgba(80,130,220,0.22)';
      dot.style.boxShadow = '0 0 8px 2px #1a258920';
      dot.style.border = '2px solid #3671c6';
      dot.style.display = 'flex';
      dot.style.alignItems = 'center';
      dot.style.justifyContent = 'center';
      dot.title = region.label;

      const marker = new mapboxgl.Marker({ element: dot, anchor: 'center' })
        .setLngLat(region.coords as [number, number])
        .addTo(map);

      markers.push(marker);
    });
    return () => { markers.forEach(m => m.remove()); };
  }, [map]);
  return null;
}
