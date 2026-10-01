import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-015 — GPT-6.1 Sol: near-Astra at one fifth the price (news-jack).
// Beats: what it is -> vs Astra -> OpenAI's benchmark claim -> the catch -> cover.
// =============================================================================
export const compositionConfig = { id: 'Short015', durationInSeconds: 44.4, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(4.249); // "It is called GPT six point one Sol"
const B2 = secToFrame(15.592); // "Astra, the flagship..."
const B3 = secToFrame(24.776); // "OpenAI says Sol matches Astra"
const B4 = secToFrame(30.964); // "The catch?"
const CTA = secToFrame(40.763); // "Near flagship brains..."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean; bad?: boolean }> = ({ k, v, good, bad }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : bad ? COLORS.danger : COLORS.d300, fontWeight: good || bad ? 700 : 400 }}>{v}</span>
  </div>
);

const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
    {children}
  </div>
);

const Short015: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-015/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="GPT-6.1 SOL · NEAR-FLAGSHIP AI" lines={[{ text: 'ONE FIFTH' }, { text: 'THE PRICE', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="GPT-6.1 Sol" tagline="Launched Sept 29 at DevDay." chip="NEW" at={B1 + 4}>
          <Panel>
            <Line k="input / 1M" v="$2" good />
            <Line k="output / 1M" v="$10" good />
            <Line k="cached input" v="$0.10" good />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="Sol vs Astra" tagline="Exactly one fifth of the flagship." chip="5x CHEAPER" at={B2 + 4} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="Astra in / out" v="$10 / $50" bad />
            <Line k="Sol in / out" v="$2 / $10" good />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B4}>
        <ToolCard name="OpenAI's claim" tagline="Matches Astra on its coding test." chip="DEEPSWE" at={B3 + 4}>
          <Panel>
            <Line k="score vs Astra" v="matches" good />
            <Line k="cost vs Astra" v="~1/5" good />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="The catch" tagline="OpenAI's own benchmarks. Not in plain chat yet." chip="READ THIS" at={B4 + 4} chipColor={COLORS.danger}>
          <Panel>
            <Line k="benchmarks" v="OpenAI-run" bad />
            <Line k="available in" v="API, Codex, Work" />
            <Line k="regular chat" v="not yet" bad />
          </Panel>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-015/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="GPT-6.1 SOL · NEAR-FLAGSHIP AI" lines={[{ text: 'ONE FIFTH' }, { text: 'THE PRICE', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          One fifth the bill.
        </div>
      </AbsoluteFill>

      {frame < CTA ? <CaptionTrack words={WORDS} /> : null}
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short015;
