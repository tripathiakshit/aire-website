// scenes/scenes2.jsx -- v2 scene composition, locked to the real voice-over.
// 2026-06-12 RETIME: caption + scene anchors rebuilt from WORD-LEVEL timestamps
// (faster-whisper small.en on assets/voiceover_enhanced.wav -- see vo_words.txt).
// The old map was built from RMS speech-burst starts and mis-assigned phrases to
// bursts; by mid-video the visuals ran ~9-11s AHEAD of the diction.
// Spoken phrase starts (measured): 1.10 / 4.14 / 9.96 / 12.38 / 19.14 / 23.12 /
// 29.00 / 36.14 / 40.88 / 46.00 / 50.48 / 57.80 / 60.16 / 64.58 / 66.34 / 70.64.
// Voice ends 71.5s -> timeline extended to 81s so the end card keeps its hold.

const DUR2 = 81;

const SUBS2 = [
  [1.05, 4.14, 'Thirty years in the field taught me \u2014'],
  [4.18, 8.95, 'legacy software stays frozen while deposit science moves.'],
  [9.90, 12.30, 'That\u2019s why we built the CAGE-IN system.'],
  [12.36, 18.00, 'A system built by exploration professionals, for exploration professionals.'],
  [19.10, 22.40, 'Instead of looking at isolated datasets,'],
  [23.05, 28.96, 'CAGE-IN constrains and grids your geology, geochemistry, and geophysics'],
  [29.00, 34.20, 'into a single, dynamic 3D predictive model.'],
  [36.10, 39.80, 'It updates as fast as the science does.'],
  [40.85, 45.60, 'A strong AI integration ensures you don\u2019t need to learn the software.'],
  [45.95, 50.20, 'We communicate with the software through natural language \u2014'],
  [50.30, 56.20, 'the AI runs the software, so the geologists stay focused on the rocks.'],
  [57.75, 60.14, 'Every drill hole is a high-stakes bet'],
  [60.18, 63.60, 'and requires the geologists\u2019 full attention.'],
  [64.55, 66.32, 'CAGE-IN ensures your drill decision'],
  [66.36, 69.80, 'is the best-informed one on the table.'],
  [70.60, 73.40, 'Let\u2019s look at your data.'],
];

function Subtitles() {
  const t = useTime();
  const s = SUBS2.find(([a, b]) => t >= a && t < b);
  if (!s) return null;
  const [a, b, text] = s;
  const o = Math.min(tw(t, a, a + 0.18, Easing.linear), 1 - tw(t, b - 0.15, b, Easing.linear));
  return (
    <div style={{
      position: 'absolute', left: '50%', bottom: 38, transform: 'translateX(-50%)',
      maxWidth: 1560, padding: '12px 30px', borderRadius: 8,
      background: 'rgba(7,31,61,0.68)', border: '1px solid rgba(255,255,255,0.08)',
      fontFamily: AIRE.sans, fontWeight: 500, fontSize: 33, lineHeight: 1.35,
      color: '#eef2f7', textAlign: 'center', whiteSpace: 'nowrap', opacity: o,
    }}>{text}</div>
  );
}

// ── Audio-reactive speaking treatment ───────────────────────────────────────
function voEnv(t) {
  const e = window.VO_ENV || [];
  return e[Math.floor(t / (window.VO_ENV_STEP || 0.05))] || 0;
}

function SpeakingAura({ t, audioT, x, y, size, fadeIn = 0.4 }) {
  const e = voEnv(audioT == null ? t : audioT);
  const vis = tw(t, fadeIn, fadeIn + 0.7);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: size, height: size,
      borderRadius: '50%', pointerEvents: 'none',
      transform: `scale(${1 + e * 0.07})`,
      border: `3px solid rgba(201,168,76,${(0.22 + e * 0.55) * vis})`,
      boxShadow: `0 0 ${20 + e * 55}px rgba(201,168,76,${(0.14 + e * 0.42) * vis})`,
      opacity: vis,
    }}></div>
  );
}

function VoiceBars({ t, audioT, x, y, fadeIn = 0.9 }) {
  const env = window.VO_ENV || [];
  const step = window.VO_ENV_STEP || 0.05;
  const idx = Math.floor((audioT == null ? t : audioT) / step);
  const vals = [0, 2, 4, 6, 8].map(o => env[Math.max(0, idx - o)] || 0);
  const vis = tw(t, fadeIn, fadeIn + 0.6);
  return (
    <div style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'flex-end', gap: 5, height: 34, opacity: vis * 0.9 }}>
      {vals.map((v, i) => (
        <div key={i} style={{ width: 5, height: 6 + v * 28, background: AIRE.gold, borderRadius: 2 }}></div>
      ))}
    </div>
  );
}

