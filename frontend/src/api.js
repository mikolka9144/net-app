const API = '/api';

export const fetchItems = () => fetch(`${API}/items`).then(r => r.json());
export const createItem = (data) =>
  fetch(`${API}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const fetchStats = () => fetch(`${API}/stats`).then(r => r.json());
