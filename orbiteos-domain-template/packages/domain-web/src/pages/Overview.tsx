import React, { useState, useEffect } from 'react';
import { DeviceCard } from '../components/DeviceCard.js';

interface DLDEntry {
  id: string;
  dld_type: string;
  dld_class: string;
  summary: Record<string, unknown>;
}

const API_URL = '/api/my-domain';

export const DomainOverview: React.FC = () => {
  const [devices, setDevices] = useState<DLDEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/devices`)
      .then((r) => r.json())
      .then((data) => setDevices(data.devices || []))
      .catch(() => setDevices([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af' }}>Loading devices...</div>;
  }

  if (devices.length === 0) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#128268;</div>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No devices yet</h3>
        <p style={{ fontSize: 14, color: '#6b7280' }}>
          Install a device driver from the Marketplace to get started.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>My Domain Devices</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {devices.map((d) => (
          <DeviceCard
            key={d.id}
            name={d.id}
            dldType={d.dld_type}
            dldClass={d.dld_class}
            summary={d.summary}
          />
        ))}
      </div>
    </div>
  );
};
