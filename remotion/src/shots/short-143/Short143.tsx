import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-143: Gemini 4 Hydrogen GA Nov 12 2026: $1.50/$7.50 + free tier. Carbon $2/$10 -> $4/$20 Dec 1.
// 3.8 Flash $0.75/$3.75 -> $1.50/$7.50 Jan 1 (aistudio.google.com/docs/pricing, 2026-11-13).
export const compositionConfig = { id: 'Short143', durationInSeconds: 40.1, fps: 30, width: 1080, height: 1920 };

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

const B1 = 5.7; // "It launched November twelfth"
const B2 = 12.0; // "Now compare Carbon"
const B3 = 22.0; // "Hydrogen has no price change"
const B4 = 25.0; // "And Gemini 3.8 Flash"
const END = 34.7; // "So Hydrogen costs"

const Short143: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(END);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'HYDROGEN $1.50' }, { text: 'CARBON 2X', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(B1)}>
        <CoverImage src="projects/short-143/cover.png" out={secToFrame(B1) - 10} />
        <HookTitle hold onDark kicker="GOOGLE GEMINI 4" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(B2)}>
        <ToolCard name="Gemini 4 Hydrogen" tagline="Launched Nov 12. Per 1M tokens." chip="$1.50" at={secToFrame(B1) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="free tier" v="yes" good />
            <Line k="input" v="$1.50" />
            <Line k="output" v="$7.50" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B3)}>
        <ToolCard name="Carbon doubles" tagline="Google's bigger model." chip="DEC 1" at={secToFrame(B2) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="today input" v="$2.00" />
            <Line k="Dec 1 input" v="$4.00" bad />
            <Line k="today output" v="$10" />
            <Line k="Dec 1 output" v="$20" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B4)}>
        <ToolCard name="Hydrogen: no change" tagline="No price change listed." chip="$1.50" at={secToFrame(B3) - 2}>
          <Panel>
            <Line k="Hydrogen Dec 1" v="$1.50 / $7.50" good />
            <Line k="Carbon Dec 1" v="$4 / $20" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="Gemini 3.8 Flash" tagline="Input per 1M tokens." chip="JAN 1" at={secToFrame(B4) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="today" v="$0.75" good />
            <Line k="Jan 1, 2027" v="$1.50" bad />
            <Line k="Hydrogen today" v="$1.50" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-143/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="GOOGLE GEMINI 4" lines={lines} />
      </AbsoluteFill>
      <FadeOut at={secToFrame(39.7)}>
        <CaptionTrack words={WORDS} />
      </FadeOut>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short143;
