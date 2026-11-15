import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-147: Gemini 4 Carbon (std $2/$10 thru Nov 30, $4/$20 from Dec 1; cache $0.10 -> $0.20) vs Claude Fable 5.2 ($8/$40, cache $0.20).
// (aistudio.google.com/docs/pricing, platform.claude.com/docs/en/about-claude/pricing, 2026-11-15).
export const compositionConfig = { id: 'Short147', durationInSeconds: 40.9, fps: 30, width: 1080, height: 1920 };

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

const END = 35.6;

const Short147: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(END);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'CARBON DOUBLES' }, { text: 'STILL HALF', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(7.0)}>
        <CoverImage src="projects/short-147/cover.png" out={secToFrame(7.0) - 10} />
        <HookTitle hold onDark kicker="GEMINI 4 CARBON VS FABLE 5.2" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(16.5)}>
        <ToolCard name="Right now" tagline="Per 1M tokens, in / out." chip="4x" at={secToFrame(7.0) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="Carbon" v="$2 / $10" good />
            <Line k="Fable 5.2" v="$8 / $40" />
            <Line k="gap" v="4x" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(25.9)}>
        <ToolCard name="From December 1" tagline="Carbon doubles. Fable doesn't." chip="2x" at={secToFrame(16.5) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="Carbon" v="$4 / $20" bad />
            <Line k="Fable 5.2" v="$8 / $40" />
            <Line k="gap" v="2x" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(32.2)}>
        <ToolCard name="Cache reads" tagline="Per 1M tokens." chip="CACHE" at={secToFrame(25.9) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="Carbon now" v="$0.10" good />
            <Line k="Carbon Dec 1" v="$0.20" bad />
            <Line k="Fable 5.2" v="?" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="They tie" tagline="Per 1M tokens, cache reads." chip="TIE" at={secToFrame(32.2) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="Carbon Dec 1" v="$0.20" bad />
            <Line k="Fable 5.2" v="$0.20" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-147/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="GEMINI 4 CARBON VS FABLE 5.2" lines={lines} />
      </AbsoluteFill>
      <FadeOut at={secToFrame(40.4)}>
        <CaptionTrack words={WORDS} />
      </FadeOut>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short147;
