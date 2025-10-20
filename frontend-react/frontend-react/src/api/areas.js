const API = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

export async function listAreas() {
  const r = await fetch(`${API}/api/areas`);
  if (!r.ok) throw new Error('listAreas failed');
  return r.json();
}
export async function createArea(payload) {
  const r = await fetch(`${API}/api/areas`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error('createArea failed');
  return r.json();
}
export async function updateArea(id, payload) {
  const r = await fetch(`${API}/api/areas/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error('updateArea failed');
  return r.json();
}
export async function deleteArea(id) {
  const r = await fetch(`${API}/api/areas/${id}`, { method:'DELETE' });
  if (!r.ok) throw new Error('deleteArea failed');
  return r.json();
}
