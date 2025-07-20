
import { ResponsiveLine } from '@nivo/line';

type LatencyHistoryChartProps = {
  data: Array<{ x: string | number; y: number }>;
  exchangeName: string;
  region: string;
  onClose: () => void;
};

export default function LatencyHistoryChart({ data, exchangeName, region, onClose }: LatencyHistoryChartProps) {
  return (
    <div style={{
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      background: 'rgba(0,0,0,0.33)',
      zIndex: 3333,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '90vw',
        maxWidth: 540,
        background: '#fff',
        padding: 24,
        borderRadius: 16,
        boxShadow: '0 0 30px 2px #2222',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 13, right: 13, border: 'none', background: 'none',
          fontSize: 22, cursor: 'pointer', color: '#555'
        }}>×</button>
        <h3 style={{ margin: 0, fontSize: 20, marginBottom: 13 }}>
          {exchangeName} – {region} Latency Trend
        </h3>
        <div style={{ height: 260 }}>
          <ResponsiveLine
            data={[
              {
                id: `${exchangeName} - ${region}`,
                color: '#278fbe',
                data: data
              }
            ]}
            margin={{ top: 24, right: 30, bottom: 40, left: 48 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
            axisLeft={{ legend: 'Latency (ms)', legendOffset: -40, legendPosition: 'middle' }}
            axisBottom={{ legend: 'Time', legendOffset: 32, legendPosition: 'middle', tickRotation: -32 }}
            colors={{ scheme: 'category10' }}
            pointSize={7}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            areaOpacity={0.39}
            curve="monotoneX"
            enableArea={true}
            enableGridY={true}
            enableGridX={false}
            useMesh={true}
            tooltip={({ point }) => (
              <div style={{ background: '#fff', padding: '6px 10px', fontSize: 13, boxShadow: '0 1px 8px #4441' }}>
                <b>{point.data.xFormatted}</b><br />Latency: <b>{point.data.y} ms</b>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