// ── Scene 1 · 0–6.9 · Founder in the field ──────────────────────────────────
function Scene1Inner() {
  const { localTime: t } = useSprite();
  const out = 1 - tw(t, 9.1, 9.5, Easing.linear);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: out }}>
      <img src={assetUrl('assets/hero-drilling.jpg')} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${1.1 + t * 0.012}) translateX(${-t * 6}px)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(7,31,61,0.78) 0%, rgba(7,31,61,0.6) 100%)',
      }}></div>
      <Portrait t={t} start={0.4} size={400} x={210} y={310} src="assets/amit-field.jpg" pos="50% 32%" />
      <SpeakingAura t={t} x={210} y={310} size={400} />
      <VoiceBars t={t} x={230} y={838} />
      <Rise t={t} start={0.9} style={{ position: 'absolute', left: 230, top: 750 }}>
        <div style={{ fontFamily: AIRE.display, fontWeight: 700, fontSize: 34, color: AIRE.fg1 }}>Dr. Amit Tripathi</div>
        <div style={{ fontFamily: AIRE.sans, fontSize: 19, color: AIRE.secondary, marginTop: 6 }}>Founder, AiRE · AI Resource Exploration</div>
      </Rise>
      <div style={{ position: 'absolute', left: 750, top: 340, maxWidth: 1040 }}>
        <Rise t={t} start={0.8}><Eyebrow>30+ years in the field</Eyebrow></Rise>
        <Rise t={t} start={1.2} style={{ marginTop: 30 }}>
          <div style={{ fontFamily: AIRE.display, fontWeight: 700, fontSize: 82, lineHeight: 1.08, color: AIRE.fg1, letterSpacing: '-0.01em' }}>
            Deposit science moves.
          </div>
        </Rise>
        <Rise t={t} start={4.25} style={{ marginTop: 14 }}>
          <div style={{ fontFamily: AIRE.display, fontWeight: 700, fontSize: 82, lineHeight: 1.08, color: AIRE.fg2, letterSpacing: '-0.01em' }}>
            Legacy software <em style={{ color: AIRE.gold }}>stays frozen</em>.
          </div>
        </Rise>
      </div>
    </div>
  );
}

// ── Scene 2 · 6.9–16.1 · CAGE-IN title ──────────────────────────────────────
function Scene2Inner() {
  const { localTime: t } = useSprite();
  const out = 1 - tw(t, 8.7, 9.1, Easing.linear);
  const ruleP = tw(t, 1.3, 2.1);
  const drift = 1 + 0.022 * clamp(t / 9.1, 0, 1);
  return (
    <div style={{
      position: 'absolute', inset: 0, background: AIRE.deep, opacity: out,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        transform: `scale(${drift})`,
      }}>
        <Rise t={t} start={0.25}><Eyebrow>Proprietary AI Technology</Eyebrow></Rise>
        <Rise t={t} start={0.5} style={{ marginTop: 26 }}>
          <div style={{ fontFamily: AIRE.display, fontWeight: 700, fontSize: 200, lineHeight: 1, color: AIRE.fg1, letterSpacing: '-0.015em' }}>
            CAGE-IN
          </div>
        </Rise>
        <div style={{ width: 560 * ruleP, height: 2, background: AIRE.gold, marginTop: 38, opacity: ruleP }}></div>
        <Rise t={t} start={1.4} style={{ marginTop: 30 }}>
          <div style={{ fontFamily: AIRE.sans, fontWeight: 600, fontSize: 27, letterSpacing: '0.16em', textTransform: 'uppercase', color: AIRE.fg3, textAlign: 'center' }}>
            Constrained Area Gridding for Enhanced Interpretation
          </div>
        </Rise>
        <Rise t={t} start={2.85} style={{ marginTop: 56 }}>
          <div style={{ fontFamily: AIRE.display, fontStyle: 'italic', fontWeight: 600, fontSize: 42, color: AIRE.fg2, textAlign: 'center' }}>
            Built by exploration professionals, for exploration professionals.
          </div>
        </Rise>
      </div>
    </div>
  );
}

// ── Scene 3 · 16.1–60.5 · Real CAGE-IN session ──────────────────────────────
function CaptureSceneInner() {
  const t = useTime();
  const out = 1 - tw(t, 69.8, 70.2, Easing.linear);
  return (
    <div style={{ position: 'absolute', inset: 0, background: AIRE.deep, opacity: out }}>
      <CaptureMontage t={t} />
      <div style={{
        position: 'absolute', top: 26, right: 40,
        fontFamily: AIRE.sans, fontWeight: 600, fontSize: 15,
        letterSpacing: '0.22em', textTransform: 'uppercase', color: AIRE.fg3,
        opacity: tw(t, 19.2, 19.8) * 0.85,
      }}>Live product capture · client data redacted</div>
      {t >= 40.6 && t < 56.6 && <AICard t={t} />}
    </div>
  );
}

