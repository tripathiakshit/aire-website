// scenes/captures.jsx — real-product capture montage for the CAGE-IN hook video v2
// All screenshots are redacted copies in captures/ (user-filled values pixelated).

// ── Shot list (absolute timeline seconds, locked to the voice-over) ──────────
// trans: 'scroll' = page-scroll slide, 'fade' = crossfade, 'pop' = scale-in
const SHOTS = [
  { start: 18.7,  src: 'c174519.png', trans: 'pop',    label: 'DATA SOURCE' },
  { start: 20.6,  src: 'c180004.png', trans: 'scroll' },
  { start: 25.4,  src: 'c180026.png', trans: 'scroll', label: 'GEOLOGY & STRUCTURE', callout: [2.5, 13.5, 95, 33] },
  { start: 26.8,  src: 'c180128.png', trans: 'scroll', label: 'GEOCHEMISTRY',        callout: [2, 12, 95, 54] },
  { start: 28.2,  src: 'c180055.png', trans: 'scroll', label: 'GEOPHYSICS',          callout: [2.5, 16.5, 96, 50] },
  { start: 29.6,  src: 'c180208.png', trans: 'fade',   label: 'ONE CONSTRAINED MODEL', callout: [3.5, 41, 92, 50] },
  { start: 31.2,  src: 'targets.gif', trans: 'fade',   gif: true, label: 'DYNAMIC 3D PREDICTIVE MODEL' },
  { start: 36.2,  src: 'c180234.png', trans: 'fade',   label: 'COMPUTING INDICES \u2014 12%' },
  { start: 37.4,  src: 'c180244.png', trans: 'fade',   label: 'POST-PROCESSING \u2014 57%' },
  { start: 38.5,  src: 'c180400.png', trans: 'fade',   label: 'ALL 11 INDICES \u2014 100%' },
  { start: 40.6,  src: 'c180437.png', trans: 'fade' },
  { start: 49.9,  src: 'c180454.png', trans: 'scroll' },
  { start: 51.6,  src: 'c180508.png', trans: 'fade' },
  { start: 53.0,  src: 'c180525.png', trans: 'fade' },
  { start: 54.4,  src: 'c180538.png', trans: 'fade' },
  { start: 57.75, src: 'c183527.png', trans: 'fade',   vignette: true },
  { start: 60.7,  src: 'c183708.png', trans: 'fade',   vignette: true },
  { start: 64.55, src: 'c184122.png', trans: 'fade',   label: 'ANALYSIS COMPLETE' },
  { start: 66.4,  src: 'c184356.png', trans: 'fade',   label: '460 RANKED ANOMALY POLYGONS' },
  { start: 68.2,  src: 'targets.gif', trans: 'fade',   gif: true, label: 'RANKED TARGETS \u2014 3D' },
];

function shotAR(shot) {
  if (shot.gif) return 4 / 3;
  if (shot.src === 'c184356.png') return 400 / 600;
  return 1.27; // QGIS dialog captures (~1349x1063)
}

