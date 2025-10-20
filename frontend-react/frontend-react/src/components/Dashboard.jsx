import AreasPanel from './AreasPanel.jsx';
import AreaMap from './AreaMap.jsx';
import ErrorBanner from './ErrorBanner.jsx';
import StatusBadge from './StatusBadge.jsx';
import ShadingCard from './ShadingCard.jsx';
import SensorDrawer from './SensorDrawer.jsx';

export default function Dashboard({
  areas = [], areaId, onPickArea,
  sensors = [], selectedSensor, selectedValues,
  loading, error,
  adminMode, setAdminMode,
  onAddArea, onEditArea, onDeleteArea,
  onAddSensor, onAddShade,
  onDeleteSensorFromDrawer, onToggleActiveFromDrawer,
  onMoveSensor, onCloseDrawer,
  onMapSizeDetected, onPlaceRequest,
  onShadeAutoApply,
  onSelectSensor,                
  onEditSensorFromDrawer,        
}) {
  const area = (areas || []).find(a => a.id === areaId) || null;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="hbar">
          <h1 className="title">מערכת ניהול סנסורים וקמפוס</h1>
          <button
            className={`iconbtn ${adminMode ? 'green' : 'red'}`}
            title={adminMode ? 'מצב מנהל פעיל' : 'הפעל מצב מנהל'}
            onClick={() => setAdminMode(v => !v)}
          >⚙</button>
        </div>
        <small className="sub">הוספת אזורים וסנסורים, תמונות מפה וגרירת נקודות</small>

        <div className="toolbar" style={{ marginTop: 10 }}>
          <button className="btn" onClick={onAddArea}>אזור חדש</button>
          <button className="btn" onClick={onEditArea} disabled={!area}>ערוך אזור</button>
          <button className="btn" onClick={onDeleteArea} disabled={!area}>מחק אזור</button>
        </div>

        <AreasPanel areas={areas} activeAreaId={areaId} currentAreaId={areaId} onPickArea={onPickArea} />

        <ShadingCard areaId={areaId} sensors={sensors} adminMode={adminMode} onAutoApply={onShadeAutoApply} />

        {adminMode && (
          <div className="section toolbar">
            <button className="btn" onClick={onAddSensor} disabled={!area}>הוסף סנסור במפה</button>
            <button className="btn" onClick={onAddShade} disabled={!area}>הוסף מערכת הצללה</button>
          </div>
        )}
      </aside>

      <main className="main">
        <div className="header">
          <div className="hbar">
            <div className="title">מפה</div>
            <StatusBadge ok text={`${sensors?.length || 0} סנסורים`} />
          </div>
          {loading ? <div className="sub">טוען...</div> : null}
        </div>

        <ErrorBanner message={error} />

        <AreaMap
          area={area}
          sensors={sensors}
          adminMode={adminMode}
          onMoveSensor={onMoveSensor}
          onSelect={onSelectSensor}         
          onSelectSensor={onSelectSensor}    
          onMapSize={onMapSizeDetected}
          onPlaceRequest={onPlaceRequest}
        />
      </main>

      <SensorDrawer
        sensor={selectedSensor}
        values={selectedValues}
        onClose={onCloseDrawer}
        onEdit={onEditSensorFromDrawer}
        onDelete={onDeleteSensorFromDrawer}
        onToggleActive={onToggleActiveFromDrawer}
      />
    </div>
  );
}
