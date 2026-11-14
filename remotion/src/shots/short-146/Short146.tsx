import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-146: Claude Haiku 5.5 vs GPT-6 Luna, per 1M tokens (Standard).
// Haiku <=100K $0.10/$0.50 (hits $0.01), >100K $0.50/$2.50; Luna <=272K $0.10/$0.50 ($0.01), >272K $0.20/$0.75.
// (platform.claude.com/docs/en/about-claude/pricing, developers.openai.com/api/docs/pricing, 2026-11-14).
export const compositionConfig = { id: 'Short146', durationInSeconds: 44.3, fps: 30, width: 1080, height: 1920 };

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

const B1 = 10.2; // "Under a hundred thousand"
const B2 = 20.4; // "But send Haiku"
const B3 = 29.3; // "Luna stays at ten cents"
const B4 = 36.9; // "Twenty cents in"
const END = 40.9; // "Same ten cents."

const Short146: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(END);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'BOTH COST 10¢' }, { text: 'UNTIL 100K', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(B1)}>
        <CoverImage src="projects/short-146/cover.png" out={secToFrame(B1) - 10} />
        <HookTitle hold onDark kicker="HAIKU 5.5 VS GPT-6 LUNA" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(B2)}>
        <ToolCard name="A dead tie" tagline="Per 1M tokens, short prompts." chip="TIE" at={secToFrame(B1) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="Haiku 5.5 in/out" v="$0.10 / $0.50" good />
            <Line k="GPT-6 Luna in/out" v="$0.10 / $0.50" good />
            <Line k="cache reads, both" v="$0.01" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B3)}>
        <ToolCard name="Haiku past 100K" tagline="The whole request reprices." chip="5x" at={secToFrame(B2) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="prompt <= 100K" v="$0.10 / $0.50" />
            <Line k="prompt > 100K" v="$0.50 / $2.50" bad />
            <Line k="cache reads" v="$0.01 -> $0.05" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B4)}>
        <ToolCard name="Luna to 272K" tagline="What does it cost past that?" chip="272K" at={secToFrame(B3) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="prompt <= 272K" v="$0.10 / $0.50" good />
            <Line k="prompt > 272K" v="?" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="Long prompts" tagline="Per 1M tokens, in / out." chip="LUNA" at={secToFrame(B4) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="Luna > 272K" v="$0.20 / $0.75" good />
            <Line k="Haiku > 100K" v="$0.50 / $2.50" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-146/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="HAIKU 5.5 VS GPT-6 LUNA" lines={lines} />
      </AbsoluteFill>
      <FadeOut at={secToFrame(43.9)}>
        <CaptionTrack words={WORDS} />
      </FadeOut>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short146;
