export function getLineColor(ms: number) {
  if (ms < 50) return '#18c964';
  if (ms < 100) return '#f7b500';
  return '#ff3f3f';
}

export function getColor(provider: string) {
  if (provider === 'AWS') return 'orange';
  if (provider === 'GCP') return 'green';
  if (provider === 'Azure') return 'blue';
  if (provider === 'Alibaba Cloud') return '#0269a9';
  return 'gray';
}

export function getPopupBgColor(provider: string) {
  if (provider === 'AWS') return 'rgba(255, 165, 0, 0.15)';
  if (provider === 'GCP') return 'rgba(41, 152, 69, 0.13)';
  if (provider === 'Azure') return 'rgba(3, 112, 255, 0.12)';
  if (provider === 'Alibaba Cloud') return 'rgba(2, 105, 169, 0.12)';
  return 'rgba(240,240,240,0.5)';
}

export function formatNumber(n: number | undefined): string {
  if (n == null) return "N/A";
  return n >= 1e9
    ? (n / 1e9).toFixed(2) + "B"
    : n >= 1e6
    ? (n / 1e6).toFixed(2) + "M"
    : n >= 1e3
    ? (n / 1e3).toFixed(2) + "K"
    : n.toString();
}
