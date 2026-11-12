import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-141: Gemini Decision (Nov 11, 2026) — $0.10 per 1M input, zero output tokens,
// up to 1,000 questions per request (aistudio.google.com/docs/pricing + decisions-api, 2026-11-12).
// Cover held at frame 0; closes on the cover so the loop is seamless.
export const compositionConfig = { id: 'Short141', durationInSeconds: 40.8, fps: 30, width: 1080, height: 1920 };

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

const B1 = 6.2; // "It's called Gemini Decision"
const B2 = 9.6; // "You send it your data"
const B3 = 16.0; // "Yes or no"
const B4 = 21.0; // "So how much do the answers cost?"
const B5 = 23.5; // "Nothing."
const B6 = 31.0; // "Google's regular Gemini 3.8 Flash"
const END = 37.8; // hook restated

const Short141: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(END);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'WRITES ZERO WORDS' }, { text: '10¢ PER 1M', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(B1)}>
        <CoverImage src="projects/short-141/cover.png" out={secToFrame(B1) - 10} />
        <HookTitle hold onDark kicker="GOOGLE GEMINI API" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(B2)}>
        <ToolCard name="Gemini Decision" tagline="Launched Nov 11." chip="$0.10/1M" at={secToFrame(B1) - 2}>
          <Panel>
            <Line k="model" v="gemini-decision-1" />
            <Line k="input /1M" v="$0.10" good />
            <Line k="output" v="0 tokens" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B3)}>
        <ToolCard name="1,000 questions" tagline="One request. Your data once." chip="1 CALL" at={secToFrame(B2) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="questions / request" v="1 – 1,000" good />
            <Line k="context" v="262,144 tokens" />
            <Line k="answers" v="probabilities" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B4)}>
        <ToolCard name="3 question types" tagline="Branch your code on the answer." chip="0.01–0.99" at={secToFrame(B3) - 2}>
          <Panel>
            <Line k="yes / no" v="p = 0.87" good />
            <Line k="choice" v="2 – 255 options" />
            <Line k="score" v="rubric levels" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B5)}>
        <ToolCard name="The answers cost…" tagline="Make your guess." chip="?" at={secToFrame(B4) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="input /1M" v="$0.10" />
            <Line k="output /1M" v="???" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B6)}>
        <ToolCard name="Answers: $0" tagline="Only input is billed." chip="FREE OUT" at={secToFrame(B5) - 2}>
          <Panel>
            <Line k="output tokens" v="always 0" good />
            <Line k="shared data" v="billed once" good />
            <Line k="per extra question" v="its own prompt only" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="vs Gemini 3.8 Flash" tagline="Google's regular model." chip="7.5x IN" at={secToFrame(B6) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="Decision" v="$0.10 in / $0 out" good />
            <Line k="3.8 Flash" v="$0.75 in / $3.75 out" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-141/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="GOOGLE GEMINI API" lines={lines} />
      </AbsoluteFill>
      {/* captions clear after the last word so the final frame is the clean cover (loop point) */}
      <FadeOut at={secToFrame(40.4)}>
        <CaptionTrack words={WORDS} />
      </FadeOut>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short141;
