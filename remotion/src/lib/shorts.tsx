import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { BRAND, COLORS, EASINGS, GRADIENT, RADIUS, SHADOW } from '../brand';
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
}> = ({ words, groupSize = 3, centerY = SHORT.H - SAFE.bottom - 260, fontSize = 84, fps = SHORT.FPS }) => {
  const frame = useCurrentFrame();
  if (words.length === 0) return null;

  // Pages fill to groupSize but always break at sentence punctuation — a page never
  // mixes the end of one sentence with the start of the next (it reads wrong on screen).
  const size = Math.max(1, groupSize);
  const pages: CaptionWord[][] = [];
  let cur: CaptionWord[] = [];
  for (const w of words) {
    cur.push(w);
    if (cur.length >= size || /[.!?…]["')\]]?$/.test(w.word)) {
      pages.push(cur);
      cur = [];
    }
  }
  if (cur.length > 0) pages.push(cur);

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
      position: 'absolute', left: SAFE.side - 20, right: SAFE.side - 20, top: centerY,
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
      columnGap: 8, rowGap: 12, opacity: pageOp, textAlign: 'center',
    }}>
      {page.map((w, i) => {
        const wf = secToFrame(w.start_s, fps);
        const active = t >= w.start_s && t < w.end_s + 0.06;
        const spoken = t >= w.start_s;
        // pop with a manual overshoot peak; every word carries the pill padding so the
        // active highlight never reflows the line
        const pop = interpolate(frame, [wf, wf + 4, wf + 9], [0.86, 1.07, 1], { ...CLAMP, easing: EASINGS.easeOut });
        const lift = interpolate(frame, [wf, wf + 6], [10, 0], { ...CLAMP, easing: EASINGS.easeOut });
        return (
          <span key={`${w.word}-${i}`} style={{
            fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize, lineHeight: 1.18,
            padding: '4px 20px', borderRadius: 20,
            background: active ? COLORS.accent : 'transparent',
            boxShadow: active ? `0 10px 34px ${COLORS.accent}55` : 'none',
            color: active ? COLORS.paper : spoken ? COLORS.ink : `${COLORS.ink}40`,
            transform: `scale(${spoken ? pop : 0.86}) translateY(${spoken ? lift : 10}px)`,
            textShadow: active ? 'none' : `0 2px 18px ${COLORS.paper}`,
          }}>
            {w.word}
          </span>
        );
      })}
    </div>
  );
};

// =============================================================================
// ProgressBar — thin gradient bar across the very top, filling with playback.
// A quiet retention device: the viewer's brain registers "almost done, stay".
// =============================================================================
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10, background: `${COLORS.line}66` }}>
      <div style={{ height: '100%', width: `${p * 100}%`, background: GRADIENT, borderRadius: '0 5px 5px 0' }} />
    </div>
  );
};

