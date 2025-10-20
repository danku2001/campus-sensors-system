import { useEffect, useMemo, useRef, useState } from 'react';
import { getSensorValues } from '../api/sensors';

export default function SensorDot({
  sensor,
  area,
  adminMode = false,
  onMoved = () => {},
  onSelect = () => {},
}) {
  const [hover, setHover] = useState(false);
  const [vals, setVals] = useState([]);
  const dragging = useRef(false);

  useEffect(() => {
    if (!hover) return;
    let alive = true;
    getSensorValues(sensor.id, 5)
      .then(d => alive && setVals(Array.isArray(d) ? d : []))
      .catch(() => alive && setVals([]));
    return () => { alive = false; };
  }, [hover, sensor.id]);

  const w = area?.width || 1000;
  const h = area?.height || 1000;
  const leftPct = (sensor.x / w) * 100;
  const topPct = (sensor.y / h) * 100;

  const isShade = String(sensor.type || '').toLowerCase() === 'shade';
  const posClass = useMemo(() => (topPct < 15 ? 'below' : 'above'), [topPct]);

  function onMouseDown(e){
    if (!adminMode) return;
    dragging.current = true;
    e.preventDefault();
    const wrap = e.currentTarget.parentElement;
    const rect = wrap.getBoundingClientRect();
    function move(ev){
      if (!dragging.current) return;
      const nx = Math.max(0, Math.min(rect.width, ev.clientX - rect.left));
      const ny = Math.max(0, Math.min(rect.height, ev.clientY - rect.top));
      const x = Math.round((nx / rect.width) * w);
      const y = Math.round((ny / rect.height) * h);
      onMoved(sensor.id, x, y);
    }
    function up(){
      dragging.current = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    }
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }

  return (
    <div
      className="sensor"
      style={{ left: `${leftPct}%`, top: `${topPct}%`, cursor: adminMode ? 'grab' : 'pointer' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseDown={onMouseDown}
      onClick={() => { if (!dragging.current) onSelect(sensor); }}  // רק דרואר
    >
      <div className={`marker ${isShade ? 'shade' : ''} ${
        sensor.__offline ? 'offline' : (sensor.is_active ? 'active' : 'inactive')
      }`} />
      <div className="sensorLabel">{sensor.name || `#${sensor.id}`}</div>

      {hover && !adminMode && (
        <div className={`tooltip ${posClass}`}>
          <div style={{fontWeight:700, marginBottom:6, textAlign:'left'}}>
            {sensor.name || `סנסור #${sensor.id}`}
          </div>
          <div className="kv">
            <div>מס׳</div><div>{sensor.id}</div>
            <div>סוג</div><div>{sensor.type || 'לא ידוע'}</div>
            <div>מיקום</div><div>{sensor.x},{sensor.y}</div>
            <div>סטטוס</div><div>{sensor.__offline ? 'לא מגיב' : (sensor.is_active ? 'פעיל' : 'כבוי')}</div>
          </div>
          {vals.length>0 && (
            <div style={{marginTop:8}}>
              <div style={{fontWeight:600, marginBottom:4, textAlign:'left'}}>קריאות אחרונות</div>
              {vals.map(v => (
                <div key={v.id} className="sub" style={{textAlign:'left'}}>
                  {v.metric}: {v.value} {v.unit} ({new Date(v.recorded_at).toLocaleString()})
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
