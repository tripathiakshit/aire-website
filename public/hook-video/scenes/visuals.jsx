// scenes/visuals.jsx — shared visual components for the CAGE-IN hook video
// Palette = AIRE design-system tokens (colors_and_type.css), inlined for animation use.

const AIRE = {
  deep: '#0d1827',
  slate: '#1a2b3c',
  primary: '#0c498e',
  primaryDark: '#071f3d',
  gold: '#c9a84c',
  goldSoft: 'rgba(201,168,76,0.15)',
  secondary: '#a5c1da',
  fg1: '#f1f5f9',
  fg2: '#cbd5e1',
  fg3: '#94a3b8',
  display: "'Fraunces', Georgia, serif",
  sans: "'Inter', system-ui, sans-serif",
  mono: "ui-monospace, 'JetBrains Mono', Consolas, monospace",
};

// tween helper: progress 0..1 between start..end of absolute/local time t
function tw(t, start, end, ease = Easing.easeOutCubic) {
  if (end <= start) return t >= end ? 1 : 0;
  return ease(clamp((t - start) / (end - start), 0, 1));
}

// Resolve asset paths through the hidden #__assets div — lets the offline
// bundler rewrite static <img> srcs to data URIs while dev pages pass through.
function assetUrl(path) {
  const el = document.querySelector('#__assets [data-key="' + path + '"]');
  return el ? el.getAttribute('src') : path;
}

// Rise-in block
function Rise({ t, start, dur = 0.55, dy = 26, style, children }) {
  const p = tw(t, start, start + dur);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style }}>
      {children}
    </div>
  );
}

function Eyebrow({ children, color = AIRE.gold, size = 21, style }) {
  return (
    <div style={{
      fontFamily: AIRE.sans, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.28em', fontSize: size, color, ...style,
    }}>
      {children}
    </div>
  );
}

// Circular founder portrait with brand ring treatment
function Portrait({ t, start, size = 360, x, y, src = 'assets/amit-tripathi.jpg', pos = '50% 18%' }) {
  const p = tw(t, start, start + 0.7);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: size, height: size,
      opacity: p, transform: `translateY(${(1 - p) * 30}px)`,
    }}>
      <div style={{
        position: 'absolute', right: -26, bottom: -18, width: size * 0.38, height: size * 0.38,
        borderRadius: '50%', background: AIRE.goldSoft,
      }}></div>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden',
        border: '4px solid rgba(255,255,255,0.15)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
      }}>
        <img src={assetUrl(src)} alt="Dr. Amit Tripathi"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, filter: 'contrast(1.06) saturate(0.92)' }} />
      </div>
    </div>
  );
}

// ── The CAGE-IN gridding map visualization ───────────────────────────────────
const MAP_FAULTS = [
  'M 70 560 L 255 432 L 380 378 L 520 300 L 700 238 L 925 158',
  'M 295 622 L 418 470 L 532 418 L 642 328',
  'M 520 300 L 602 382 L 722 432 L 882 472',
];
const MAP_ANOMS = [
  { x: 380, y: 378, r: 34, h: 92 },
  { x: 642, y: 328, r: 44, h: 134 },
  { x: 700, y: 238, r: 30, h: 74 },
  { x: 532, y: 418, r: 26, h: 60 },
  { x: 255, y: 432, r: 30, h: 82 },
];

