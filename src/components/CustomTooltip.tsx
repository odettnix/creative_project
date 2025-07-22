import React from 'react';
import { TooltipProps } from 'recharts';

const CustomTooltip: React.FC<TooltipProps<any, any>> = (props) => {
  const { active, payload, label } = props as any;
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff',
        color: '#23244a',
        border: '1px solid #ececec',
        borderRadius: 10,
        boxShadow: '0 4px 24px rgba(44,62,80,0.13)',
        padding: '10px 16px',
        fontSize: '1rem',
        opacity: 1
      }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
        {payload.map((entry: any, idx: number) => (
          <div key={idx}>
            <span style={{ fontWeight: 500 }}>{entry.name}:</span> {entry.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip; 