import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS, RADIUS, SHADOW } from '../brand';
import { FONT_DISPLAY, FONT_BODY, FONT_MONO } from '../fonts';
import { CLAMP } from './kit';

// =============================================================================
// shorts.tsx — the vertical (1080×1920) kit for YouTube Shorts.
// Same brand contract as kit.tsx, tuned for 9:16: safe areas that dodge the
// Shorts UI chrome, a word-synced caption track driven by voiceover timestamps
// (tools/gen_voiceover.py → work/voiceover/words.json), and the beat components
// the listicle/news-jack formats are built from. Frame-based only — no state.
// =============================================================================

export const SHORT = { W: 1080, H: 1920, FPS: 30 } as const;

// YouTube Shorts overlays UI on the frame: title/channel/actions live in the
// bottom ~440px, the right ~140px column holds like/share, the top ~180px can
// carry the search/camera chrome. Keep content inside these insets.
export const SAFE = { top: 200, bottom: 460, side: 64 } as const;

export const secToFrame = (s: number, fps: number = SHORT.FPS) => Math.round(s * fps);

// One word from tools/gen_voiceover.py's words.json (seconds, master voiceover time).
export type CaptionWord = { word: string; start_s: number; end_s: number };

// ---- vertical brand backdrop: paper + glow from the top + faint dot grid -----
export const ShortBg: React.FC<{ glow?: string }> = ({ glow = COLORS.accent }) => (
  <>
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }} />
    <AbsoluteFill style={{ background: `radial-gradient(900px 1100px at 50% -8%, ${glow}26, transparent 62%)` }} />
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${COLORS.line} 1.5px, transparent 1.5px)`, backgroundSize: '46px 46px', opacity: 0.4 }} />
  </>
);

// =============================================================================
// CaptionTrack — word-synced captions, the spine of every Short.
// Groups words into pages of `groupSize`; the page whose span contains the
// current time is shown, and the word being spoken RIGHT NOW renders in the
// accent color with a small pop. All timing comes from words.json, so captions
// always match the voiceover — never hand-time captions.
// =============================================================================
export const CaptionTrack: React.FC<{
  words: readonly CaptionWord[];
  groupSize?: number; // words per caption page (3 reads best at 9:16)
  centerY?: number; // px from top; default sits just above the bottom safe area
  fontSize?: number;
  fps?: number;
}> = ({ words, groupSize = 3, centerY = SHORT.H - SAFE.bottom - 160, fontSize = 76, fps = SHORT.FPS }) => {
  const frame = useCurrentFrame();
  if (words.length === 0) return null;

  const size = Math.max(1, groupSize);
  const pages: CaptionWord[][] = [];
  for (let i = 0; i < words.length; i += size) pages.push(words.slice(i, i + size));

  const t = frame / fps;
  // last page holds briefly so the closing words don't vanish mid-read
  let page = pages[pages.length - 1];
  for (const p of pages) {
    if (t < p[p.length - 1].end_s + 0.12) { page = p; break; }
  }
  if (t > page[page.length - 1].end_s + 0.6 && page === pages[pages.length - 1]) return null;

  const pageStartF = secToFrame(page[0].start_s, fps);
  const pageOp = interpolate(frame, [pageStartF, pageStartF + 4], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <div style={{
      position: 'absolute', left: SAFE.side, right: SAFE.side, top: centerY,
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
      columnGap: 22, rowGap: 6, opacity: pageOp, textAlign: 'center',
    }}>
      {page.map((w, i) => {
        const wf = secToFrame(w.start_s, fps);
        const active = t >= w.start_s && t < w.end_s + 0.06;
        const pop = interpolate(frame, [wf, wf + 5], [0.92, 1], { ...CLAMP, easing: EASINGS.overshoot });
        const spoken = t >= w.start_s;
        return (
          <span key={`${w.word}-${i}`} style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize, lineHeight: 1.15,
            color: active ? COLORS.accent : spoken ? COLORS.ink : `${COLORS.ink}55`,
            transform: `scale(${spoken ? pop : 0.92})`,
            textShadow: `0 2px 18px ${COLORS.paper}`,
          }}>
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

// =============================================================================
// HookTitle — the 0–2s payoff statement. Lines rise in; accent lines carry the
// money word. State the outcome here AND in the voiceover's first line.
// =============================================================================
export const HookTitle: React.FC<{
  kicker?: string; // small mono line above, e.g. 'FREE AI TOOLS'
  lines: readonly { text: string; accent?: boolean }[];
  at?: number; // start frame
  fontSize?: number;
}> = ({ kicker, lines, at = 0, fontSize = 116 }) => {
  const frame = useCurrentFrame();
  const rise = (start: number) => ({
    opacity: interpolate(frame, [start, start + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut }),
    transform: `translateY(${interpolate(frame, [start, start + 12], [30, 0], { ...CLAMP, easing: EASINGS.easeOut })}px)`,
  });
  return (
    <div style={{
      position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 110,
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8,
    }}>
      {kicker ? (
        <div style={{ ...rise(at), fontFamily: FONT_MONO, fontSize: 30, letterSpacing: 6, color: COLORS.muted, marginBottom: 26 }}>
          {kicker}
        </div>
      ) : null}
      {lines.map((l, i) => (
        <h1 key={i} style={{
          ...rise(at + 5 + i * 6), margin: 0, fontFamily: FONT_DISPLAY, fontWeight: 700,
          fontSize, lineHeight: 1.04, color: l.accent ? COLORS.accent : COLORS.ink,
        }}>
          {l.text}
        </h1>
      ))}
    </div>
  );
};

// =============================================================================
// CountBadge — the "#2 / 5" pill that anchors listicle pacing.
// =============================================================================
export const CountBadge: React.FC<{ n: number; of: number; at?: number; color?: string }> = ({ n, of, at = 0, color = COLORS.accent }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const pop = interpolate(frame, [at, at + 10], [0.8, 1], { ...CLAMP, easing: EASINGS.overshoot });
  return (
    <div style={{
      position: 'absolute', top: SAFE.top + 20, left: '50%',
      transform: `translateX(-50%) scale(${pop})`, opacity: op,
      background: color, color: COLORS.paper, borderRadius: RADIUS.pill,
      fontFamily: FONT_MONO, fontWeight: 700, fontSize: 34, padding: '12px 34px',
      boxShadow: SHADOW.soft, letterSpacing: 2,
    }}>
      {n} / {of}
    </div>
  );
};

// =============================================================================
// ToolCard — one tool beat: name, the money line, a price chip, and a slot for
// the visual proof (a fake-screencast frame, a logo, generated UI). The slot is
// where this repo beats stock-footage channels — put a real generated demo in it.
// =============================================================================
export const ToolCard: React.FC<{
  name: string;
  tagline: string; // the money line — what it does for your wallet
  chip?: string; // 'FREE' | '$10/mo' | …
  chipColor?: string;
  at?: number; // start frame for the card's rise
  children?: React.ReactNode; // the proof slot (screencast frame, UI clone, logo)
}> = ({ name, tagline, chip, chipColor = COLORS.signal, at = 0, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at, at + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const y = interpolate(frame, [at, at + 14], [44, 0], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <div style={{
      position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 210,
      opacity: op, transform: `translateY(${y}px)`,
      background: COLORS.paper, border: `2px solid ${COLORS.line}`, borderRadius: RADIUS.card,
      boxShadow: SHADOW.card, padding: '44px 44px 40px', display: 'flex', flexDirection: 'column', gap: 22,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 66, color: COLORS.ink, lineHeight: 1.05 }}>{name}</div>
        {chip ? (
          <div style={{
            background: chipColor, color: COLORS.paper, borderRadius: RADIUS.pill,
            fontFamily: FONT_MONO, fontWeight: 700, fontSize: 30, padding: '10px 26px', whiteSpace: 'nowrap',
          }}>
            {chip}
          </div>
        ) : null}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 40, lineHeight: 1.3, color: COLORS.muted }}>{tagline}</div>
      {children ? <div style={{ marginTop: 10 }}>{children}</div> : null}
    </div>
  );
};
