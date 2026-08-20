/* ============================================================
   illustrations.jsx — neon SVG hero art (stylised, self-contained)
   Each component prefixes its gradient ids to avoid collisions.
   ============================================================ */

// faceted crystal medallion with a centre glyph (H / A1 ...)
function CrystalMedallion({ size = 120, glyph = "H", hue = "purple" }) {
  const id = "cm" + glyph;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <defs>
        <radialGradient id={id + "g"} cx="50%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#f6d9ff" />
          <stop offset="40%" stopColor="#b97bf0" />
          <stop offset="100%" stopColor="#5a2fae" />
        </radialGradient>
        <linearGradient id={id + "e"} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff8ee8" />
          <stop offset="100%" stopColor="#5b6bff" />
        </linearGradient>
        <filter id={id + "f"} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id}f)`}>
        <polygon points="60,8 104,30 104,78 60,112 16,78 16,30" fill={`url(#${id}g)`} opacity="0.92" />
        <polygon points="60,8 104,30 60,52 16,30" fill="#e9c4ff" opacity="0.55" />
        <polygon points="16,30 60,52 60,112 16,78" fill="#7e45c9" opacity="0.85" />
        <polygon points="104,30 104,78 60,112 60,52" fill="#9d5fe0" opacity="0.8" />
        <g stroke={`url(#${id}e)`} strokeWidth="1.4" opacity="0.9" fill="none">
          <polygon points="60,8 104,30 104,78 60,112 16,78 16,30" />
          <path d="M60,8 L60,52 M16,30 L60,52 L104,30 M60,52 L60,112" />
        </g>
      </g>
      <text x="60" y="74" textAnchor="middle" fontFamily="Geist, serif" fontWeight="900"
        fontSize={glyph.length > 1 ? 30 : 40} fill="#fff" opacity="0.95"
        style={{ filter: "drop-shadow(0 0 6px rgba(255,200,255,.8))" }}>{glyph}</text>
    </svg>
  );
}

// AI cube + rising arrow + bar chart (home banner)
function AiCubeChart({ w = 170, h = 150 }) {
  return (
    <svg width={w} height={h} viewBox="0 0 170 150" fill="none">
      <defs>
        <linearGradient id="acc_cube" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ea0ff" /><stop offset="100%" stopColor="#1b46c9" />
        </linearGradient>
        <linearGradient id="acc_arrow" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff5ed8" /><stop offset="100%" stopColor="#ffa14b" />
        </linearGradient>
        <radialGradient id="acc_glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3a6bff" stopOpacity="0.5" /><stop offset="100%" stopColor="#3a6bff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="95" cy="120" rx="75" ry="22" fill="url(#acc_glow)" />
      {/* platform grid */}
      <g stroke="#2e6bff" strokeWidth="1" opacity="0.5">
        <path d="M30,124 L95,108 L165,124 L100,142 Z" fill="#0a1840" />
        <path d="M55,118 L120,134 M80,112 L145,128 M50,128 L115,112" opacity="0.4" />
      </g>
      {/* bars */}
      <g>
        {[[118,86,12,28],[133,74,12,40],[148,64,12,50]].map((b,i)=>(
          <rect key={i} x={b[0]} y={b[1]} width={b[2]} height={b[3]} rx="2" fill="url(#acc_arrow)" opacity="0.85"/>
        ))}
      </g>
      {/* arrow */}
      <path d="M40,108 C70,104 78,70 118,44" stroke="url(#acc_arrow)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M110,38 L124,40 L118,54 Z" fill="#ffa14b"/>
      {/* cube */}
      <g style={{ filter: "drop-shadow(0 0 12px rgba(70,120,255,.7))" }}>
        <path d="M58,30 L84,18 L110,30 L84,42 Z" fill="#6fb0ff"/>
        <path d="M58,30 L58,62 L84,74 L84,42 Z" fill="url(#acc_cube)"/>
        <path d="M110,30 L110,62 L84,74 L84,42 Z" fill="#2b58cf"/>
        <g stroke="#9fd0ff" strokeWidth="1" opacity="0.7" fill="none">
          <path d="M58,30 L84,42 L110,30 M84,42 L84,74"/>
        </g>
        <text x="84" y="50" textAnchor="middle" fontFamily="Geist" fontWeight="800" fontSize="15" fill="#eaf4ff">AI</text>
      </g>
    </svg>
  );
}

// crystal cube with check + orbit (success)
function CrystalCheck({ size = 150 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 150 150" fill="none">
      <defs>
        <radialGradient id="cc_g" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#f3d6ff"/><stop offset="55%" stopColor="#a361e6"/><stop offset="100%" stopColor="#5b2fa8"/>
        </radialGradient>
        <linearGradient id="cc_orbit" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff7ee0"/><stop offset="100%" stopColor="#6b8bff"/>
        </linearGradient>
      </defs>
      <g stroke="url(#cc_orbit)" strokeWidth="1.6" fill="none" opacity="0.8">
        <ellipse cx="75" cy="80" rx="66" ry="24" transform="rotate(-18 75 80)"/>
        <ellipse cx="75" cy="80" rx="58" ry="16" transform="rotate(14 75 80)" opacity="0.6"/>
      </g>
      <g style={{ filter: "drop-shadow(0 0 16px rgba(170,90,240,.7))" }}>
        <path d="M75,18 L120,44 L120,92 L75,118 L30,92 L30,44 Z" fill="url(#cc_g)" opacity="0.95"/>
        <path d="M75,18 L120,44 L75,70 L30,44 Z" fill="#ecccff" opacity="0.5"/>
        <path d="M30,44 L75,70 L75,118 L30,92 Z" fill="#6b3bb5" opacity="0.7"/>
        <g stroke="#f0d8ff" strokeWidth="1.3" fill="none" opacity="0.85">
          <path d="M75,18 L75,70 M30,44 L75,70 L120,44"/>
        </g>
      </g>
      <path d="M58,72 L70,84 L94,56" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,.9))" }}/>
      {[...Array(8)].map((_,i)=>{const a=i/8*6.28; return <circle key={i} cx={75+Math.cos(a)*64} cy={80+Math.sin(a)*30} r="1.5" fill="#e9c8ff"/>;})}
    </svg>
  );
}

