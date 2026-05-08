import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { path: "/", label: "Tableau de Bord", icon: "⊞" },
  { path: "/alerts", label: "Alertes", icon: "⚠️" },
  { path: "/journal", label: "Journal d'Incidents", icon: "📋" },
  { path: "/ai", label: "Assistant IA", icon: "🤖" },
  { path: "/settings", label: "Paramètres", icon: "⚙️" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{
      width: 230,
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)",
      borderRight: "1px solid #1e3a5f",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* LOGO OCP */}
      <div style={{
        padding: "24px 20px",
        borderBottom: "1px solid #1e3a5f",
        background: "rgba(255,255,255,0.03)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42,
            background: "linear-gradient(135deg, #006DB7, #00A651)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "#fff",
            boxShadow: "0 4px 15px rgba(0,109,183,0.4)",
          }}>O</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>OCP Group</div>
            <div style={{ fontSize: 10, color: "#4d9fff", fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase" }}>Digit'All Manufacturing</div>
          </div>
        </div>
        <div style={{
          marginTop: 12, padding: "6px 10px",
          background: "rgba(0,166,81,0.15)",
          border: "1px solid rgba(0,166,81,0.3)",
          borderRadius: 6,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00A651", boxShadow: "0 0 6px #00A651" }}></div>
          <span style={{ fontSize: 11, color: "#00A651", fontWeight: 600 }}>Système opérationnel</span>
        </div>
      </div>

      {/* MENU */}
      <div style={{ padding: "16px 12px", flex: 1 }}>
        <div style={{ fontSize: 10, color: "#475569", fontWeight: 700, letterSpacing: 2, padding: "0 8px", marginBottom: 8 }}>
          NAVIGATION
        </div>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 10, marginBottom: 4,
                cursor: "pointer",
                background: isActive
                  ? "linear-gradient(135deg, rgba(0,109,183,0.3), rgba(0,166,81,0.15))"
                  : "transparent",
                border: isActive ? "1px solid rgba(0,109,183,0.4)" : "1px solid transparent",
                color: isActive ? "#fff" : "#64748b",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#94a3b8"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = isActive ? "#fff" : "#64748b"; }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: isActive ? "rgba(0,109,183,0.4)" : "rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15,
              }}>{item.icon}</div>
              <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              {isActive && (
                <div style={{
                  marginLeft: "auto", width: 6, height: 6,
                  borderRadius: "50%", background: "#4d9fff",
                }}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div style={{
        padding: "16px 20px",
        borderTop: "1px solid #1e3a5f",
        background: "rgba(255,255,255,0.02)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, #006DB7, #00A651)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#fff",
          }}>OP</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Opérateur OCP</div>
            <div style={{ fontSize: 10, color: "#475569" }}>Jorf Lasfar · El Jadida</div>
          </div>
        </div>
        <div style={{
          padding: "6px 10px",
          background: "rgba(0,109,183,0.1)",
          border: "1px solid rgba(0,109,183,0.2)",
          borderRadius: 6,
          fontSize: 10, color: "#4d9fff", textAlign: "center",
        }}>
          PFE 2024–2025 · FST Mohammadia
        </div>
      </div>
    </div>
  );
}