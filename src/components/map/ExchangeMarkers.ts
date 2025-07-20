import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { SERVER_MAPPING } from '../../data/serverMapping';
import { getColor, getPopupBgColor, formatNumber } from '../../utils/mapHelpers';

export type Exchange = {
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

type Props = {
  map: mapboxgl.Map | null;
  exchanges: Exchange[];
};

// Adds markers with popups of details
export default function ExchangeMarkers({ map, exchanges }: Props) {
  useEffect(() => {
    if (!map) return;

    // Store marker refs for cleanup
    const markerRefs: mapboxgl.Marker[] = [];

    exchanges.forEach((exchange) => {
      const server = SERVER_MAPPING[exchange.name];
      if (!server) return;

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

      img.onerror = function () {
        img.src = '';
        img.alt = server.provider;
        img.style.background = getColor(server.provider);
        img.style.border = 'none';
      };

      const popupHtml = `
        <div style="background:${getPopupBgColor(server.provider)};color:#222;font-family:'Segoe UI',sans-serif;border-radius:14px;padding:15px 16px 12px 16px;min-width:230px;box-shadow:0 2px 16px #1d1d1d15;">
          <div style="display:flex;gap:12px;align-items:center;">
            <img src="${exchange.image}" alt="${exchange.name}" width="32" height="32" style="border-radius:50%;box-shadow:0 0 3px #0002;" />
            <div>
              <span style="font-weight:700;font-size:16px;color:#0a194a;">${exchange.name}</span><br/>
              <span style="display:inline-block;font-size:12px;color:#666;margin-top:4px;padding:1.5px 8px;border-radius:8px;background:#fff1;">${server.provider}</span>
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

      const marker = new mapboxgl.Marker({ element: img, anchor: 'center' })
        .setLngLat([server.lng, server.lat])
        .setPopup(new mapboxgl.Popup({ offset: 18 }).setHTML(popupHtml))
        .addTo(map);

      markerRefs.push(marker);
    });

    return () => {
      markerRefs.forEach(marker => marker.remove());
    };
  }, [map, exchanges]);

  return null;
}