// AI gem hologram + side screens (AI diagnosis banner)
function AiGemHologram({ w = 160, h = 150 }) {
  return (
    <svg width={w} height={h} viewBox="0 0 160 150" fill="none">
      <defs>
        <radialGradient id="ag_g" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#ffd0f2"/><stop offset="50%" stopColor="#b25ef0"/><stop offset="100%" stopColor="#4a2fae"/>
        </radialGradient>
        <linearGradient id="ag_ring" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff5ed8"/><stop offset="50%" stopColor="#a45cff"/><stop offset="100%" stopColor="#2e6bff"/>
        </linearGradient>
      </defs>
      {/* side floating screens */}
      <g opacity="0.7" stroke="#5e7bff" strokeWidth="1" fill="rgba(40,60,160,.25)">
        <rect x="6" y="34" width="34" height="24" rx="3"/><rect x="10" y="70" width="34" height="24" rx="3"/>
        <rect x="120" y="30" width="34" height="24" rx="3"/><rect x="120" y="68" width="34" height="24" rx="3"/>
      </g>
      <g stroke="#7da0ff" strokeWidth="1" opacity="0.55">
        <path d="M12,40 l8,-4 l6,6 l8,-3 M14,80 l8,3 l6,-5 l8,4"/>
        <path d="M126,40 l8,3 l6,-5 l8,4 M126,78 l8,-3 l6,5 l8,-4"/>
      </g>
      {/* base ring */}
      <ellipse cx="80" cy="118" rx="48" ry="13" fill="none" stroke="url(#ag_ring)" strokeWidth="2.4"
        style={{ filter: "drop-shadow(0 0 8px rgba(160,90,255,.8))" }}/>
      <ellipse cx="80" cy="118" rx="30" ry="7" fill="none" stroke="#3a6bff" strokeWidth="1.4" opacity="0.7"/>
      {/* gem */}
      <g style={{ filter: "drop-shadow(0 0 16px rgba(170,90,240,.75))" }}>
        <path d="M80,30 L112,52 L104,92 L80,108 L56,92 L48,52 Z" fill="url(#ag_g)" opacity="0.95"/>
        <path d="M80,30 L112,52 L80,64 L48,52 Z" fill="#f0ccff" opacity="0.5"/>
        <path d="M48,52 L80,64 L80,108 L56,92 Z" fill="#5e34ad" opacity="0.7"/>
        <g stroke="#f3d8ff" strokeWidth="1.2" fill="none" opacity="0.85"><path d="M80,30 L80,64 M48,52 L80,64 L112,52 M56,92 L80,64 L104,92"/></g>
        <text x="80" y="76" textAnchor="middle" fontFamily="Geist" fontWeight="900" fontSize="22" fill="#fff"
          style={{ filter: "drop-shadow(0 0 5px rgba(255,180,255,.9))" }}>AI</text>
      </g>
    </svg>
  );
}

