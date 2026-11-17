import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-152: OpenAI gpt-live-1 $0.05/min billed per second (developers.openai.com/api/docs/pricing) vs Gemini 3.8 Live
// audio in $0.005/min + audio out $0.018/min, free tier covers all usage (aistudio.google.com/docs/pricing), 2026-11-17.
export const compositionConfig = { id: 'Short152', durationInSeconds: 41.7, fps: 30, width: 1080, height: 1920 };
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

const B1 = 6.3;   // "OpenAI's GPT Live one"
const B2 = 12.8;  // "Gemini 3.8 Live bills"
const B3 = 22.9;  // "Even if both sides"
const B4 = 29.0;  // "And the twist?"
const END = 36.8; // "Two point three cents, or five"

const Short152: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(END);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'VOICE AI' }, { text: '2.3¢ VS 5¢', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(B1)}>
        <CoverImage src="projects/short-152/cover.png" out={secToFrame(B1) - 10} />
        <HookTitle hold onDark kicker="GOOGLE VS OPENAI, PER MINUTE" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(B2)}>
        <ToolCard name="OpenAI GPT-Live" tagline="gpt-live-1, voice in and out." chip="5¢/MIN" at={secToFrame(B1) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="per minute" v="$0.05" bad />
            <Line k="billing" v="per second" />
            <Line k="per hour" v="$3.00" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B3)}>
        <ToolCard name="Gemini 3.8 Live" tagline="Billed per direction, paid tier." chip="SPLIT" at={secToFrame(B2) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="audio you send" v="$0.005/min" good />
            <Line k="audio it speaks" v="$0.018/min" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B4)}>
        <ToolCard name="Worst case" tagline="Both sides streaming a full minute." chip="-54%" at={secToFrame(B3) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="Gemini 3.8 Live" v="$0.023" good />
            <Line k="OpenAI gpt-live-1" v="$0.050" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="The twist" tagline="Gemini Live free tier." chip="FREE" at={secToFrame(B4) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="free tier input" v="free" good />
            <Line k="free tier output" v="free" good />
            <Line k="data used (free)" v="yes" bad />
            <Line k="data used (paid)" v="no" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-152/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="YOUR VOICE AGENT, YOUR CALL" lines={lines} />
      </AbsoluteFill>
      <FadeOut at={secToFrame(41.2)}>
        <CaptionTrack words={WORDS} />
      </FadeOut>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short152;
