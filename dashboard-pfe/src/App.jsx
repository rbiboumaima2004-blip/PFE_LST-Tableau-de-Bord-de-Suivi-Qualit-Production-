import React from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Dashboard   from "./pages/Dashboard.jsx";
import Settings    from "./pages/Settings.jsx";
import Alerts      from "./pages/Alerts.jsx";
import Journal     from "./pages/Journal.jsx";
import AIAssistant from "./pages/AIAssistant.jsx";

function IconGrid()     { return React.createElement("svg", {width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2"}, React.createElement("rect",{x:"3",y:"3",width:"7",height:"7"}), React.createElement("rect",{x:"14",y:"3",width:"7",height:"7"}), React.createElement("rect",{x:"3",y:"14",width:"7",height:"7"}), React.createElement("rect",{x:"14",y:"14",width:"7",height:"7"})); }
function IconAlert()    { return React.createElement("svg", {width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2"}, React.createElement("path",{d:"M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"}), React.createElement("line",{x1:"12",y1:"9",x2:"12",y2:"13"}), React.createElement("line",{x1:"12",y1:"17",x2:"12.01",y2:"17"})); }
function IconJournal()  { return React.createElement("svg", {width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2"}, React.createElement("path",{d:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"}), React.createElement("polyline",{points:"14 2 14 8 20 8"}), React.createElement("line",{x1:"16",y1:"13",x2:"8",y2:"13"}), React.createElement("line",{x1:"16",y1:"17",x2:"8",y2:"17"})); }
function IconAI()       { return React.createElement("svg", {width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2"}, React.createElement("rect",{x:"2",y:"3",width:"20",height:"14",rx:"2"}), React.createElement("path",{d:"M8 21h8M12 17v4"})); }
function IconSettings() { return React.createElement("svg", {width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2"}, React.createElement("circle",{cx:"12",cy:"12",r:"3"}), React.createElement("path",{d:"M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"})); }

const MENU = [
  { path: "/",           label: "Tableau de Bord",    Icon: IconGrid     },
  { path: "/alertes",    label: "Alertes",             Icon: IconAlert    },
  { path: "/journal",    label: "Journal d Incidents", Icon: IconJournal  },
  { path: "/ai",         label: "Assistant IA",        Icon: IconAI       },
  { path: "/parametres", label: "Parametres",          Icon: IconSettings },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{width:240,minHeight:"100vh",background:"linear-gradient(180deg,#0a1628 0%,#0d1f3c 100%)",borderRight:"1px solid #1e3a5f",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,bottom:0,fontFamily:"'DM Sans','Segoe UI',sans-serif",zIndex:100}}>

      <div style={{padding:"20px 16px",borderBottom:"1px solid #1e3a5f"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:44,height:44,background:"linear-gradient(135deg,#006DB7,#00A651)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff",boxShadow:"0 4px 15px rgba(0,109,183,0.4)",flexShrink:0}}>O</div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#fff",lineHeight:1.2}}>OCP Group</div>
            <div style={{fontSize:10,color:"#4d9fff",fontWeight:600,letterSpacing:1.5,textTransform:"uppercase"}}>Digit All Manufacturing</div>
          </div>
        </div>
        <div style={{padding:"6px 12px",background:"rgba(0,166,81,0.15)",border:"1px solid rgba(0,166,81,0.3)",borderRadius:8,display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:"#00A651",boxShadow:"0 0 8px #00A651"}}></div>
          <span style={{fontSize:11,color:"#00A651",fontWeight:600}}>Systeme operationnel</span>
        </div>
      </div>

      <div style={{padding:"16px 12px",flex:1,overflowY:"auto"}}>
        <div style={{fontSize:10,color:"#475569",fontWeight:700,letterSpacing:2,padding:"0 8px",marginBottom:10,textTransform:"uppercase"}}>Navigation</div>
        {MENU.map(({path,label,Icon}) => {
          const active = location.pathname === path;
          return (
            <div key={path} onClick={() => navigate(path)}
              style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:10,marginBottom:4,cursor:"pointer",background:active?"linear-gradient(135deg,rgba(0,109,183,0.35),rgba(0,166,81,0.15))":"transparent",border:active?"1px solid rgba(77,159,255,0.4)":"1px solid transparent",color:active?"#fff":"#64748b",transition:"all 0.2s"}}>
              <div style={{width:34,height:34,borderRadius:8,flexShrink:0,background:active?"rgba(0,109,183,0.4)":"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",color:active?"#4d9fff":"#475569"}}>
                <Icon />
              </div>
              <span style={{fontSize:13,fontWeight:active?600:400,flex:1}}>{label}</span>
              {active && <div style={{width:6,height:6,borderRadius:"50%",background:"#4d9fff",boxShadow:"0 0 6px #4d9fff"}}></div>}
            </div>
          );
        })}
      </div>

      <div style={{padding:"16px",borderTop:"1px solid #1e3a5f"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{width:36,height:36,borderRadius:"50%",flexShrink:0,background:"linear-gradient(135deg,#006DB7,#00A651)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff"}}>OP</div>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:"#fff"}}>Operateur OCP</div>
            <div style={{fontSize:10,color:"#475569"}}>Jorf Lasfar, El Jadida</div>
          </div>
        </div>
        <div style={{padding:"6px 10px",background:"rgba(0,109,183,0.1)",border:"1px solid rgba(0,109,183,0.2)",borderRadius:6,fontSize:10,color:"#4d9fff",textAlign:"center"}}>
          PFE 2024-2025 - FST Mohammadia
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{display:"flex",minHeight:"100vh",background:"#0a0f1e"}}>
        <Sidebar />
        <div style={{marginLeft:240,flex:1,minHeight:"100vh"}}>
          <Routes>
            <Route path="/"           element={<Dashboard   />} />
            <Route path="/alertes"    element={<Alerts      />} />
            <Route path="/journal"    element={<Journal     />} />
            <Route path="/ai"         element={<AIAssistant />} />
            <Route path="/parametres" element={<Settings    />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