// neon megaphone (announcement banner)
function Megaphone({ w = 160, h = 140 }) {
  return (
    <svg width={w} height={h} viewBox="0 0 160 140" fill="none">
      <defs>
        <linearGradient id="mg_b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c06bff"/><stop offset="100%" stopColor="#3a6bff"/>
        </linearGradient>
        <linearGradient id="mg_p" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff5ed8"/><stop offset="100%" stopColor="#a45cff"/>
        </linearGradient>
      </defs>
      <ellipse cx="84" cy="118" rx="62" ry="14" fill="none" stroke="url(#mg_p)" strokeWidth="2"
        style={{ filter: "drop-shadow(0 0 8px rgba(180,90,255,.7))" }}/>
      {/* paper sheets */}
      <g opacity="0.85" style={{ filter: "drop-shadow(0 0 8px rgba(90,120,255,.5))" }}>
        <path d="M96,16 L140,16 L140,64 L96,64 Z" fill="rgba(40,55,140,.4)" stroke="#7da0ff" strokeWidth="1.2"/>
        <path d="M104,26 h26 M104,36 h26 M104,46 h18" stroke="#9fc0ff" strokeWidth="1.4"/>
      </g>
      {/* megaphone body */}
      <g style={{ filter: "drop-shadow(0 0 14px rgba(150,80,240,.7))" }}>
        <path d="M30,58 L70,44 L78,52 L78,86 L70,94 L30,80 Z" fill="url(#mg_b)"/>
        <path d="M30,58 L30,80 L18,76 L18,62 Z" fill="#7a3ad0"/>
        <rect x="70" y="44" width="9" height="50" rx="3" fill="#d9a6ff"/>
        <path d="M44,84 L44,98 L52,100 L50,86 Z" fill="#9d5fe0"/>
      </g>
      {/* sound waves */}
      <g stroke="url(#mg_p)" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.9">
        <path d="M86,52 q12,12 0,30"/><path d="M96,44 q20,20 0,46" opacity="0.7"/><path d="M106,38 q28,28 0,58" opacity="0.45"/>
      </g>
    </svg>
  );
}

// graduation cap on stacked books / server (training banner)
function GradStack({ w = 170, h = 150 }) {
  return (
    <svg width={w} height={h} viewBox="0 0 170 150" fill="none">
      <defs>
        <linearGradient id="gs_c" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d56bff"/><stop offset="100%" stopColor="#3a6bff"/>
        </linearGradient>
        <linearGradient id="gs_b" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff5ed8"/><stop offset="100%" stopColor="#6b8bff"/>
        </linearGradient>
      </defs>
      <ellipse cx="86" cy="128" rx="66" ry="15" fill="none" stroke="url(#gs_b)" strokeWidth="2" style={{ filter:"drop-shadow(0 0 8px rgba(160,90,255,.6))" }}/>
      {/* stacked slabs */}
      <g stroke="#7da0ff" strokeWidth="1.2" style={{ filter:"drop-shadow(0 0 8px rgba(90,120,255,.5))" }}>
        {[0,1,2].map((i)=>(
          <g key={i} transform={`translate(0 ${i*18})`}>
            <path d={`M50,${70} L86,${58} L122,${70} L86,${82} Z`} fill="rgba(50,40,120,.5)"/>
            <path d={`M50,${70} L50,${78} L86,${90} L86,${82} Z`} fill="rgba(30,24,80,.6)"/>
            <path d={`M122,${70} L122,${78} L86,${90} L86,${82} Z`} fill="rgba(70,50,160,.5)"/>
          </g>
        ))}
      </g>
      {/* grad cap */}
      <g style={{ filter:"drop-shadow(0 0 14px rgba(170,90,255,.7))" }}>
        <path d="M44,52 L86,36 L128,52 L86,68 Z" fill="url(#gs_c)"/>
        <path d="M70,60 L70,76 Q86,86 102,76 L102,60" fill="none" stroke="#d9a6ff" strokeWidth="2"/>
        <line x1="128" y1="52" x2="128" y2="74" stroke="#ff9ee6" strokeWidth="1.6"/>
        <circle cx="128" cy="76" r="3" fill="#ff5ed8"/>
      </g>
    </svg>
  );
}

