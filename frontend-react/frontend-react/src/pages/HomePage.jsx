import React, { useState } from "react";
import Toolbar from "../components/Toolbar";
import ShadingPanel from "../components/ShadingPanel";
import AreasPanel from "../components/AreasPanel";
import SensorsPanel from "../components/SensorsPanel";
import MapsPanel from "../components/MapsPanel";

export default function HomePage() {
  const [tab, setTab] = useState("shading");

  const onKpiUpdate = (k)=>{
    const elA = document.getElementById('kpi-areas');
    const elO = document.getElementById('kpi-open');
    const elU = document.getElementById('kpi-user');
    if (elA) elA.textContent = k.areas;
    if (elO) elO.textContent = k.open;
    if (elU) elU.textContent = k.user;
  };

  return (
    <div className="container" dir="rtl">
      <header className="header">
        <div className="brand">
          <div className="logo" />
          <div>
            <h1 className="title">מערכת ניהול סנסורים וקמפוס</h1>
            <p className="subtitle">שליטה במערכות - הצללה, אזורים, סנסורים ומפות</p>
          </div>
        </div>
      </header>

      <section className="kpi">
        <div className="card">
          <div className="label">מספר אזורים</div>
          <div id="kpi-areas" className="value">-</div>
        </div>
        <div className="card">
          <div className="label">פתוחים כעת</div>
          <div id="kpi-open" className="value">-</div>
        </div>
        <div className="card">
          <div className="label">שונו ידנית היום</div>
          <div id="kpi-user" className="value">-</div>
        </div>
      </section>

      <Toolbar tab={tab} setTab={setTab} />

      {tab === "shading" && <ShadingPanel onKpiUpdate={onKpiUpdate} />}
      {tab === "areas"   && <AreasPanel />}
      {tab === "sensors" && <SensorsPanel />}
      {tab === "maps"    && <MapsPanel />}

      <footer className="footer">© קמפוס חכם - פרויקט גמר</footer>
    </div>
  );
}
