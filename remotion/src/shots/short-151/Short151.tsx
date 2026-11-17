import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-151: Gemini 4 Hydrogen $1.50/$7.50 standard vs $0.75/$3.75 Contributor tier; Gemini 4 Argon $2/$10 vs $1/$5 Contributor;
// Contributor = invite-only private preview, same speed as Standard, data used to improve Google products
// (aistudio.google.com/docs/pricing + /docs/logs-policy, 2026-11-17).
export const compositionConfig = { id: 'Short151', durationInSeconds: 36.9, fps: 30, width: 1080, height: 1920 };
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

const B1 = 4.5;   // "Gemini 4 Hydrogen costs"
const B2 = 10.9;  // "The new Contributor tier"
const B3 = 16.8;  // "Gemini 4 Argon"
const B4 = 22.2;  // "So what's the catch?"
const END = 31.15; // "Half price on Gemini 4"

const Short151: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(END);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'GEMINI 4' }, { text: 'HALF PRICE', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(B1)}>
        <CoverImage src="projects/short-151/cover.png" out={secToFrame(B1) - 10} />
        <HookTitle hold onDark kicker="IF GOOGLE GETS YOUR PROMPTS" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(B2)}>
        <ToolCard name="Gemini 4 Hydrogen" tagline="Standard tier, per 1M tokens." chip="$1.50" at={secToFrame(B1) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="input" v="$1.50" />
            <Line k="output" v="$7.50" />
            <Line k="cache" v="$0.075" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B3)}>
        <ToolCard name="Contributor tier" tagline="Gemini 4 Hydrogen, per 1M tokens." chip="-50%" at={secToFrame(B2) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="input" v="$1.50 → $0.75" good />
            <Line k="output" v="$7.50 → $3.75" good />
            <Line k="cache" v="$0.075 → $0.0375" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B4)}>
        <ToolCard name="Gemini 4 Argon" tagline="Standard vs Contributor, per 1M." chip="-50%" at={secToFrame(B3) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="standard in / out" v="$2 / $10" />
            <Line k="contributor" v="$1 / $5" good />
            <Line k="speed" v="same as standard" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="The catch?" tagline="Contributor tier terms." chip="DATA" at={secToFrame(B4) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="prompts used by Google" v="YES" bad />
            <Line k="access" v="invite-only" bad />
            <Line k="price" v="half" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-151/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="WOULD YOU TAKE THE DEAL?" lines={lines} />
      </AbsoluteFill>
      <FadeOut at={secToFrame(36.4)}>
        <CaptionTrack words={WORDS} />
      </FadeOut>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short151;
