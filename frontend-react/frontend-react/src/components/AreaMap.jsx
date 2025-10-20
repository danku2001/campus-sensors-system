import SensorDot from './SensorDot.jsx';

export default function AreaMap({
  area,
  sensors = [],
  adminMode = false,
  onMoveSensor = () => {},
  onSelect,                 
  onSelectSensor,             
  onMapSize = () => {},
  onPlaceRequest = () => {},
}) {
  const img = area?.image_url || null;
  const handleSelect = onSelect || onSelectSensor || (() => {});

  function onImgLoad(e){
    const nw = e.currentTarget.naturalWidth;
    const nh = e.currentTarget.naturalHeight;
    onMapSize(nw, nh);
  }

  function onMapClick(e){
    if (!adminMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nw = area?.width || rect.width;
    const nh = area?.height || rect.height;
    const x = Math.round(((e.clientX - rect.left) / rect.width) * nw);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * nh);
    onPlaceRequest(x, y);
  }

  return (
    <div className="mapwrap" onClick={onMapClick}>
      {img
        ? <img className="map" src={img} alt="map" onLoad={onImgLoad} />
        : <div className="map" style={{display:'grid',placeItems:'center'}}>אין מפה מוגדרת</div>}

      {(sensors || []).map(s => (
        <SensorDot
          key={s.id}
          sensor={s}
          area={area}
          adminMode={adminMode}
          onMoved={onMoveSensor}
          onSelect={handleSelect}
        />
      ))}

      <div className="legend">
        <span className="legendItem"><span className="legendIcon ok"></span>פעיל</span>
        <span className="legendItem"><span className="legendIcon bad"></span>כבוי</span>
        <span className="legendItem"><span className="legendIcon diamond"></span>הצללה</span>
      </div>
    </div>
  );
}
