import { createContext, useContext, useState, useCallback } from 'react';
const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((type, text) => {
    const id = Date.now() + Math.random();
    setItems(xs => [...xs, { id, type, text }]);
    setTimeout(() => setItems(xs => xs.filter(x => x.id !== id)), 3000);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div style={{position:'fixed', top:16, left:16, display:'grid', gap:8, zIndex:99999}}>
        {items.map(t => (
          <div key={t.id}
            style={{padding:'10px 14px', borderRadius:12, border:'1px solid var(--border)',
              background: t.type==='error' ? 'rgba(239,68,68,.16)' : 'rgba(56,189,248,.12)',
              color:'#e2e8f0', boxShadow:'0 10px 30px rgba(0,0,0,.25)'}}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export function useToasts(){ const ctx = useContext(ToastCtx); if(!ctx) throw new Error('useToasts inside provider'); return ctx; }
