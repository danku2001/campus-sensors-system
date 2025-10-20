import React, { useEffect, useState } from "react";

export default function SensorDrawer({
  sensor,
  values = [],
  onClose = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onToggleActive = () => {},
  sensorSavedTick = 0,            
}) {
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!sensorSavedTick) return;
    setJustSaved(true);
    const t = setTimeout(() => setJustSaved(false), 1800);
    return () => clearTimeout(t);
  }, [sensorSavedTick]);

  if (!sensor) return null;

  return (
    <aside className="drawer">
      <div className="hbar">
        <h3>Sensor</h3>
        <button className="iconbtn" onClick={onClose}>✕</button>
      </div>

      {justSaved && <div className="badge success" style={{marginBottom:8}}>נשמר ✓</div>}

      <div className="kv">
        <div>מס׳</div><div>{sensor.id}</div>
        <div>סוג</div><div>{sensor.type || 'לא ידוע'}</div>
        <div>מיקום</div><div>{sensor.x},{sensor.y}</div>
        <div>סטטוס</div><div>{sensor.is_active ? 'פעיל' : 'כבוי'}</div>
      </div>

      <div className="toolbar" style={{marginTop:12}}>
        <button type="button" className="btn" onClick={() => onEdit(sensor)}>ערוך</button>
        <button type="button" className="btn" onClick={onToggleActive}>
          {sensor.is_active ? 'כבה' : 'הפעל'}
        </button>
        <button type="button" className="btn" onClick={onDelete}>מחק</button>
      </div>

      <div className="section card" style={{marginTop:16}}>
        <h3>קריאות אחרונות</h3>
        {values.length === 0 ? (
          <small className="sub">אין נתונים</small>
        ) : (
          <div className="list">
            {values.map(v => (
              <div key={v.id} className="item" style={{justifyContent:'space-between'}}>
                <div>{v.metric}</div>
                <div>{v.value} {v.unit}</div>
                <small className="sub">{new Date(v.recorded_at).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}