// ── Single capture frame ─────────────────────────────────────────────────────
function ShotView({ shot, t, mode, phase, role }) {
  const ar = shotAR(shot);
  const h = 826, w = h * ar;
  const life = clamp((t - shot.start) / 9, 0, 1);
  const kbAmp = shot.vignette ? 0.085 : 0.035;
  const kb = 1 + kbAmp * life;

  let op = 1, ty = 0, sc = kb;
  if (role === 'in') {
    if (mode === 'fade') op = phase;
    else if (mode === 'scroll') ty = (1 - phase) * 640;
    else if (mode === 'pop') { op = phase; sc = kb * (0.95 + 0.05 * phase); }
  } else if (role === 'out') {
    if (mode === 'scroll') ty = -phase * 640;
  }

  const calloutP = shot.callout ? tw(t, shot.start + 0.45, shot.start + 0.85) : 0;
  const labelP = shot.label ? tw(t, shot.start + 0.35, shot.start + 0.75) : 0;

  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      width: w, height: h,
      transform: `translate(-50%, -50%) translateY(${ty}px) scale(${sc})`,
      opacity: op,
      borderRadius: 8, overflow: 'hidden',
      boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
      background: shot.gif ? '#000' : '#f0f0f0',
    }}>
      {shot.gif ? (
        <TargetsCine t={t} />
      ) : (
        <img src={assetUrl('captures/' + shot.src)} alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      )}
      {shot.vignette && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 42%, rgba(7,31,61,0.55) 100%)',
        }}></div>
      )}
      {shot.callout && calloutP > 0.01 && (
        <div style={{
          position: 'absolute',
          left: shot.callout[0] + '%', top: shot.callout[1] + '%',
          width: shot.callout[2] + '%', height: shot.callout[3] + '%',
          border: '3px solid ' + AIRE.gold, borderRadius: 8,
          boxShadow: '0 0 26px rgba(201,168,76,0.45), inset 0 0 26px rgba(201,168,76,0.12)',
          opacity: calloutP, transform: `scale(${0.97 + 0.03 * calloutP})`,
        }}>
          <div style={{
            position: 'absolute', top: -21, left: 14,
            background: AIRE.deep, border: '1px solid rgba(201,168,76,0.6)',
            borderRadius: 5, padding: '8px 16px',
            fontFamily: AIRE.sans, fontWeight: 600, fontSize: 21,
            letterSpacing: '0.18em', color: AIRE.gold, whiteSpace: 'nowrap',
          }}>{shot.label}</div>
        </div>
      )}
      {shot.label && !shot.callout && labelP > 0.01 && (
        <div style={{
          position: 'absolute', left: 20, bottom: 20,
          background: 'rgba(13,24,39,0.92)', border: '1px solid rgba(201,168,76,0.6)',
          borderRadius: 5, padding: '9px 18px',
          fontFamily: AIRE.sans, fontWeight: 600, fontSize: 21,
          letterSpacing: '0.18em', color: AIRE.gold, whiteSpace: 'nowrap',
          opacity: labelP, transform: `translateY(${(1 - labelP) * 14}px)`,
        }}>{shot.label}</div>
      )}
    </div>
  );
}

// Sprite-sheet player for the 3D ranked-targets rotation (replaces the 17MB
// GIF with timeline-synced frames — scrubs and pauses with the playhead).
function TargetsCine({ t }) {
  const meta = window.TGT_FRAMES;
  const ref = React.useRef(null);
  const imgs = React.useRef(null);
  if (meta && !imgs.current) {
    imgs.current = meta.sheets.map(p => { const im = new Image(); im.src = assetUrl(p); return im; });
  }
  React.useEffect(() => {
    if (!meta || !ref.current) return;
    const cv = ref.current, ctx = cv.getContext('2d');
    const idx = Math.floor(t * meta.fps) % meta.count;
    const sh = Math.floor(idx / meta.perSheet), wi = idx % meta.perSheet;
    const im = imgs.current[sh];
    if (im && im.complete && im.naturalWidth) {
      ctx.drawImage(im, (wi % meta.cols) * meta.w, Math.floor(wi / meta.cols) * meta.h, meta.w, meta.h, 0, 0, cv.width, cv.height);
    }
  });
  if (!meta) {
    return <img src={assetUrl('captures/targets.gif')} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />;
  }
  return <canvas ref={ref} width={meta.w} height={meta.h} style={{ width: '100%', height: '100%', display: 'block', background: '#000' }}></canvas>;
}

// ── Montage controller ───────────────────────────────────────────────────────
function CaptureMontage({ t }) {
  let i = SHOTS.length - 1;
  while (i > 0 && t < SHOTS[i].start) i--;
  const shot = SHOTS[i];
  const mode = shot.trans || 'fade';
  const TD = mode === 'pop' ? 0.6 : 0.45;
  const phase = tw(t, shot.start, shot.start + TD, Easing.easeInOutCubic);
  const prev = i > 0 && phase < 1 ? SHOTS[i - 1] : null;
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 16, height: 880,
      overflow: 'hidden',
    }}>
      {prev && <ShotView shot={prev} t={t} mode={mode} phase={phase} role="out" />}
      <ShotView shot={shot} t={t} mode={mode} phase={phase} role="in" />
    </div>
  );
}

