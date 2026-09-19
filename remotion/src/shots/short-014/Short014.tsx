import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-014 — "Leonardo gives 150 free credits daily — Runway gives you one
// shot" (versus format: HOOK -> SETUP -> QUIZ -> REVEAL -> TWIST -> LOOP/CTA).
// Beats: Runway's one-time 125 credits -> Leonardo's daily-resetting 150 ->
// the twist (one expires, one never does). Cover held at frame 0 and reused
// at the CTA so the loop is seamless. Every ToolCard beat carries the SAME
// literal credits comparison table (proof slot), just re-emphasized per beat.
// =============================================================================
// tail is slightly over the usual +0.5s: the final caption page is a lone word
// ("free.") that CaptionTrack holds until end_s + 0.6s — a longer tail lets it
// clear before the closing cover frame, keeping the loop frame caption-free.
export const compositionConfig = { id: 'Short014', durationInSeconds: 37.8, fps: 30, width: 1080, height: 1920 };

// beat frames @30fps, from work/voiceover/words.json word boundaries
const B1 = 129; // "Most free AI plans don't work that way..." (Runway beat begins)
const B2 = 595; // "Leonardo's free plan resets every twenty-four hours..." (Leonardo beat begins)
const B3 = 840; // "Runway's free tier expires the moment you use it." (twist begins)
const CTA = 1013; // "Follow for the free AI tools..." (loop back to cover)

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// ---- the real evidence: a literal credits comparison table, reused across every beat ----
type Strength = 'dim' | 'normal' | 'strong';

const CreditsRow: React.FC<{
  tone: 'runway' | 'leonardo';
  label: string;
  value: string;
  sub: string;
  strength: Strength;
  pulse?: boolean;
}> = ({ tone, label, value, sub, strength, pulse }) => {
  const frame = useCurrentFrame();
  const base = tone === 'runway' ? COLORS.danger : COLORS.signalAlt;
  const opacity = strength === 'dim' ? 0.32 : strength === 'normal' ? 0.85 : 1;
  const weight = strength === 'strong' ? 700 : 500;
  const pulseScale = pulse ? 1 + Math.sin(frame / 8) * 0.025 : 1;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', opacity,
      transform: `scale(${pulseScale})`, transformOrigin: 'left center',
    }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 30, fontWeight: 600, color: COLORS.d300 }}>{label}</div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: FONT_MONO, fontWeight: weight, fontSize: 40, color: strength === 'strong' ? base : COLORS.d300 }}>{value}</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 21, color: COLORS.d400 }}>{sub}</div>
      </div>
    </div>
  );
};

const CreditsTable: React.FC<{ runway: Strength; leonardo: Strength; pulseLeonardo?: boolean }> = ({ runway, leonardo, pulseLeonardo }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '26px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
    <CreditsRow tone="runway" label="Runway" value="125 credits" sub="one-time · never refills" strength={runway} />
    <div style={{ height: 1, background: COLORS.d600 }} />
    <CreditsRow tone="leonardo" label="Leonardo" value="150 credits" sub="every 24 hours · forever" strength={leonardo} pulse={pulseLeonardo} />
  </div>
);

const Short014: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      {/* HOOK — the frame-0 poster: finished cover + held title, nothing mid-animation */}
      <FadeOut at={B1}>
        <CoverImage src="projects/short-014/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="EVERY SINGLE DAY" lines={[{ text: '150 FREE' }, { text: 'CREDITS', accent: true }]} />
      </FadeOut>

      {/* SETUP + QUIZ — Runway: one-time, spend it and it's gone */}
      <FadeOut at={B2}>
        <ToolCard name="Runway's free plan" tagline="One-time bonus. Spend it, it's gone." chip="ONCE" chipColor={COLORS.danger} at={B1 + 4}>
          <CreditsTable runway="strong" leonardo="dim" />
        </ToolCard>
      </FadeOut>

      {/* REVEAL — Leonardo: resets every 24 hours, forever */}
      <FadeOut at={B3}>
        <ToolCard name="Leonardo's free plan" tagline="Resets every 24 hours. Forever." chip="DAILY" chipColor={COLORS.signal} at={B2 + 4}>
          <CreditsTable runway="dim" leonardo="strong" pulseLeonardo />
        </ToolCard>
      </FadeOut>

      {/* TWIST — Runway dims out, Leonardo pulses: the answer, visually */}
      <FadeOut at={CTA}>
        <ToolCard name="The real difference" tagline="One expires. One never does." chip="COMPARE" chipColor={COLORS.accent2} at={B3 + 4}>
          <CreditsTable runway="dim" leonardo="strong" pulseLeonardo />
        </ToolCard>
      </FadeOut>

      {/* LOOP / CTA — back to the cover layout so the replay is seamless */}
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-014/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="EVERY SINGLE DAY" lines={[{ text: '150 FREE' }, { text: 'CREDITS', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Free tools that actually stay free.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short014;
