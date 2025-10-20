const API = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

export async function listSensors(areaId) {
  const qs = new URLSearchParams(); if (areaId) qs.set('areaId', areaId);
  const r = await fetch(`${API}/api/sensors?${qs.toString()}`);
  if (!r.ok) throw new Error('listSensors failed');
  return r.json();
}
export async function getSensorValues(sensorId, limit = 5) {
  const r = await fetch(`${API}/api/sensors/${sensorId}/values?limit=${limit}`);
  if (!r.ok) throw new Error('getSensorValues failed');
  return r.json();
}
export async function createSensor(payload) {
  const r = await fetch(`${API}/api/sensors`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error('createSensor failed');
  return r.json();
}
export async function updateSensor(id, payload) {
  const r = await fetch(`${API}/api/sensors/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!r.ok) throw new Error('updateSensor failed');
  return r.json();
}
export async function deleteSensor(id) {
  const r = await fetch(`${API}/api/sensors/${id}`, { method: 'DELETE' });
  if (!r.ok) throw new Error('deleteSensor failed');
  return r.json();
}
export async function setSensorActive(id, is_active) {
  const r = await fetch(`${API}/api/sensors/${id}/active`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active }) });
  if (!r.ok) throw new Error('setSensorActive failed');
  return r.json();
}
export async function updateSensorPosition(id, x, y) {
  const r = await fetch(`${API}/api/sensors/${id}/position`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ x, y }) });
  if (!r.ok) throw new Error('updateSensorPosition failed');
  return r.json();
}