// =============================================================================
// CoverImage — the "thumbnail" layer. Shorts can't have uploaded thumbnails:
// YouTube shows FRAME 0 in the feed/grid, so the hook frame IS the thumbnail.
// Full-bleed Nano Banana art (tools/gen_image.py --model fast --aspect 9:16,
// NO text in the image — text is HookTitle's job, in brand type) under a scrim
// that keeps the payoff line legible. Reuse at the loop point so the last
// frame resolves back into the cover and the replay is seamless.
// =============================================================================
export const CoverImage: React.FC<{
  src: string; // staticFile path, e.g. 'projects/short-007/cover.png'
  at?: number; // fade-in start frame (0 for the hook)
  out?: number; // start of fade-out (omit to stay)
  opacity?: number; // art intensity under the scrim
}> = ({ src, at = 0, out, opacity = 1 }) => {
  const frame = useCurrentFrame();
  // at=0 must be FULLY visible on frame 0 — frame 0 is the feed thumbnail; a fade-in
  // there would put an empty frame on the shelf. Fades only apply to mid-video entries.
  const fadeIn = at === 0 ? 1 : interpolate(frame, [at, at + 8], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const fadeOut = out === undefined ? 1 : 1 - interpolate(frame, [out, out + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  const op = opacity * Math.min(fadeIn, fadeOut);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      {/* scrim: darkens top for the hook text, feathers to paper at the bottom for captions */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COLORS.ink}99 0%, ${COLORS.ink}33 34%, transparent 55%, ${COLORS.paper}ee 88%)` }} />
    </AbsoluteFill>
  );
};

// =============================================================================
// Watermark — persistent channel mark, top-left under the progress bar. Pass
// `src` (a staticFile path like 'library/logos/channel-mark.png') once a real
// logo exists in media/library/logos/; with no src it renders the BRAND
// wordmark from brand.ts, so it is never wrong — only more generic. Branding
// every frame is part of the originality defense (NICHE-STRATEGY.md §5).
// =============================================================================
export const Watermark: React.FC<{ src?: string; at?: number }> = ({ src, at = 0 }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at, at + 12], [0, 0.92], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <div style={{ position: 'absolute', top: 34, left: SAFE.side, opacity: op }}>
      {src ? (
        <Img src={staticFile(src)} style={{ height: 56, borderRadius: 14 }} />
      ) : (
        <div style={{
          background: `${COLORS.paper}d9`, border: `2px solid ${COLORS.line}`, borderRadius: RADIUS.pill,
          padding: '8px 24px', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 0.5,
        }}>
          <span style={{ color: COLORS.ink }}>{BRAND.wordmark[0]}</span>
          <span style={{ color: COLORS.accent }}>{BRAND.wordmark[1]}</span>
          <span style={{ color: COLORS.ink }}>{BRAND.wordmark[2]}</span>
        </div>
      )}
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
      {lines.map((l, i) => {
        // accent lines get a highlight sweep drawing underneath as they land
        const sweep = interpolate(frame, [at + 14 + i * 6, at + 30 + i * 6], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
        return (
          <h1 key={i} style={{
            ...rise(at + 5 + i * 6), margin: 0, fontFamily: FONT_DISPLAY, fontWeight: 700,
            fontSize, lineHeight: 1.08, color: l.accent ? COLORS.accent : COLORS.ink,
            position: 'relative', display: 'inline-block',
          }}>
            {l.accent ? (
              <span style={{
                position: 'absolute', left: -10, right: -10, bottom: 8, height: 26,
                background: `${COLORS.signal}55`, borderRadius: 8,
                transform: `scaleX(${sweep})`, transformOrigin: 'left', zIndex: 0,
              }} />
            ) : null}
            <span style={{ position: 'relative', zIndex: 1 }}>{l.text}</span>
          </h1>
        );
      })}
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
      fontFamily: FONT_MONO, fontWeight: 700, fontSize: 36, padding: '14px 38px',
      boxShadow: `0 10px 30px ${color}55`, letterSpacing: 2,
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
  const y = interpolate(frame, [at, at + 16], [60, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const s = interpolate(frame, [at, at + 18], [0.94, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const chipPop = interpolate(frame, [at + 8, at + 18], [0, 1], { ...CLAMP, easing: EASINGS.overshoot });
  return (
    <div style={{
      position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 210,
      opacity: op, transform: `translateY(${y}px) scale(${s})`, transformOrigin: '50% 30%',
      background: COLORS.paper, border: `2px solid ${COLORS.line}`, borderRadius: RADIUS.card,
      boxShadow: SHADOW.card, padding: '48px 48px 44px', display: 'flex', flexDirection: 'column', gap: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 74, color: COLORS.ink, lineHeight: 1.05 }}>{name}</div>
        {chip ? (
          <div style={{
            background: chipColor, color: COLORS.paper, borderRadius: RADIUS.pill,
            fontFamily: FONT_MONO, fontWeight: 700, fontSize: 32, padding: '12px 28px', whiteSpace: 'nowrap',
            transform: `scale(${chipPop})`, boxShadow: `0 8px 26px ${chipColor}66`,
          }}>
            {chip}
          </div>
        ) : null}
      </div>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 44, lineHeight: 1.32, color: COLORS.muted }}>{tagline}</div>
      {children ? <div style={{ marginTop: 12 }}>{children}</div> : null}
    </div>
  );
};
