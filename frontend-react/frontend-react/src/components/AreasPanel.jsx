import { useMemo, useState } from 'react';
import StatusBadge from './StatusBadge.jsx';

export default function AreasPanel({ areas, currentAreaId, onPickArea }) {
  const [q, setQ] = useState('');
  const grouped = useMemo(() => {
    const m = new Map();
    (areas||[]).forEach(a => {
      const match = /^בניין\s?\d+/i.test(a.name) ? a.name.match(/^בניין\s?\d+/i)[0] : 'אחר';
      if (!m.has(match)) m.set(match, []);
      m.get(match).push(a);
    });
    for (const arr of m.values()) arr.sort((x,y)=>String(x.name).localeCompare(String(y.name),'he'));
    return m;
  }, [areas]);

  const filteredEntries = [...grouped.entries()].map(([group, arr]) => {
    const f = q.trim() ? arr.filter(a => a.name.toLowerCase().includes(q.toLowerCase())) : arr;
    return [group, f];
  }).filter(([,arr]) => arr.length>0);

  return (
    <div className="section card">
      <div className="hbar">
        <div style={{fontWeight:700}}>אזורים</div>
        <StatusBadge ok text={`${areas?.length || 0} פעילים`} />
      </div>

      <div className="search" style={{marginTop:8}}>
        <input placeholder="חפש אזור / קומה" value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      <div className="list" style={{marginTop:10}}>
        {filteredEntries.map(([group, arr]) => (
          <div key={group} className="section">
            <div className="sub" style={{marginBottom:6}}>{group}</div>
            {arr.map(a => (
              <button key={a.id} className="item" onClick={() => onPickArea(a.id)}
                style={{borderColor: currentAreaId===a.id ? 'var(--accent)' : 'var(--border)'}}>
                <div style={{fontWeight:700, color:'var(--text)'}}>{a.name}</div>
                <div className="sub">{a.width || '-'}x{a.height || '-'}</div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
