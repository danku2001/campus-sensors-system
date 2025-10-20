import React, { useEffect, useState } from "react";
import { listSensors, createSensor, updateSensor, deleteSensor } from "../api/sensors";
import { listAreas } from "../api/areas";
import StatusBadge from "../components/StatusBadge";


export default function SensorsPanel() {
  const [rows, setRows] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ name:"", type:"", area_id:"", status:"active" });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [s, a] = await Promise.all([listSensors(), listAreas()]);
      setRows(Array.isArray(s)? s : s?.data || []);
      setAreas(Array.isArray(a)? a : a?.data || []);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    const payload = { 
      name: form.name.trim(),
      type: form.type.trim(),
      area_id: Number(form.area_id||0),
      status: form.status || "active"
    };
    await createSensor(payload);
    setForm({ name:"", type:"", area_id:"", status:"active" });
    await load();
  };

  const setRow = (id, key, val) => setRows(prev => prev.map(r => r.id===id ? { ...r, [key]: val } : r));
  const onSave = async (row) => {
    await updateSensor(row.id, {
      name: row.name,
      type: row.type,
      area_id: Number(row.area_id||0),
      status: row.status
    });
    setEditing(null);
    await load();
  };

  const onDelete = async (id) => {
    if (!window.confirm("למחוק סנסור?")) return;
    await deleteSensor(id);
    await load();
  };

  return (
    <section className="panel" dir="rtl">
      <h3 style={{marginTop:0}}>ניהול סנסורים</h3>

      <form onSubmit={onCreate} className="form-row" style={{marginBottom:12}}>
        <input className="input" placeholder="שם" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
        <input className="input" placeholder="סוג (לדוגמה: temp, light)" value={form.type} onChange={e=>setForm({...form,type:e.target.value})} required />
        <select className="input" value={form.area_id} onChange={e=>setForm({...form,area_id:e.target.value})} required>
          <option value="">בחר אזור</option>
          {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
          <option value="active">פעיל</option>
          <option value="inactive">לא פעיל</option>
        </select>
        <button className="btn-small" type="submit">הוסף סנסור</button>
      </form>

      {loading ? <div>טוען...</div> : (
        <table className="table">
          <thead>
            <tr><th>שם</th><th>סוג</th><th>אזור</th><th>סטטוס</th><th>פעולות</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{editing===r.id ? <input className="input" value={r.name||""} onChange={e=>setRow(r.id,"name",e.target.value)} /> : r.name}</td>
                <td>{editing===r.id ? <input className="input" value={r.type||""} onChange={e=>setRow(r.id,"type",e.target.value)} /> : r.type}</td>
                <td>
                  {editing===r.id
                    ? <select className="input" value={r.area_id||""} onChange={e=>setRow(r.id,"area_id",e.target.value)}>
                        <option value="">בחר אזור</option>
                        {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    : (areas.find(a=>a.id===r.area_id)?.name || r.area_id)}
                </td>
<td>
  {editing===r.id ? (
    <select
      className="input"
      value={r.is_active ? "active" : "inactive"}
      onChange={(e) =>
        setRow(r.id, "is_active", e.target.value === "active" ? 1 : 0)
      }
    >
      <option value="active">פעיל</option>
      <option value="inactive">לא פעיל</option>
    </select>
  ) : (
    <StatusBadge active={r.is_active} />
  )}
</td>

                <td className="actions">
                  {editing===r.id
                    ? <>
                        <button className="btn-small" onClick={()=>onSave(r)}>שמור</button>
                        <button className="btn-small" onClick={()=>setEditing(null)}>בטל</button>
                      </>
                    : <>
                        <button className="btn-small" onClick={()=>setEditing(r.id)}>ערוך</button>
                        <button className="btn-small" onClick={()=>onDelete(r.id)}>מחק</button>
                      </>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
