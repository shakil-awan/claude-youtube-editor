import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO, FONT_BODY } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { WebBrowserFrame } from '../../lib/browser';
import {
  CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame,
} from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-016 — "Stop paying a web designer. This AI builds it free."
// Replacement format: HOOK -> Beat1 (Framer, fake-screencast proof) -> Beat2
// (wallet math) -> Beat3 (subdomain catch) -> Beat4 (Pro tier) -> LOOP.
// All beat boundaries are cut from videos/short-016/work/voiceover/words.json
// (copied verbatim into ./words.ts) — never eyeballed.
// =============================================================================
export const compositionConfig = { id: 'Short016', durationInSeconds: 42.3, fps: 30, width: 1080, height: 1920 };

const COVER = 'projects/short-016/cover.png';

// ---- beat boundaries (frames @30fps), cut from the word timestamps ----------
// "Stop paying a web designer. This AI builds your site for free." (0 -> 3.901s)
const HOOK_OUT = secToFrame(4.1); // 123 — before "It's called Framer" (4.226s)

// "It's called Framer, and you type what you want, it designs the whole page
// for you. The free plan gives you five hundred AI credits every month, no
// card needed." (4.226 -> 13.27s)
const B1_IN = secToFrame(4.2); // 126
const B1_OUT = secToFrame(13.6); // 408 — before "Here's the wallet math." (13.781s)

// "Here's the wallet math. A freelance designer can run you hundreds of
// dollars. Framer's free plan costs zero." (13.781 -> 21.176s)
const B2_IN = secToFrame(13.7); // 411
const B2_OUT = secToFrame(21.5); // 645 — before "The catch" (21.687s)

// "The catch, free sites live on a Framer subdomain. Your own domain name
// needs the ten dollar Basic plan." (21.687 -> 28.293s)
const B3_IN = secToFrame(21.6); // 648
const B3_OUT = secToFrame(28.6); // 858 — before "Want more power?" (28.804s)

// "Want more power? Pro is thirty dollars a month, three thousand AI
// credits, still a fraction of hiring someone." (28.804 -> 36.071s)
const B4_IN = secToFrame(28.7); // 861
const B4_OUT = secToFrame(36.7); // 1101 — before "So yes" (36.884s)

// "So yes, this free AI still builds your website. Try it before you hire
// anyone." (36.884 -> 41.749s) — loop back to the cover.
const LOOP_IN = secToFrame(36.8); // 1104

