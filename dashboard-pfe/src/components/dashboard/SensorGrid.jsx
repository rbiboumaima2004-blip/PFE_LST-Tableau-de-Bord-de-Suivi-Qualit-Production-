import React from "react";

export default function SensorGrid({ sensors = [] }) {
  return (
    <div className="grid-4">
      {sensors.map((s) => (
        <div key={`${s.sensor_id}-${s.ligne}`} className="card">

          {/* Sensor ID */}
          <div style={{ fontSize: 11, color: "#8b949e" }}>
            {s.sensor_id}
          </div>

          {/* Value */}
          <div style={{ fontSize: 18, fontWeight: "bold" }}>
            {s.value !== undefined ? s.value : "--"} {s.unit}
          </div>

          {/* Sensor Name */}
          <div style={{ fontSize: 12, color: "#e6edf3", marginTop: 4 }}>
            {s.sensor_name || "Capteur"}
          </div>

          {/* Ligne */}
          <div style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>
            {s.ligne}
          </div>

        </div>
      ))}
    </div>
  );
}