function GridMap({
  reveal = 1, gridP = 1, faultP = 1, anomP = 1, tilt = 0,
  zoomS = 1, originX = 50, originY = 50,
  flash = 0, pass = null, cross = 0, time = 0,
}) {
  const cols = 12, rows = 8;
  const hue = pass != null ? [0, 14, -10, 8][((pass % 4) + 4) % 4] : 0;
  const target = MAP_ANOMS[1];
  const pulse = 24 + 7 * Math.sin(time * 4.2);

  const vLines = [], hLines = [];
  for (let i = 1; i < cols; i++) {
    const p = clamp(gridP * 1.7 - i * 0.055, 0, 1);
    if (p > 0) vLines.push(
      <line key={'v' + i} x1={i * (1000 / cols)} y1="0" x2={i * (1000 / cols)} y2="640"
        pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p}
        stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" />
    );
  }
  for (let i = 1; i < rows; i++) {
    const p = clamp(gridP * 1.7 - i * 0.07 - 0.1, 0, 1);
    if (p > 0) hLines.push(
      <line key={'h' + i} x1="0" y1={i * (640 / rows)} x2="1000" y2={i * (640 / rows)}
        pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p}
        stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" />
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, perspective: 1600, overflow: 'hidden', background: '#0a131f' }}>
      <div style={{
        position: 'absolute', inset: 0,
        transform: `scale(${zoomS}) rotateX(${tilt * 15}deg)`,
        transformOrigin: `${originX}% ${originY}%`,
      }}>
        {/* grayscale base */}
        <img src="assets/cage-in-1.jpg" alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) brightness(0.42)' }} />
        {/* colored reveal */}
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }}>
          <img src="assets/cage-in-1.jpg" alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: `saturate(1.05) hue-rotate(${hue}deg)` }} />
        </div>
        {/* scan line */}
        {reveal > 0.001 && reveal < 0.999 && (
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: `${reveal * 100}%`, width: 3,
            background: AIRE.gold, boxShadow: `0 0 22px 4px rgba(201,168,76,0.8)`,
          }}></div>
        )}
        {/* grid + faults + anomalies */}
        <svg viewBox="0 0 1000 640" preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {vLines}{hLines}
          {MAP_FAULTS.map((d, i) => {
            const p = clamp(faultP * 1.4 - i * 0.18, 0, 1);
            return p > 0 ? (
              <path key={'f' + i} d={d} fill="none" pathLength="1"
                strokeDasharray="1" strokeDashoffset={1 - p}
                stroke={AIRE.gold} strokeWidth="3.2" strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.55))' }} />
            ) : null;
          })}
          {MAP_ANOMS.map((a, i) => {
            const p = clamp(anomP * 1.5 - i * 0.12, 0, 1);
            return p > 0 ? (
              <g key={'a' + i} opacity={p}>
                <circle cx={a.x} cy={a.y} r={a.r * p} fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="5 5" />
                <circle cx={a.x} cy={a.y} r="5" fill={AIRE.gold} />
              </g>
            ) : null;
          })}
          {/* drill crosshair */}
          {cross > 0.001 && (
            <g opacity={cross}>
              <line x1="0" y1={target.y} x2="1000" y2={target.y} stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
              <line x1={target.x} y1="0" x2={target.x} y2="640" stroke="rgba(255,255,255,0.45)" strokeWidth="1" />
              <circle cx={target.x} cy={target.y} r={pulse} fill="none" stroke={AIRE.gold} strokeWidth="2.6" />
              <circle cx={target.x} cy={target.y} r="7" fill={AIRE.gold} stroke="#fff" strokeWidth="1.5" />
            </g>
          )}
        </svg>
        {/* 3D anomaly pillars (rise during tilt) */}
        {tilt > 0.02 && MAP_ANOMS.map((a, i) => (
          <div key={'p' + i} style={{
            position: 'absolute', left: `${a.x / 10}%`, top: `${a.y / 6.4}%`,
            width: 20, height: tilt * a.h, transform: 'translate(-50%, -100%)',
            background: 'linear-gradient(to top, rgba(201,168,76,0.08), rgba(201,168,76,0.92))',
            borderRadius: 2, boxShadow: '0 0 18px rgba(201,168,76,0.45)', opacity: tilt,
          }}></div>
        ))}
        {/* update flash */}
        {flash > 0.001 && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(201,168,76,0.22)', opacity: flash }}></div>
        )}
      </div>
      {/* drill tag */}
      {cross > 0.001 && (
        <div style={{
          position: 'absolute', left: `calc(${(originX + 3)}% + 26px)`, top: `calc(${originY}% - 64px)`,
          fontFamily: AIRE.mono, fontSize: 16, letterSpacing: '0.08em', color: AIRE.gold,
          background: 'rgba(7,31,61,0.85)', border: '1px solid rgba(201,168,76,0.5)',
          padding: '7px 14px', borderRadius: 4, opacity: cross, whiteSpace: 'nowrap',
        }}>
          DH-23 — PROPOSED COLLAR
        </div>
      )}
      {/* pass badge */}
      {pass != null && (
        <div style={{
          position: 'absolute', top: 16, left: 16, fontFamily: AIRE.mono, fontSize: 17,
          letterSpacing: '0.1em', color: AIRE.gold, background: 'rgba(7,31,61,0.85)',
          border: '1px solid rgba(201,168,76,0.45)', padding: '7px 14px', borderRadius: 4,
        }}>
          CONSTRAINED PASS {pass}
        </div>
      )}
    </div>
  );
}