// fade a beat OUT smoothly so the next one hands off cleanly
const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// fade a beat IN and hold — used for the loop-back so the LAST frame is a
// static, fully-opaque poster (the shelf/last-frame QA gate), never mid-fade.
const FadeIn: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// tiny macOS-style cursor arrow (screencast.tsx's CursorPointer isn't exported,
// so this is a same-shape local copy for this shot's proof-slot walkthrough).
const CursorPointer: React.FC<{ press?: number }> = ({ press = 1 }) => (
  <svg width={26} height={26} viewBox="0 0 24 24" style={{ transform: `scale(${press})`, transformOrigin: '16% 10%', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))', display: 'block' }}>
    <path d="M4.2 2.6 L4.2 18.9 L8.7 14.7 L11.9 21.6 L14.6 20.3 L11.4 13.6 L17.6 13.6 Z" fill="#111318" stroke="#ffffff" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

// -----------------------------------------------------------------------------
// FramerScreencast — the fake-screencast proof slot for Beat 1: a simulated
// Framer editor. An animated cursor eases to the AI prompt field, types a
// prompt, clicks Generate, and the page assembles block by block. Built
// entirely from frame-based TSX (no screenshots needed) on WebBrowserFrame.
// -----------------------------------------------------------------------------
const PROMPT_TEXT = 'bakery landing page';
const FramerScreencast: React.FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const t = frame - appearAt;

  // cursor path: idle -> prompt field -> Generate button (fractions of the 856x340 canvas)
  const cx = interpolate(t, [0, 26, 96, 118], [0.50, 0.40, 0.86, 0.86], { ...CLAMP, easing: EASINGS.easeInOut });
  const cy = interpolate(t, [0, 26, 96, 118], [0.92, 0.40, 0.40, 0.40], { ...CLAMP, easing: EASINGS.easeInOut });
  const press = t > 114 && t < 128 ? interpolate(t, [114, 122, 128], [1, 0.82, 1], CLAMP) : 1;

  // typed text in the AI prompt field
  const chars = Math.round(interpolate(t, [30, 92], [0, PROMPT_TEXT.length], { ...CLAMP, easing: EASINGS.easeInOut }));
  const typed = PROMPT_TEXT.slice(0, chars);
  const caretOn = Math.floor(t / 8) % 2 === 0;

  // click ripple
  const rippleOn = t >= 118 && t <= 142;
  const rippleScale = interpolate(t, [118, 142], [0, 2.2], { ...CLAMP, easing: EASINGS.easeOut });
  const rippleOp = interpolate(t, [118, 142], [0.55, 0], CLAMP);

  // assembled page blocks (after the click)
  const heroOp = interpolate(t, [140, 156], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const heroY = interpolate(t, [140, 156], [16, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const cardOp = (base: number) => interpolate(t, [base, base + 14], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const cardY = (base: number) => interpolate(t, [base, base + 14], [16, 0], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <div style={{ position: 'relative', width: 856, height: 340 }}>
      <WebBrowserFrame
        url="framer.com/projects/new"
        tabTitle="Framer — AI site builder"
        box={{ x: 0, y: 0, w: 856, h: 340 }}
        appearAt={appearAt}
        uiScale={1.1}
      >
        <div style={{ width: 856, height: 260, background: '#f5f5f7', fontFamily: FONT_BODY, position: 'relative', display: 'flex' }}>
          {/* left rail */}
          <div style={{ width: 54, background: '#ececef', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, paddingTop: 16 }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? COLORS.accent : '#d3d3d8' }} />)}
          </div>
          {/* canvas */}
          <div style={{ flex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* AI prompt field */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `2px solid ${COLORS.accent}55`,
              borderRadius: 10, padding: '10px 14px', fontFamily: FONT_MONO, fontSize: 19, color: '#1d1d1d', boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            }}>
              <span style={{ color: COLORS.accent, fontWeight: 700 }}>✦ AI</span>
              <span>{typed}{caretOn && chars < PROMPT_TEXT.length ? '|' : ''}</span>
              <span style={{ marginLeft: 'auto', background: COLORS.accent, color: '#fff', borderRadius: 999, padding: '5px 14px', fontSize: 16, fontWeight: 700 }}>Generate</span>
            </div>
            {/* assembling page preview */}
            <div style={{ flex: 1, background: '#fff', borderRadius: 10, border: '1px solid #e6e6ea', padding: 14, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
              <div style={{ opacity: heroOp, transform: `translateY(${heroY}px)`, height: 54, borderRadius: 8, background: `linear-gradient(120deg, ${COLORS.accent}33, ${COLORS.accent2}33)`, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8 }}>
                <div style={{ width: 90, height: 10, borderRadius: 4, background: COLORS.d600 }} />
                <div style={{ width: 50, height: 10, borderRadius: 4, background: '#d3d3d8' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, flex: 1 }}>
                {[152, 160, 168].map((base, i) => (
                  <div key={i} style={{ flex: 1, opacity: cardOp(base), transform: `translateY(${cardY(base)}px)`, background: '#f5f5f7', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ height: 26, borderRadius: 5, background: '#e2e2e6' }} />
                    <div style={{ width: '80%', height: 6, borderRadius: 3, background: '#d3d3d8' }} />
                    <div style={{ width: '55%', height: 6, borderRadius: 3, background: '#d3d3d8' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </WebBrowserFrame>

      {/* click ripple */}
      {rippleOn && (
        <div style={{
          position: 'absolute', left: cx * 856, top: cy * 340 + 46, width: 30, height: 30, marginLeft: -15, marginTop: -15,
          borderRadius: '50%', border: `2px solid ${COLORS.accent}`, opacity: rippleOp, transform: `scale(${rippleScale})`,
        }} />
      )}
      {/* animated cursor */}
      <div style={{ position: 'absolute', left: cx * 856, top: cy * 340 + 46, transform: 'translate(-4px,-3px)' }}>
        <CursorPointer press={press} />
      </div>
    </div>
  );
};

const Short016: React.FC = () => {
  return (
    <AbsoluteFill>
      <ShortBg />

      {/* ---- cover / HOOK (frame 0 = the feed poster) ---- */}
      <CoverImage src={COVER} at={0} out={HOOK_OUT} />
      <FadeOut at={HOOK_OUT}>
        <HookTitle
          hold
          onDark
          kicker="STOP PAYING A DESIGNER"
          lines={[{ text: 'This AI builds' }, { text: 'your website free', accent: true }]}
        />
      </FadeOut>

      {/* ---- Beat 1: Framer, fake-screencast proof ---- */}
      <FadeOut at={B1_OUT}>
        <ToolCard
          name="Framer"
          tagline="Type a prompt, get a full site."
          chip="FREE"
          chipColor={COLORS.signal}
          at={B1_IN + 4}
        >
          <FramerScreencast appearAt={B1_IN + 14} />
        </ToolCard>
      </FadeOut>

      {/* ---- Beat 2: wallet math ---- */}
      <FadeOut at={B2_OUT}>
        <ToolCard
          name="Framer"
          tagline="A freelancer costs hundreds. This is $0."
          chip="FREE"
          chipColor={COLORS.signal}
          at={B2_IN + 4}
        />
      </FadeOut>

      {/* ---- Beat 3: the subdomain catch ---- */}
      <FadeOut at={B3_OUT}>
        <ToolCard
          name="Framer"
          tagline="Free = Framer subdomain."
          chip="$10/mo for your domain"
          chipColor={COLORS.warn}
          at={B3_IN + 4}
        />
      </FadeOut>

      {/* ---- Beat 4: Pro tier, for scale ---- */}
      <FadeOut at={B4_OUT}>
        <ToolCard
          name="Framer"
          tagline="3,000 credits — still cheaper than hiring."
          chip="$30/mo Pro"
          chipColor={COLORS.accent2}
          at={B4_IN + 4}
        />
      </FadeOut>

      {/* ---- LOOP: back to the cover for the seamless replay ---- */}
      <FadeIn at={LOOP_IN}>
        <CoverImage src={COVER} at={LOOP_IN} />
        <HookTitle
          hold
          onDark
          kicker="STOP PAYING A DESIGNER"
          lines={[{ text: 'This AI builds' }, { text: 'your website free', accent: true }]}
        />
      </FadeIn>

      <ProgressBar />
      <Watermark />
      {/* captions hidden once the loop returns to the cover — CaptionTrack's
          default ink color vanishes on dark cover art, and a caption burning
          across the closing poster would defeat the loop. */}
      <FadeOut at={LOOP_IN}>
        <CaptionTrack words={WORDS} startAt={24} />
      </FadeOut>
    </AbsoluteFill>
  );
};
export default Short016;
