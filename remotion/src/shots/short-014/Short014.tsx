import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-014 — "Grok 4.7 charges $2/$6 per million tokens on the API. The free
// tier on grok.com/X is still the older, rate-limited Grok 4.3." (news-jack).
// Beats: API pricing -> what the free tier actually gives you -> the real cost.
// Cover held at frame 0 (payoff statement), loops back at the CTA.
// =============================================================================
export const compositionConfig = { id: 'Short014', durationInSeconds: 34.59, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(4.667); // "On the API, it costs two dollars..."
const B2 = secToFrame(15.337); // "But the free tier on Grok dot com..."
const B3 = secToFrame(26.68); // "If you want the model xAI is actually promoting..."
const CTA = secToFrame(31.869); // "The free tier is last generation."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// pricing-table style proof row — tone carries the read (warn = costs money,
// bad = the worse side of the comparison, good = the free/positive side)
const Row: React.FC<{ k: string; v: string; tone?: 'default' | 'good' | 'warn' | 'bad' }> = ({ k, v, tone = 'default' }) => {
  const color = tone === 'good' ? COLORS.signalAlt : tone === 'warn' ? COLORS.accent2 : tone === 'bad' ? COLORS.danger : COLORS.d300;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
      <span style={{ color: COLORS.d400 }}>{k}</span>
      <span style={{ color, fontWeight: tone === 'default' ? 400 : 700 }}>{v}</span>
    </div>
  );
};

const ProofBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
    {children}
  </div>
);

const Short014: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-014/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="GROK 4.7 JUST LAUNCHED" lines={[{ text: '$6 per million' }, { text: 'FREE TIER SKIPS IT', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="Grok 4.7 API" tagline="Per-token pricing, straight off xAI's own docs." chip="PAID" at={B1 + 4} chipColor={COLORS.accent2}>
          <ProofBox>
            <Row k="input / M tokens" v="$2.00" tone="warn" />
            <Row k="output / M tokens" v="$6.00" tone="bad" />
            <Row k="past 200K context" v="$4 / $12" tone="bad" />
          </ProofBox>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="The free tier" tagline="grok.com and X still run the older model." chip="FREE" at={B2 + 4} chipColor={COLORS.signal}>
          <ProofBox>
            <Row k="model" v="Grok 4.3" tone="bad" />
            <Row k="rate limit" v="~10 / 2 hrs" tone="bad" />
          </ProofBox>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="The real cost" tagline="The model xAI is promoting isn't on the free plan." chip="READ THIS" at={B3 + 4} chipColor={COLORS.danger}>
          <ProofBox>
            <Row k="free plan" v="Grok 4.3, limited" tone="bad" />
            <Row k="API access" v="Grok 4.7, $2 / $6" tone="warn" />
          </ProofBox>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-014/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="GROK 4.7 JUST LAUNCHED" lines={[{ text: '$6 per million' }, { text: 'FREE TIER SKIPS IT', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          The free tier is last generation.
        </div>
      </AbsoluteFill>

      {frame < CTA ? <CaptionTrack words={WORDS} /> : null}
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short014;