// ── App window chrome ────────────────────────────────────────────────────────
function AppWindow({ x, y, w, h, scale = 1, opacity = 1, children }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, height: h,
      transform: `scale(${scale})`, transformOrigin: 'center', opacity,
      background: AIRE.slate, borderRadius: 10, overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 40px 100px rgba(0,0,0,0.55)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ height: 4, background: AIRE.gold, flexShrink: 0 }}></div>
      <div style={{
        height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14,
        padding: '0 20px', background: AIRE.deep, borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6, background: AIRE.primary, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: AIRE.sans, fontWeight: 700, fontSize: 16,
        }}>Q</div>
        <div style={{ fontFamily: AIRE.sans, fontWeight: 600, fontSize: 19, color: AIRE.fg1 }}>
          CAGE-IN Mineral Prospectivity — Gridding Console
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ fontFamily: AIRE.mono, fontSize: 14, color: AIRE.fg3 }}>JC-14 v0.8.0</div>
      </div>
      {children}
    </div>
  );
}

function StatusBar({ text }) {
  return (
    <div style={{
      height: 42, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10,
      padding: '0 20px', background: AIRE.deep, borderTop: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: 4, background: AIRE.gold, boxShadow: '0 0 8px rgba(201,168,76,0.8)' }}></div>
      <div style={{ fontFamily: AIRE.mono, fontSize: 15.5, color: AIRE.fg3, letterSpacing: '0.02em' }}>{text}</div>
    </div>
  );
}

// Dataset chip (Geology / Geochemistry / Geophysics)
function DataChip({ label, dot, p, sub }) {
  return (
    <div style={{
      opacity: p, transform: `translateY(${(1 - p) * -46}px) scale(${0.85 + 0.15 * p})`,
      display: 'flex', alignItems: 'center', gap: 11,
      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 6, padding: '10px 18px',
    }}>
      <div style={{ width: 11, height: 11, borderRadius: 3, background: dot }}></div>
      <div style={{ fontFamily: AIRE.sans, fontWeight: 600, fontSize: 18, color: AIRE.fg1 }}>{label}</div>
      <div style={{ fontFamily: AIRE.mono, fontSize: 13.5, color: AIRE.fg3 }}>{sub}</div>
    </div>
  );
}

// ── AI chat panel ────────────────────────────────────────────────────────────
const CHAT_USER = 'Load the new As\u2013Sb soil assays and re-grid the NE fault block.';