// ── Scene 4 · 60.5–63.8 · "Let's look at your data." ────────────────────────
function Scene8Inner() {
  const { localTime: t } = useSprite();
  const out = 1 - tw(t, 3.8, 4.2, Easing.linear);
  const ruleP = tw(t, 0.9, 1.6);
  return (
    <div style={{ position: 'absolute', inset: 0, background: AIRE.deep, opacity: out }}>
      <Portrait t={t} start={0.1} size={340} x={330} y={370} src="assets/amit-field.jpg" pos="50% 32%" />
      <SpeakingAura t={t} audioT={t + 70.2} x={330} y={370} size={340} fadeIn={0.15} />
      <div style={{ position: 'absolute', left: 820, top: 445 }}>
        <Rise t={t} start={0.3}>
          <div style={{ fontFamily: AIRE.display, fontWeight: 700, fontSize: 92, color: AIRE.fg1, letterSpacing: '-0.01em' }}>
            Let&rsquo;s look at <em style={{ color: AIRE.gold }}>your</em> data.
          </div>
        </Rise>
        <div style={{ width: 420 * ruleP, height: 2, background: AIRE.gold, marginTop: 30, opacity: ruleP }}></div>
      </div>
    </div>
  );
}

// ── Scene 5 · 63.8–73.5 · End card ──────────────────────────────────────────
function Scene9Inner() {
  const { localTime: t } = useSprite();
  const gridO = 0.05 + 0.025 * Math.sin(t * 0.9);
  const drift = 1 + 0.018 * clamp(t / 6.6, 0, 1);
  return (
    <div style={{
      position: 'absolute', inset: 0, background: AIRE.slate,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: gridO,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }}></div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: AIRE.gold }}></div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${drift})` }}>
        <Rise t={t} start={0.25}><Eyebrow>CAGE-IN</Eyebrow></Rise>
        <Rise t={t} start={0.55} style={{ marginTop: 30, maxWidth: 1340, textAlign: 'center' }}>
          <div style={{ fontFamily: AIRE.display, fontWeight: 700, fontSize: 70, lineHeight: 1.18, color: AIRE.fg1, letterSpacing: '-0.01em' }}>
            Constrained Area Gridding for Enhanced&nbsp;Interpretation
          </div>
        </Rise>
        <Rise t={t} start={1.3} style={{ marginTop: 54, textAlign: 'center' }}>
          <div style={{ fontFamily: AIRE.sans, fontSize: 30, color: AIRE.fg2 }}>
            Connect with us at <span style={{ color: AIRE.gold, fontWeight: 600 }}>airesourceexploration.com</span>
          </div>
        </Rise>
        <Rise t={t} start={3.2} style={{ marginTop: 34, textAlign: 'center' }}>
          <div style={{ fontFamily: AIRE.display, fontStyle: 'italic', fontWeight: 600, fontSize: 32, color: AIRE.fg3 }}>
            Your data. Today&rsquo;s tech. Tomorrow&rsquo;s targets.
          </div>
        </Rise>
      </div>
      <Rise t={t} start={1.9} style={{ position: 'absolute', bottom: 70, textAlign: 'center' }}>
        <div style={{ fontFamily: AIRE.display, fontWeight: 700, fontSize: 36, color: AIRE.fg1, letterSpacing: '0.04em' }}>Ai<span style={{ color: AIRE.gold }}>R</span>E</div>
        <Eyebrow size={14} color={AIRE.fg3} style={{ marginTop: 8 }}>AI Resource Exploration</Eyebrow>
      </Rise>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
function LabeledRoot({ children }) {
  const t = useTime();
  return (
    <div data-screen-label={`t=${Math.floor(t)}s`} style={{ position: 'absolute', inset: 0 }}>
      {children}
    </div>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "voice": "original",
  "captions": true
}/*EDITMODE-END*/;

const VOICE_RATES = { original: 1, deeper: 0.95, deepest: 0.92 };

function CageVideo2() {
  const [tk, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const rate = VOICE_RATES[tk.voice] || 1;
  return (
    <div>
      <Stage width={1920} height={1080} duration={DUR2} background="#0d1827" persistKey="cagein-hook-video2" speed={rate} hideBar={!!window.__EXPORT_MODE} loop={false} autoplay={!window.__EXPORT_MODE && !window.__EMBED}>
        <LabeledRoot>
          <CapturePreload />
          <Sprite start={0} end={9.5}><Scene1Inner /></Sprite>
          <Sprite start={9.5} end={18.6}><Scene2Inner /></Sprite>
          <Sprite start={18.6} end={70.2}><CaptureSceneInner /></Sprite>
          <Sprite start={70.2} end={74.4}><Scene8Inner /></Sprite>
          <Sprite start={74.4} end={DUR2}><Scene9Inner /></Sprite>
          {tk.captions && <Subtitles />}
          <AudioSync src={window.VO_DATA_URI || 'assets/voiceover_enhanced.wav'} rate={rate} />
        </LabeledRoot>
      </Stage>
      {!window.__EMBED && (
      <TweaksPanel>
        <TweakSection label="Voice" />
        <TweakRadio label="Depth & pace" value={tk.voice}
          options={['original', 'deeper', 'deepest']}
          onChange={(v) => setTweak('voice', v)} />
        <TweakSection label="Captions" />
        <TweakToggle label="Subtitles" value={tk.captions}
          onChange={(v) => setTweak('captions', v)} />
      </TweaksPanel>
      )}
    </div>
  );
}

Object.assign(window, { CageVideo2 });
