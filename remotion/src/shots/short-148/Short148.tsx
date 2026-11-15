import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-148: fast-lane multipliers per 1M tokens: Gemini 4 Carbon Priority $3.60/$18 vs $2/$10 (1.8x, thru Nov 30), Fable 5.2 fast $16/$80 vs $8/$40,
// GPT-6 Astra Fast $20/$100 vs $10/$50, Ultrafast $60/$300 (aistudio.google.com/docs/pricing, platform.claude.com/.../pricing, developers.openai.com/api/docs/pricing, 2026-11-15).
export const compositionConfig = { id: 'Short148', durationInSeconds: 44.4, fps: 30, width: 1080, height: 1920 };

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean; bad?: boolean }> = ({ k, v, good, bad }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: bad ? COLORS.danger : good ? COLORS.signalAlt : COLORS.d300, fontWeight: good || bad ? 700 : 400 }}>{v}</span>
  </div>
);
const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
);

const END = 38.8;

const Short148: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(END);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'FAST LANE' }, { text: 'GOOGLE 1.8X', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(7.5)}>
        <CoverImage src="projects/short-148/cover.png" out={secToFrame(7.5) - 10} />
        <HookTitle hold onDark kicker="FAST LANE PRICING" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(14.5)}>
        <ToolCard name="Gemini 4 Carbon" tagline="Priority vs standard, per 1M." chip="1.8x" at={secToFrame(7.5) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="standard" v="$2 / $10" />
            <Line k="priority" v="$3.60 / $18" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(21.6)}>
        <ToolCard name="Claude Fable 5.2" tagline="Fast mode vs standard." chip="2x" at={secToFrame(14.5) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="standard" v="$8 / $40" />
            <Line k="fast mode" v="$16 / $80" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(27.8)}>
        <ToolCard name="GPT-6 Astra" tagline="Fast vs standard." chip="2x" at={secToFrame(21.6) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="standard" v="$10 / $50" />
            <Line k="fast" v="$20 / $100" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(32.0)}>
        <ToolCard name="Cheapest lane" tagline="Price multiplier over standard." chip="GOOGLE" at={secToFrame(27.8) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="Gemini" v="1.8x" good />
            <Line k="Claude" v="2x" />
            <Line k="OpenAI" v="2x" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="Astra Ultrafast" tagline="OpenAI's one more lane." chip="6x" at={secToFrame(32.0) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="standard" v="$10 / $50" />
            <Line k="ultrafast" v="$60 / $300" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-148/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="GEMINI VS CLAUDE VS OPENAI" lines={lines} />
      </AbsoluteFill>
      <FadeOut at={secToFrame(43.9)}>
        <CaptionTrack words={WORDS} />
      </FadeOut>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short148;
