const API = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

export async function getAreaShading(areaId) {
  const r = await fetch(`${API}/api/shading/areas/${areaId}`);
  if (!r.ok) throw new Error('failed to load shading');
  return r.json();
}
export async function setAreaShading(areaId, status, connected) {
  const body = connected == null ? { status } : { status, connected };
  const r = await fetch(`${API}/api/shading/areas/${areaId}`, {
    method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error('failed to update shading');
  return r.json();
}
export async function deleteAreaShading(areaId) {
  const r = await fetch(`${API}/api/shading/areas/${areaId}`, { method:'DELETE' });
  if (!r.ok) throw new Error('failed to delete shading');
  return r.json();
}
