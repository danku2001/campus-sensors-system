import { useEffect, useState } from 'react';
import './styles.css';

import Dashboard from './components/Dashboard.jsx';
import Modal from './components/Modal.jsx';
import AreaForm from './components/forms/AreaForm.jsx';
import SensorForm from './components/forms/SensorForm.jsx';
import { ToastProvider, useToasts } from './components/Toasts.jsx';

import { listAreas, createArea, updateArea, deleteArea } from './api/areas';
import {
  listSensors, createSensor, updateSensor, deleteSensor,
  updateSensorPosition, setSensorActive, getSensorValues
} from './api/sensors';

function AppInner(){
  const { push } = useToasts();

  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState(null);

  const [sensors, setSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [selectedValues, setSelectedValues] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminMode, setAdminMode] = useState(false);

  const [areaModalOpen, setAreaModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);

  const [sensorModalOpen, setSensorModalOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState(null);

  const [placeMode, setPlaceMode] = useState(null);

  const [sensorSavedTick, setSensorSavedTick] = useState(0);

  // טעינת אזורים
  useEffect(() => {
    setLoading(true);
    listAreas()
      .then(xs => { setAreas(xs || []); if (xs && xs[0]) setAreaId(xs[0].id); })
      .catch(e => { setError(e.message || ''); push('error','טעינת אזורים נכשלה'); })
      .finally(() => setLoading(false));
  }, []);

  // טעינת סנסורים לפי אזור
  useEffect(() => {
    if (!areaId){ setSensors([]); return; }
    let alive = true;
    setLoading(true);
    listSensors(areaId)
      .then(xs => { if (alive) setSensors(xs || []); })
      .catch(e => { setError(e.message || ''); push('error','טעינת סנסורים נכשלה'); })
      .finally(() => setLoading(false));
    return () => { alive = false; };
  }, [areaId, push]);

  // בחירה לדרואר
  async function onSelectSensor(s){
    if (!s) return;
    setSelectedSensor(s);
    try{
      const vs = await getSensorValues(s.id, 50);
      setSelectedValues(Array.isArray(vs) ? vs : []);
    }catch{ setSelectedValues([]); }
  }

  // פתיחת עריכה מתוך הדרואר
  function openEditSensorFromDrawer(s){
    if (!s) return;
    setEditingSensor({ ...s });     // מעבירים id כדי לדעת שזה EDIT
    setSensorModalOpen(true);
  }

  // קיבוע נקודה חדשה מהמפה
  function onPlaceRequest(x, y){
    if (!adminMode) return;
    if (!placeMode) return;
    const base = placeMode === 'shade'
      ? { name:'Shading', type:'shade', is_active:true }
      : { name:'Sensor',  type:'',      is_active:true };
    setEditingSensor({ ...base, x, y, area_id: areaId });
    setSensorModalOpen(true);
    setPlaceMode(null);
  }

  // פעולות אזור
  function openAddArea(){ setEditingArea(null); setAreaModalOpen(true); }
  function openEditArea(){
    const a = (areas || []).find(x => x.id === areaId);
    if (!a) return;
    setEditingArea(a); setAreaModalOpen(true);
  }
  async function onSubmitArea(payload){
    try{
      if (editingArea){
        const upd = await updateArea(editingArea.id, payload);
        setAreas(xs => xs.map(a => a.id===upd.id ? upd : a));
      }else{
        const created = await createArea(payload);
        setAreas(xs => [...xs, created]); setAreaId(created.id);
      }
      setAreaModalOpen(false); setEditingArea(null);
    }catch(e){ setError(e.message||''); }
  }
  async function onDeleteArea(){
    if (!areaId) return;
    if (!confirm('למחוק את האזור?')) return;
    try{
      await deleteArea(areaId);
      setAreas(xs => xs.filter(a => a.id !== areaId));
      setAreaId(null); setSensors([]); setSelectedSensor(null);
    }catch(e){ setError(e.message||''); }
  }

  // פעולות סנסור
  function openAddSensor(){
    if (!areaId) return;
    setPlaceMode('sensor');
    alert('לחץ במפה כדי למקם סנסור');
  }
  function openAddShade(){
    if (!areaId) return;
    setPlaceMode('shade');
    alert('לחץ במפה כדי למקם מערכת הצללה');
  }

  async function onSubmitSensor(formData){
    try{
      if (editingSensor && editingSensor.id){
        const upd = await updateSensor(editingSensor.id, formData);
        setSensors(xs => xs.map(s => s.id===upd.id ? upd : s));
        setSelectedSensor(null);            // סוגר דרואר
        setSensorSavedTick(t => t+1);       // חיווי "נשמר ✓"
        push('info','הסנסור עודכן');
      }else{
        const created = await createSensor({ ...formData, area_id: areaId });
        setSensors(xs => [...xs, created]);
        push('info','סנסור נוסף');
      }
      setSensorModalOpen(false);
      setEditingSensor(null);
    }catch(e){ setError(e.message||''); push('error','שמירת סנסור נכשלה'); }
  }

  async function onDeleteSensorFromDrawer(){
    if (!selectedSensor) return;
    if (!confirm('למחוק את הסנסור?')) return;
    try{
      await deleteSensor(selectedSensor.id);
      setSensors(xs => xs.filter(s => s.id !== selectedSensor.id));
      setSelectedSensor(null); setSelectedValues([]);
      push('info','סנסור נמחק');
    }catch(e){ setError(e.message||''); }
  }
  async function onToggleActiveFromDrawer(){
    if (!selectedSensor) return;
    try{
      const upd = await setSensorActive(selectedSensor.id, !selectedSensor.is_active);
      setSensors(xs => xs.map(s => s.id===upd.id ? upd : s));
      setSelectedSensor(upd);
    }catch(e){ setError(e.message||''); }
  }
  async function onMoveSensor(id, x, y){
    try{
      const upd = await updateSensorPosition(id, x, y);
      setSensors(xs => xs.map(s => s.id===id ? upd : s));
      if (selectedSensor && selectedSensor.id===id) setSelectedSensor(upd);
    }catch(e){ setError(e.message||''); }
  }

  function onCloseDrawer(){ setSelectedSensor(null); setSelectedValues([]); }

  async function onMapSizeDetected(nw, nh){
    const a = (areas||[]).find(x => x.id === areaId);
    if (!a) return;
    if (!a.width || !a.height){
      try{
        const upd = await updateArea(a.id, { width:nw, height:nh });
        setAreas(xs => xs.map(z => z.id===upd.id ? upd : z));
      }catch{}
    }
  }

  async function onShadeAutoApply(shouldOpen){
    try{
      const shades = (sensors||[]).filter(s => (s.type||'').toLowerCase()==='shade');
      for (const sh of shades){
        if (Boolean(sh.is_active) !== Boolean(shouldOpen)){
          const upd = await setSensorActive(sh.id, shouldOpen);
          setSensors(xs => xs.map(s => s.id===upd.id ? upd : s));
          if (selectedSensor && selectedSensor.id===upd.id) setSelectedSensor(upd);
        }
      }
    }catch(e){ setError(e.message||''); }
  }

  return (
    <>
      <Dashboard
        areas={areas}
        areaId={areaId}
        onPickArea={setAreaId}
        sensors={sensors}
        selectedSensor={selectedSensor}
        selectedValues={selectedValues}
        loading={loading}
        error={error}
        adminMode={adminMode}
        setAdminMode={setAdminMode}
        onAddArea={openAddArea}
        onEditArea={openEditArea}
        onDeleteArea={onDeleteArea}
        onAddSensor={openAddSensor}
        onAddShade={openAddShade}
        onDeleteSensorFromDrawer={onDeleteSensorFromDrawer}
        onToggleActiveFromDrawer={onToggleActiveFromDrawer}
        onMoveSensor={onMoveSensor}
        onCloseDrawer={onCloseDrawer}
        onMapSizeDetected={onMapSizeDetected}
        onPlaceRequest={onPlaceRequest}
        onShadeAutoApply={onShadeAutoApply}
        onSelectSensor={onSelectSensor}
        onEditSensorFromDrawer={openEditSensorFromDrawer}
        // חיווי נשמר לדרואר
        sensorSavedTick={sensorSavedTick}
      />

      {/* מודל אזור */}
      <Modal
        open={!!areaModalOpen}
        title={editingArea ? 'עריכת אזור' : 'אזור חדש'}
        onClose={() => { setAreaModalOpen(false); setEditingArea(null); }}
      >
        <AreaForm initial={editingArea || {}} onSubmit={onSubmitArea} />
      </Modal>

      {/* מודל סנסור */}
      <Modal
        open={!!sensorModalOpen}
        title={editingSensor?.id ? 'עריכת סנסור' : (editingSensor?.type==='shade' ? 'מערכת הצללה חדשה' : 'סנסור חדש')}
        onClose={() => { setSensorModalOpen(false); setEditingSensor(null); }}
      >
        <SensorForm
          initial={editingSensor || {}}
          areaId={areaId}
          onSubmit={onSubmitSensor}
        />
      </Modal>
    </>
  );
}

export default function App(){ return (<ToastProvider><AppInner/></ToastProvider>); }