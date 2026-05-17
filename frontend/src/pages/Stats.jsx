import React, { useEffect, useState } from 'react';
import { fetchStats } from '../api';

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats);
  }, []);

  return (
    <div>
      <h1>Stats</h1>
      {!stats ? <p>Loading...</p> : (
        <ul>
          <li>Total products: {stats.totalItems}</li>
          <li>Backend instance: {stats.instanceId}</li>
          <li>Backend uptime: {stats.serverUptime}</li>
          <li>Handled requests: {stats.handledRequests}</li>
        </ul>
      )}
    </div>
  );
}