// trophy (home invite)
function Trophy({ size = 84 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 84 84" fill="none">
      <defs>
        <linearGradient id="tr_g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0b0ff"/><stop offset="100%" stopColor="#6b8bff"/>
        </linearGradient>
      </defs>
      <g style={{ filter:"drop-shadow(0 0 12px rgba(150,100,255,.6))" }} stroke="url(#tr_g)" strokeWidth="2" fill="rgba(80,60,180,.18)">
        <path d="M28,20 L56,20 L54,40 Q42,52 30,40 Z"/>
        <path d="M28,24 Q16,24 18,34 Q20,42 30,40" fill="none"/>
        <path d="M56,24 Q68,24 66,34 Q64,42 54,40" fill="none"/>
        <path d="M42,50 L42,60 M32,64 L52,64 M36,60 L48,60" />
        <rect x="34" y="64" width="16" height="6" rx="2"/>
      </g>
    </svg>
  );
}

// register hero — profile silhouette under neon arc
function RegisterHero({ w = 360, h = 220 }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice" fill="none">
      <defs>
        <radialGradient id="rh_bg" cx="62%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#3a2b7a"/><stop offset="55%" stopColor="#1a1640"/><stop offset="100%" stopColor="#0a0820"/>
        </radialGradient>
        <linearGradient id="rh_face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6a4bd4"/><stop offset="60%" stopColor="#3a2a66"/><stop offset="100%" stopColor="#120e28"/>
        </linearGradient>
        <linearGradient id="rh_arc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff7ee0"/><stop offset="50%" stopColor="#a45cff"/><stop offset="100%" stopColor="#2e6bff"/>
        </linearGradient>
      </defs>
      <rect width="360" height="220" fill="url(#rh_bg)"/>
      {/* neon arc halo */}
      <path d="M210,8 a90,90 0 0 1 150,70" fill="none" stroke="url(#rh_arc)" strokeWidth="3" opacity="0.9"
        style={{ filter:"drop-shadow(0 0 10px rgba(180,100,255,.8))" }}/>
      {/* diagonal beam */}
      <path d="M120,220 L250,70" stroke="#5b6bff" strokeWidth="2" opacity="0.5"/>
      {/* profile silhouette */}
      <g transform="translate(196 26)">
        <path d="M70,30 Q96,28 104,66 Q110,96 96,128 Q120,140 130,194 L40,194 Q44,150 60,140 Q40,120 42,86 Q44,44 70,30 Z"
          fill="url(#rh_face)"/>
        <path d="M104,66 Q112,72 108,86" stroke="#c89bff" strokeWidth="1.5" fill="none" opacity="0.7"/>
        <ellipse cx="92" cy="58" rx="3" ry="4" fill="#ffb0e6" opacity="0.6"/>
      </g>
    </svg>
  );
}

