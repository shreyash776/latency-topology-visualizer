export default function MapLegend() {
  return (
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
      <span style={{ marginLeft: 24, color: '#444' }}>
        |
        <span style={{ color: '#18c964', marginLeft: 8, fontWeight: 600 }}>&#8213; &lt; 50ms</span>
        <span style={{ color: '#f7b500', marginLeft: 10, fontWeight: 600 }}>&#8213; &lt; 100ms</span>
        <span style={{ color: '#ff3f3f', marginLeft: 10, fontWeight: 600 }}>&#8213; ≥ 100ms</span>
      </span>
    </div>
  );
}
