import { useEffect, useMemo, useState } from 'react';
import { getSensorValues } from '../api/sensors';

const RECENT_MS = 6000;

function loadCfg(areaId){
  try{ return JSON.parse(localStorage.getItem(`shading:${areaId}`) || '{}'); }catch{return {};}
}
function saveCfg(areaId, cfg){
  localStorage.setItem(`shading:${areaId}`, JSON.stringify(cfg));
}
function saveStamp(areaId){
  localStorage.setItem(`shading:${areaId}:savedAt`, String(Date.now()));
}
function isRecentlySaved(areaId){
  const v = Number(localStorage.getItem(`shading:${areaId}:savedAt`) || 0);
  return v && (Date.now() - v) < RECENT_MS;
}
function decide(basis, tempThr, lightThr){
  const t = basis.maxTemp, l = basis.maxLight;
  const enoughTemp = isFinite(t) && t >= tempThr;
  const enoughLight = isFinite(l) && l >= lightThr;
  return Boolean(enoughTemp && enoughLight);
}

export default function ShadingCard({ areaId, sensors, adminMode, onAutoApply }) {
  const [basis, setBasis] = useState({ maxTemp: NaN, maxLight: NaN, loading: false });

  const initial = useMemo(() => {
    const cfg = loadCfg(areaId) || {};
    return {
      tempThr: Number.isFinite(cfg.tempThr) ? cfg.tempThr : 40,
      lightThr: Number.isFinite(cfg.lightThr) ? cfg.lightThr : 70,
      auto: Boolean(cfg.auto),
    };
  }, [areaId]);

  const [tempThr, setTempThr] = useState(initial.tempThr);
  const [lightThr, setLightThr] = useState(initial.lightThr);
  const [auto, setAuto] = useState(initial.auto);

  const [recentSaved, setRecentSaved] = useState(isRecentlySaved(areaId));
  useEffect(() => {
    setRecentSaved(isRecentlySaved(areaId));
    const t = setInterval(() => setRecentSaved(isRecentlySaved(areaId)), 400);
    return () => clearInterval(t);
  }, [areaId]);

  useEffect(() => {
    let mounted = true;
    async function run(){
      setBasis(b => ({...b, loading:true}));
      const heads = sensors.slice(0, 10);
      const packs = await Promise.all(heads.map(s => getSensorValues(s.id, 10).catch(()=>[])));
      let t = -Infinity, l = -Infinity;
      packs.forEach(arr => arr.forEach(v => {
        const m = String(v.metric||'').toLowerCase();
        if (m.includes('temp') || m.includes('טמפ')) t = Math.max(t, Number(v.value));
        if (m.includes('light') || m.includes('אור')) l = Math.max(l, Number(v.value));
      }));
      if (!mounted) return;
      setBasis({ maxTemp: t, maxLight: l, loading:false });
    }
    run();
    return () => { mounted = false; };
  }, [areaId, sensors]);

  const shouldOpen = decide(basis, tempThr, lightThr);

  function doSave(){
    saveCfg(areaId, { tempThr, lightThr, auto });
    saveStamp(areaId);
    setRecentSaved(true);

    if (auto && onAutoApply) onAutoApply(shouldOpen);
  }

  const badgeText = shouldOpen ? 'מומלץ לפתוח' : 'מומלץ לסגור';
  const badgeClass = shouldOpen ? 'warn' : 'ok';

  return (
    <div className="section card">
      <div className="hbar">
        <h3>מערכת הצללה</h3>
        <div className="pillrow">
          {recentSaved && <span className="badge success">נשמר ✓</span>}
          <span className="badge"><span className={`dot ${badgeClass}`} />{badgeText}</span>
          <span className="pill"><span className="label">סף טמפ׳</span>{tempThr}°</span>
          <span className="pill"><span className="label">סף אור</span>{lightThr}%</span>
        </div>
      </div>

      {adminMode && (
        <div className="section" style={{marginTop:10}}>
          <div className="kv" style={{marginBottom:8}}>
            <label>סף טמפ׳ לפתיחה</label>
            <input type="number" value={tempThr} onChange={e=>setTempThr(Number(e.target.value))} />
            <label>סף אור לפתיחה</label>
            <input type="number" value={lightThr} onChange={e=>setLightThr(Number(e.target.value))} />
          </div>

          <div className="toolbar">
            <label style={{display:'flex',alignItems:'center',gap:8}}>
              <input
                type="checkbox"
                checked={auto}
                onChange={e => setAuto(e.target.checked)}
                title="הפעלת אוטומציה תיושם בעת שמירה"
              />
              מצב אוטומטי
            </label>

            <button className="btn" onClick={()=>onAutoApply && onAutoApply(true)}>פתח עכשיו</button>
            <button className="btn" onClick={()=>onAutoApply && onAutoApply(false)}>סגור עכשיו</button>
            <button className="btn" onClick={doSave}>שמור</button>
          </div>
        </div>
      )}
    </div>
  );
}
