import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-012 — "Google gives you 1.5M free AI tokens a day" (news-jack/listicle
// hybrid with a hard number in the hook, per learnings.md).
// Beats: what it is -> what the quota covers -> the catch. Cover held at frame 0.
// =============================================================================
export const compositionConfig = { id: 'Short012', durationInSeconds: 38.5, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(7.477); // "It is called Google AI Studio"
const B2 = secToFrame(15.36); // "That quota stretches across…"
const B3 = secToFrame(22.186); // "The catch? Rate limits."
const CTA = secToFrame(33.181); // "But for building and testing…"

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean }> = ({ k, v, good }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : COLORS.d300, fontWeight: good ? 700 : 400 }}>{v}</span>
  </div>
);

const Short012: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-012/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="EVERY SINGLE DAY" lines={[{ text: '1.5 MILLION' }, { text: 'FREE TOKENS', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="Google AI Studio" tagline="A Google account. No card, no subscription." chip="FREE" at={B1 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="cost" v="$0" good />
            <Line k="signup" v="Google account" />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="The daily quota" tagline="1.5M tokens a day, shared across models." chip="PER DAY" at={B2 + 4} chipColor={COLORS.accent2}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="Gemini 2.5 Flash" v="included" good />
            <Line k="Gemini 1.5 Pro" v="included" good />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="The catch" tagline="Rate limits, and Pro is paid-only on the API." chip="READ THIS" at={B3 + 4} chipColor={COLORS.danger}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="requests / min" v="10 - 30" />
            <Line k="Pro on API" v="paid only" />
          </div>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-012/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="EVERY SINGLE DAY" lines={[{ text: '1.5 MILLION' }, { text: 'FREE TOKENS', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Enough to build on.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short012;
