import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { SERVER_MAPPING } from '../../data/serverMapping';

// Extended type for CoinGecko exchange data
type Exchange = {
  id: string;
  name: string;
  image: string;
  country?: string;
  year_established?: number;
  trust_score?: number;
  trust_score_rank?: number;
  trade_volume_24h_btc?: number;
  url?: string | string[];
};

function getColor(provider: string) {
  if (provider === 'AWS') return 'orange';
  if (provider === 'GCP') return 'green';
  if (provider === 'Azure') return 'blue';
  if (provider === 'Alibaba Cloud') return '#0269a9';
  return 'gray';
}

function getPopupBgColor(provider: string) {
  if (provider === 'AWS') return 'rgba(255, 165, 0, 0.15)';
  if (provider === 'GCP') return 'rgba(41, 152, 69, 0.13)';
  if (provider === 'Azure') return 'rgba(3, 112, 255, 0.12)';
  if (provider === 'Alibaba Cloud') return 'rgba(2, 105, 169, 0.12)';
  return 'rgba(240,240,240,0.5)';
}

function formatNumber(n: number | undefined): string {
  if (n == null) return "N/A";
  return n >= 1e9 ? (n / 1e9).toFixed(2) + "B"
    : n >= 1e6 ? (n / 1e6).toFixed(2) + "M"
    : n >= 1e3 ? (n / 1e3).toFixed(2) + "K"
    : n.toString();
}

export default function WorldMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);

  // Fetch CoinGecko exchanges (with desired properties)
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/exchanges')
      .then(res => res.json())
      .then(data => setExchanges(data));
  }, []);

  // Initialize Mapbox
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

  // Place logo markers with styled popups
  useEffect(() => {
    if (!mapRef.current) return;

    exchanges.forEach((exchange) => {
      const server = SERVER_MAPPING[exchange.name];
      if (!server) return;

      // Custom logo marker
      const img = document.createElement('img');
      img.src = exchange.image;
      img.alt = exchange.name;
      img.width = 40;
      img.height = 40;
      img.style.borderRadius = '50%';
      img.style.border = `2.5px solid ${getColor(server.provider)}`;
      img.style.background = '#fff';
      img.style.boxShadow = '0 1.5px 7px #0002';
      img.style.objectFit = 'cover';
      img.style.display = 'block';
      img.onerror = function () {
        img.src = '';
        img.alt = server.provider;
        img.style.background = getColor(server.provider);
        img.style.border = 'none';
      };

      // Info from API and mapping for richer popup
      const popupHtml = `
        <div style="background:${getPopupBgColor(server.provider)};color:#222;font-family:'Segoe UI',sans-serif;border-radius:14px;padding:15px 16px 12px 16px;min-width:230px;box-shadow:0 2px 16px #1d1d1d15;">
          <div style="display:flex;gap:12px;align-items:center;">
            <img src="${exchange.image}" alt="${exchange.name}" width="32" height="32" style="border-radius:50%;box-shadow:0 0 3px #0002;" />
            <div>
              <span style="font-weight:700;font-size:16px;color:#0a194a;">${exchange.name}</span><br/>
              <span style="display:inline-block;font-size:12px;color:#666;margin-top:4px;padding:1.5px 8px;border-radius:8px;background:#fff4;">${server.provider}</span>
            </div>
          </div>
          <div style="margin-top:11px;font-size:13px;line-height:1.7;">
            <strong>Country:</strong> ${exchange.country || 'N/A'}<br/>
            <strong>Location:</strong> ${server.location}<br/>
            <strong>Year:</strong> ${exchange.year_established ?? 'N/A'}<br/>
            <strong>Trust Score:</strong> <span style="color:#00792e;font-weight:600">${exchange.trust_score ?? 'N/A'}</span>
            <span style="margin-left:7px;font-size:12px;color:#555;">${exchange.trust_score_rank ? `(rank: ${exchange.trust_score_rank})` : ''}</span><br/>
            <strong>24h Volume:</strong> <span style="color:#3b2be2;font-weight:600;">${formatNumber(exchange.trade_volume_24h_btc)}</span> BTC<br/>
            ${
              exchange.url
                ? `<strong>Website:</strong> <a href="${Array.isArray(exchange.url) ? exchange.url[0] : exchange.url}" target="_blank" rel="noopener noreferrer" style="color:#2a7de1;text-decoration:underline;">Visit</a>`
                : ''
            }
          </div>
        </div>
      `;

      new mapboxgl.Marker({ element: img, anchor: 'center' })
        .setLngLat([server.lng, server.lat])
        .setPopup(new mapboxgl.Popup({ offset: 18 }).setHTML(popupHtml))
        .addTo(mapRef.current!);
    });
  }, [exchanges]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '80vh' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          background: '#fff',
          borderRadius: 6,
          padding: '8px 18px',
          fontSize: 14,
          boxShadow: '0 2px 6px #0002',
          fontFamily: 'sans-serif',
        }}
      >
        <strong style={{ color: '#111' }}>Legend:</strong>
        <span style={{ color: 'orange', marginLeft: 8 }}>● AWS</span>
        <span style={{ color: 'green', marginLeft: 16 }}>● GCP</span>
        <span style={{ color: 'blue', marginLeft: 16 }}>● Azure</span>
        <span style={{ color: '#0269a9', marginLeft: 16 }}>● Alibaba Cloud</span>
      </div>
    </div>
  );
}
