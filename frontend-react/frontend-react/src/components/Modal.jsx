export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.5)', display:'grid', placeItems:'center', zIndex:9999}}>
      <div style={{width:460, background:'#0b1220', border:'1px solid var(--border)', borderRadius:16, padding:16}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
          <div style={{fontWeight:700}}>{title}</div>
          <button className="btn" onClick={onClose}>סגור</button>
        </div>
        {children}
      </div>
    </div>
  );
}