// metric ring (AI diagnosis scores)
function MetricRing({ value = 88, label = "", note = "", color = "#a45cff", suffix = "" }) {
  const r = 22, c = 2 * Math.PI * r, pct = (typeof value === "number" ? value : parseInt(value)) / 100;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <svg width="58" height="58" viewBox="0 0 58 58">
        <circle cx="29" cy="29" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="4" />
        <circle cx="29" cy="29" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 29 29)"
          style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        <text x="29" y="33" textAnchor="middle" fontSize="9" fill="#cfd6ea" fontFamily="Geist">{label}</text>
      </svg>
      <div className="num" style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{value}{suffix}</div>
      <div style={{ fontSize: 11, color: note === "良好" ? "#f0c25a" : "#7fe0c0" }}>{note}</div>
    </div>
  );
}

// ===========================================================
// HeroGem — faceted crystal hexagon with orbit rings + a
// configurable centre (icon name / glyph text / check mark).
// Used for most success / detail / form hero banners.
// ===========================================================
function HeroGem({ w = 150, h = 140, icon = null, glyph = null, check = false, hue = 280 }) {
  const id = "hg" + Math.round(hue) + (icon || glyph || (check ? "ck" : "x"));
  const Ic = (typeof window !== "undefined" && window.Icon) || null;
  return (
    <svg width={w} height={h} viewBox="0 0 150 140" fill="none">
      <defs>
        <radialGradient id={id + "g"} cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#ffd6f6" /><stop offset="48%" stopColor="#b25ef0" /><stop offset="100%" stopColor="#4a2fae" />
        </radialGradient>
        <linearGradient id={id + "ring"} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff5ed8" /><stop offset="50%" stopColor="#a45cff" /><stop offset="100%" stopColor="#2e6bff" />
        </linearGradient>
      </defs>
      {/* orbit rings */}
      <g stroke={`url(#${id}ring)`} fill="none" opacity="0.85" style={{ filter: "drop-shadow(0 0 8px rgba(160,90,255,.6))" }}>
        <ellipse cx="75" cy="78" rx="64" ry="22" transform="rotate(-16 75 78)" strokeWidth="1.8" />
        <ellipse cx="75" cy="78" rx="54" ry="14" transform="rotate(12 75 78)" strokeWidth="1.3" opacity="0.6" />
      </g>
      {[...Array(10)].map((_, i) => { const a = i / 10 * 6.283; return <circle key={i} cx={75 + Math.cos(a) * 62} cy={78 + Math.sin(a) * 26} r="1.4" fill="#e6c8ff" opacity="0.8" />; })}
      {/* crystal hexagon */}
      <g style={{ filter: "drop-shadow(0 0 16px rgba(170,90,240,.75))" }}>
        <path d="M75,20 L113,44 L113,90 L75,114 L37,90 L37,44 Z" fill={`url(#${id}g)`} opacity="0.95" />
        <path d="M75,20 L113,44 L75,66 L37,44 Z" fill="#f0ccff" opacity="0.5" />
        <path d="M37,44 L75,66 L75,114 L37,90 Z" fill="#5e34ad" opacity="0.72" />
        <path d="M113,44 L113,90 L75,114 L75,66 Z" fill="#8e51d8" opacity="0.7" />
        <g stroke="#f3d8ff" strokeWidth="1.2" fill="none" opacity="0.85"><path d="M75,20 L75,66 M37,44 L75,66 L113,44 M75,66 L75,114" /></g>
      </g>
      {/* centre */}
      {check && <path d="M60,68 L71,79 L92,55" stroke="#fff" strokeWidth="6.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 7px rgba(255,255,255,.9))" }} />}
      {glyph && <text x="75" y="80" textAnchor="middle" fontFamily="Geist, serif" fontWeight="900" fontSize={glyph.length > 1 ? 30 : 40} fill="#fff" style={{ filter: "drop-shadow(0 0 6px rgba(255,200,255,.85))" }}>{glyph}</text>}
      {icon && Ic && <g transform="translate(57 50)" style={{ filter: "drop-shadow(0 0 6px rgba(255,220,255,.9))" }}><Ic name={icon} size={36} color="#fff" strokeWidth={1.9} /></g>}
    </svg>
  );
}

Object.assign(window, {
  CrystalMedallion, AiCubeChart, CrystalCheck, AiGemHologram,
  Megaphone, GradStack, Trophy, RegisterHero, MetricRing, HeroGem,
});