function ChatPanel({ t }) {
  const typedP = clamp((t - 26.6) / 3.4, 0, 1);
  const typedLen = Math.floor(typedP * CHAT_USER.length);
  const sent = t >= 30.4;
  const caret = Math.floor(t * 2.6) % 2 === 0;
  const thinking = t >= 30.9 && t < 31.6;
  const steps = [
    { at: 31.6, text: '\u2713 412 assays ingested' },
    { at: 32.5, text: '\u2713 Fault constraints rebuilt' },
    { at: 33.4, text: '\u2713 Surface re-gridded \u2014 9.4 s' },
  ];
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: AIRE.deep, borderLeft: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <div style={{ width: 9, height: 9, borderRadius: 5, background: '#16a34a', boxShadow: '0 0 8px rgba(22,163,74,0.8)' }}></div>
        <div style={{ fontFamily: AIRE.sans, fontWeight: 600, fontSize: 17, color: AIRE.fg1 }}>CAGE-IN Assistant</div>
        <div style={{ flex: 1 }}></div>
        <div style={{ fontFamily: AIRE.mono, fontSize: 12.5, color: AIRE.fg3 }}>agent ready</div>
      </div>
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        {sent && (
          <Rise t={t} start={30.4} dur={0.4} dy={14} style={{ alignSelf: 'flex-end', maxWidth: '88%' }}>
            <div style={{
              background: AIRE.primary, color: '#fff', borderRadius: '10px 10px 2px 10px',
              padding: '11px 15px', fontFamily: AIRE.sans, fontSize: 16.5, lineHeight: 1.45,
            }}>{CHAT_USER}</div>
          </Rise>
        )}
        {thinking && (
          <div style={{
            alignSelf: 'flex-start', fontFamily: AIRE.mono, fontSize: 17, color: AIRE.fg3,
            padding: '8px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 8,
          }}>
            {'.'.repeat(1 + (Math.floor(t * 5) % 3))}
          </div>
        )}
        {t >= steps[0].at && (
          <div style={{
            alignSelf: 'flex-start', maxWidth: '92%', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px 10px 10px 2px',
            padding: '12px 15px', display: 'flex', flexDirection: 'column', gap: 7,
          }}>
            {steps.map((s, i) => t >= s.at ? (
              <Rise key={i} t={t} start={s.at} dur={0.35} dy={8}>
                <div style={{ fontFamily: AIRE.mono, fontSize: 14.5, color: '#4ade80' }}>{s.text}</div>
              </Rise>
            ) : null)}
            {t >= 34.4 && (
              <Rise t={t} start={34.4} dur={0.45} dy={10}>
                <div style={{ fontFamily: AIRE.sans, fontSize: 16, lineHeight: 1.5, color: AIRE.fg2, marginTop: 4 }}>
                  NE block updated. Two cells moved above the <span style={{ color: AIRE.gold, fontWeight: 600 }}>0.85 threshold</span>.
                </div>
              </Rise>
            )}
          </div>
        )}
        <div style={{ flex: 1 }}></div>
        {/* input box */}
        <div style={{
          border: '1px solid rgba(255,255,255,0.16)', borderRadius: 8, padding: '12px 14px',
          background: 'rgba(255,255,255,0.04)', minHeight: 64, flexShrink: 0,
        }}>
          <div style={{ fontFamily: AIRE.sans, fontSize: 16, lineHeight: 1.45, color: sent ? AIRE.fg3 : AIRE.fg1 }}>
            {sent ? 'Message CAGE-IN\u2026' : (
              <span>{CHAT_USER.slice(0, typedLen)}{caret && typedLen < CHAT_USER.length ? <span style={{ color: AIRE.gold }}>{'\u258d'}</span> : null}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Ranked targets panel ─────────────────────────────────────────────────────
function TargetPanel({ t }) {
  const slide = tw(t, 42.3, 43.0, Easing.easeOutCubic);
  const rows = [
    { at: 42.7, name: 'NE Fault Bend', score: 0.94, top: true },
    { at: 43.0, name: 'As\u2013Sb Soil Anomaly C', score: 0.81 },
    { at: 43.3, name: 'Chargeability High W', score: 0.77 },
  ];
  const hl = tw(t, 44.0, 44.5);
  return (
    <div style={{
      position: 'absolute', right: 22, top: 22, bottom: 22, width: 470,
      transform: `translateX(${(1 - slide) * 520}px)`,
      background: 'rgba(13,24,39,0.94)', border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 10, padding: 22, display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <Eyebrow size={16}>Ranked Drill Targets</Eyebrow>
      {rows.map((r, i) => t >= r.at ? (
        <Rise key={i} t={t} start={r.at} dur={0.4} dy={14}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
            background: r.top ? `rgba(201,168,76,${0.06 + hl * 0.1})` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${r.top ? `rgba(201,168,76,${0.25 + hl * 0.5})` : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 8,
          }}>
            <div style={{ fontFamily: AIRE.display, fontWeight: 700, fontSize: 26, color: r.top ? AIRE.gold : AIRE.fg3, width: 30 }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: AIRE.sans, fontWeight: 600, fontSize: 18.5, color: AIRE.fg1 }}>{r.name}</div>
              {r.top && hl > 0.3 && (
                <div style={{ fontFamily: AIRE.mono, fontSize: 13, color: AIRE.gold, marginTop: 3, opacity: hl }}>DH-23 — PROPOSED</div>
              )}
            </div>
            <div style={{ fontFamily: AIRE.display, fontWeight: 700, fontSize: 28, color: r.top ? AIRE.gold : AIRE.fg2 }}>{r.score.toFixed(2)}</div>
          </div>
        </Rise>
      ) : null)}
      <div style={{ flex: 1 }}></div>
      <div style={{ fontFamily: AIRE.mono, fontSize: 13.5, color: AIRE.fg3 }}>confidence model v3 · 184 km² AoI</div>
    </div>
  );
}

Object.assign(window, {
  AIRE, tw, Rise, Eyebrow, Portrait, GridMap, AppWindow, StatusBar,
  DataChip, ChatPanel, TargetPanel, MAP_ANOMS, assetUrl,
});
