import React from 'react';

interface DeviceCardProps {
  name: string;
  dldType: string;
  dldClass: string;
  summary: Record<string, unknown>;
  isOnline?: boolean;
  onClick?: () => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  name,
  dldType,
  dldClass,
  summary,
  isOnline = true,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 16,
        background: 'var(--bg-card, #fff)',
        border: '1px solid var(--border-primary, #e5e7eb)',
        borderRadius: 8,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{name}</h4>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: isOnline ? '#22c55e' : '#ef4444',
          }}
        />
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <span style={{
          display: 'inline-block', padding: '2px 8px', fontSize: 11,
          fontWeight: 600, borderRadius: 4, background: '#dbeafe', color: '#1d4ed8',
        }}>
          {dldType}
        </span>
        <span style={{
          display: 'inline-block', padding: '2px 8px', fontSize: 11,
          fontWeight: 600, borderRadius: 4, background: '#f3f4f6', color: '#4b5563',
        }}>
          {dldClass}
        </span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)' }}>
        {Object.entries(summary).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span>{key}:</span>
            <span style={{ fontWeight: 500 }}>{String(val)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
