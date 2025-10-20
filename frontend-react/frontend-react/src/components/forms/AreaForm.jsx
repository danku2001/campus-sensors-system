import { useState } from 'react';
export default function AreaForm({ initial = {}, onSubmit }) {
  const [name, setName] = useState(initial.name || '');
  const [image_url, setImageUrl] = useState(initial.image_url || '');
  const [width, setWidth] = useState(initial.width ?? '');
  const [height, setHeight] = useState(initial.height ?? '');
  return (
    <form onSubmit={e => { e.preventDefault();
      onSubmit({ name: name.trim(), image_url: image_url.trim() || null,
        width: width === '' ? null : Number(width),
        height: height === '' ? null : Number(height) }); }}>
      <div className="kv" style={{marginBottom:10}}>
        <label>שם</label><input value={name} onChange={e=>setName(e.target.value)} required />
        <label>קישור לתמונת מפה</label><input value={image_url} onChange={e=>setImageUrl(e.target.value)} placeholder="https://..." />
        <label>רוחב מפה</label><input type="number" value={width} onChange={e=>setWidth(e.target.value)} />
        <label>גובה מפה</label><input type="number" value={height} onChange={e=>setHeight(e.target.value)} />
      </div>
      <button className="btn" type="submit">שמור</button>
    </form>
  );
}
