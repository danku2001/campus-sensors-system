import { useEffect, useState } from 'react';

export default function SensorForm({ initial = {}, areaId, onSubmit }) {
  const [form, setForm] = useState({
    id: initial.id || null,
    name: initial.name || '',
    type: initial.type || '',
    x: initial.x ?? 0,
    y: initial.y ?? 0,
    is_active: Boolean(initial.is_active),
  });

  useEffect(() => {
    setForm({
      id: initial.id || null,
      name: initial.name || '',
      type: initial.type || '',
      x: initial.x ?? 0,
      y: initial.y ?? 0,
      is_active: Boolean(initial.is_active),
    });
  }, [initial]);

  function handleChange(e){
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : (name==='x'||name==='y' ? Number(value) : value) }));
  }

  function submit(e){
    e.preventDefault();
    onSubmit({
      id: form.id,            
      name: form.name.trim(),
      type: form.type.trim(),
      x: Number(form.x) || 0,
      y: Number(form.y) || 0,
      is_active: Boolean(form.is_active),
    });
  }

  return (
    <form onSubmit={submit}>
      {form.id ? (
        <div className="kv" style={{marginBottom:8}}>
          <div>מס׳</div><div>{form.id}</div>
        </div>
      ) : null}

      <div className="kv" style={{marginBottom:8}}>
        <label>שם</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Sensor A" />

        <label>סוג</label>
        <input name="type" value={form.type} onChange={handleChange} placeholder="temp / light / shade..." />

        <label>מיקום X</label>
        <input name="x" type="number" value={form.x} onChange={handleChange} />

        <label>מיקום Y</label>
        <input name="y" type="number" value={form.y} onChange={handleChange} />

        <label>סטטוס פעיל</label>
        <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} />
      </div>

      <div className="toolbar">
        <button type="submit" className="btn">שמור</button>
      </div>
    </form>
  );
}