import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-150: Gemini 2.5 Flash Image (Nano Banana) $0.039/image (Batch $0.0195), shut down March 15, 2027; Nano Banana 2.1 $0.0336 1K / $0.0504 2K /
// $0.113 4K, Batch $0.0168 1K; Nano Banana Pro $0.134 1K/2K (aistudio.google.com/docs/pricing, 2026-11-16).
export const compositionConfig = { id: 'Short150', durationInSeconds: 40.3, fps: 30, width: 1080, height: 1920 };
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


const END = 35.8;

const Short150: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(END);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'NANO BANANA' }, { text: 'ENDS MARCH 15', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(6.0)}>
        <CoverImage src="projects/short-150/cover.png" out={secToFrame(6.0) - 10} />
        <HookTitle hold onDark kicker="GOOGLE IMAGE AI" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(13.6)}>
        <ToolCard name="Nano Banana" tagline="Gemini 2.5 Flash Image, per image." chip="MAR 15" at={secToFrame(6.0) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="standard" v="$0.039" />
            <Line k="batch" v="$0.0195" />
            <Line k="shutdown" v="Mar 15, 2027" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(23.4)}>
        <ToolCard name="Nano Banana 2.1" tagline="The replacement, per 1K image." chip="-14%" at={secToFrame(13.6) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="old standard" v="$0.039" />
            <Line k="2.1 standard" v="$0.0336" good />
            <Line k="2.1 batch" v="$0.0168" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(31.9)}>
        <ToolCard name="More pixels?" tagline="Nano Banana 2.1, per image." chip="4K" at={secToFrame(23.4) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="1K" v="$0.0336" />
            <Line k="2K" v="$0.0504" />
            <Line k="4K" v="$0.113" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="Still cheaper" tagline="2.1 at 4K vs Pro at 1K." chip="PRO" at={secToFrame(31.9) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="2.1 at 4K" v="$0.113" good />
            <Line k="Pro at 1K" v="$0.134" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-150/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="SWITCH BEFORE MARCH 15" lines={lines} />
      </AbsoluteFill>
      <FadeOut at={secToFrame(39.8)}>
        <CaptionTrack words={WORDS} />
      </FadeOut>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short150;