// ── Compact AI assistant card (the "AI runs the software" beat) ──────────────
const AI_USER_CMD = 'Configure the run for our deposit model and launch the analysis.';

function AICard({ t }) {
  const enter = tw(t, 40.9, 41.4);
  const exit = tw(t, 55.9, 56.5);
  const typedP = clamp((t - 46.3) / 2.8, 0, 1);
  const typedLen = Math.floor(typedP * AI_USER_CMD.length);
  const sent = t >= 49.5;
  const caret = Math.floor(t * 2.6) % 2 === 0;
  const steps = [
    { at: 50.7, text: '\u2713 Deposit preset applied' },
    { at: 52.0, text: '\u2713 Thresholds & clustering set' },
    { at: 53.3, text: '\u2713 Outputs configured \u00b7 limitations acknowledged' },
    { at: 54.6, text: '\u25b6 Analysis launched \u2014 Method A targeting' },
  ];
  return (
    <div style={{
      position: 'absolute', right: 64, bottom: 138, width: 560,
      opacity: enter * (1 - exit),
      transform: `translateY(${(1 - enter) * 36}px) translateX(${exit * 80}px)`,
      background: 'rgba(13,24,39,0.96)', border: '1px solid rgba(255,255,255,0.14)',
      borderRadius: 10, overflow: 'hidden',
      boxShadow: '0 24px 70px rgba(0,0,0,0.6)',
    }}>
      <div style={{ height: 3, background: AIRE.gold }}></div>
      <div style={{
        padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 9, height: 9, borderRadius: 5, background: '#16a34a', boxShadow: '0 0 8px rgba(22,163,74,0.8)' }}></div>
        <div style={{ fontFamily: AIRE.sans, fontWeight: 600, fontSize: 17, color: AIRE.fg1 }}>CAGE-IN Assistant</div>
        <div style={{ flex: 1 }}></div>
        <div style={{ fontFamily: AIRE.mono, fontSize: 12.5, color: AIRE.fg3 }}>agent ready</div>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {t >= 41.3 && (
          <Rise t={t} start={41.3} dur={0.4} dy={10} style={{ alignSelf: 'flex-start', maxWidth: '90%' }}>
            <div style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '9px 9px 9px 2px', padding: '9px 13px',
              fontFamily: AIRE.sans, fontSize: 15.5, lineHeight: 1.45, color: AIRE.fg2,
            }}>No menus to learn — tell me what you need.</div>
          </Rise>
        )}
        {sent && (
          <Rise t={t} start={49.5} dur={0.35} dy={10} style={{ alignSelf: 'flex-end', maxWidth: '92%' }}>
            <div style={{
              background: AIRE.primary, color: '#fff', borderRadius: '9px 9px 2px 9px',
              padding: '9px 13px', fontFamily: AIRE.sans, fontSize: 15.5, lineHeight: 1.45,
            }}>{AI_USER_CMD}</div>
          </Rise>
        )}
        {t >= steps[0].at && (
          <div style={{
            alignSelf: 'flex-start', maxWidth: '94%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9px 9px 9px 2px',
            padding: '10px 13px', display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            {steps.map((s, j) => t >= s.at ? (
              <Rise key={j} t={t} start={s.at} dur={0.3} dy={7}>
                <div style={{ fontFamily: AIRE.mono, fontSize: 13.5, color: j === steps.length - 1 ? AIRE.gold : '#4ade80' }}>{s.text}</div>
              </Rise>
            ) : null)}
          </div>
        )}
        {!sent && (
          <div style={{
            border: '1px solid rgba(255,255,255,0.16)', borderRadius: 7, padding: '10px 13px',
            background: 'rgba(255,255,255,0.04)', minHeight: 42,
          }}>
            <div style={{ fontFamily: AIRE.sans, fontSize: 15, lineHeight: 1.45, color: typedLen > 0 ? AIRE.fg1 : AIRE.fg3 }}>
              {typedLen > 0 ? (
                <span>{AI_USER_CMD.slice(0, typedLen)}{caret && typedLen < AI_USER_CMD.length ? <span style={{ color: AIRE.gold }}>{'\u258d'}</span> : null}</span>
              ) : 'Message CAGE-IN\u2026'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Audio sync — THE VOICE IS THE MASTER CLOCK ──────────────────────────────
// While audio is playing, the timeline is continuously disciplined to
// audio.currentTime (video follows voice). The audio is only ever seeked on a
// deliberate user scrub (large mismatch) or while paused (cueing) — never to
// chase rAF drift, so the voice never glitches mid-word. Deterministic export
// (__seek, playing=false) is untouched by this.
function AudioSync({ src, rate = 1 }) {
  const { time, playing, duration, setTime } = useTimeline();
  const ref = React.useRef(null);
  const [blocked, setBlocked] = React.useState(false);
  React.useEffect(() => {
    const a = ref.current;
    if (!a) return;
    try { a.preservesPitch = false; a.mozPreservesPitch = false; a.webkitPreservesPitch = false; } catch (e) {}
    a.playbackRate = rate;
  }, [rate]);
  React.useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const delta = a.currentTime - time;
    if (playing && !a.paused && !a.ended) {
      if (Math.abs(delta) > 0.6) {
        // user scrubbed the playhead — move the audio to match
        try { a.currentTime = Math.max(0, Math.min(time, a.duration || time)); } catch (e) {}
      } else if (Math.abs(delta) > 0.045) {
        // clock drift (rAF jank etc.) — discipline the TIMELINE to the voice
        setTime(clamp(a.currentTime, 0, duration));
      }
    } else if (!playing) {
      // paused: keep the audio cued to the playhead for instant resume
      if (Math.abs(delta) > 0.08) {
        try { a.currentTime = Math.max(0, Math.min(time, a.duration || time)); } catch (e) {}
      }
    }
    if (playing && a.ended && time < (a.duration || Infinity) - 0.25) {
      // scrubbed back after the audio finished — restart from the playhead
      try { a.currentTime = Math.max(0, time); } catch (e) {}
      const pr2 = a.play();
      if (pr2) pr2.catch(() => setBlocked(true));
    }
    if (playing && a.paused && !a.ended) {
      const pr = a.play();
      if (pr) pr.then(() => setBlocked(false)).catch(() => setBlocked(true));
    } else if (!playing && !a.paused) {
      a.pause();
    }
  }, [time, playing]);
  React.useEffect(() => {
    if (!blocked) return undefined;
    const tryPlay = () => {
      const a = ref.current;
      if (a && a.paused) {
        const pr = a.play();
        if (pr) pr.then(() => setBlocked(false)).catch(() => {});
      }
    };
    window.addEventListener('pointerdown', tryPlay);
    window.addEventListener('keydown', tryPlay);
    return () => {
      window.removeEventListener('pointerdown', tryPlay);
      window.removeEventListener('keydown', tryPlay);
    };
  }, [blocked]);
  return (
    <div>
      <audio ref={ref} src={src} preload="auto"></audio>
      {blocked && playing && (
        <div style={{
          position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(13,24,39,0.92)', border: '1px solid rgba(201,168,76,0.6)',
          borderRadius: 6, padding: '9px 20px',
          fontFamily: AIRE.sans, fontWeight: 600, fontSize: 19, color: AIRE.gold,
          letterSpacing: '0.08em',
        }}>CLICK ANYWHERE FOR SOUND</div>
      )}
    </div>
  );
}

// Preload all captures so playback never pops
function CapturePreload() {
  const srcs = Array.from(new Set(SHOTS.filter(s => !s.gif).map(s => assetUrl('captures/' + s.src))));
  return (
    <div style={{ position: 'absolute', width: 1, height: 1, opacity: 0, overflow: 'hidden' }}>
      {srcs.map((s, i) => <img key={i} src={s} alt="" />)}
      <img src={assetUrl('assets/amit-field.jpg')} alt="" />
    </div>
  );
}

Object.assign(window, { SHOTS, ShotView, CaptureMontage, AICard, AudioSync, CapturePreload, TargetsCine });
