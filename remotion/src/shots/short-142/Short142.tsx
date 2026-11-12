import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-142: gemini-2.5-flash auto-routes to gemini-3.5-flash-lite on Dec 1, 2026.
// Text $0.30/$2.50 unchanged, audio input $1.00 -> $0.30, Search grounding 1,500/day -> 5,000/month
// (aistudio.google.com/docs/pricing, 2026-11-12). Cover held at frame 0; loops back to it.
export const compositionConfig = { id: 'Short142', durationInSeconds: 41.7, fps: 30, width: 1080, height: 1920 };

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

const B1 = 7.9; // "Every request to 2.5 Flash"
const B2 = 14.0; // "Text stays the same"
const B3 = 20.2; // "But audio input drops"
const B4 = 24.4; // "So where's the catch?"
const B5 = 26.4; // "Google Search grounding"
const END = 37.4; // hook restated

const Short142: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(END);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: '2.5 FLASH SWAPS DEC 1' }, { text: 'AUDIO −70%', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(B1)}>
        <CoverImage src="projects/short-142/cover.png" out={secToFrame(B1) - 10} />
        <HookTitle hold onDark kicker="GOOGLE GEMINI API" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(B2)}>
        <ToolCard name="Auto-reroute" tagline="No code change. New model." chip="DEC 1" at={secToFrame(B1) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="your call" v="gemini-2.5-flash" />
            <Line k="served by" v="gemini-3.5-flash-lite" good />
            <Line k="billed at" v="Flash-Lite rates" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B3)}>
        <ToolCard name="Text: same price" tagline="Per 1M tokens." chip="$0.30/$2.50" at={secToFrame(B2) - 2}>
          <Panel>
            <Line k="input  2.5 → 3.5" v="$0.30 → $0.30" />
            <Line k="output 2.5 → 3.5" v="$2.50 → $2.50" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B4)}>
        <ToolCard name="Audio: −70%" tagline="Audio input per 1M tokens." chip="$1 → 30¢" at={secToFrame(B3) - 2}>
          <Panel>
            <Line k="2.5 Flash audio in" v="$1.00" bad />
            <Line k="3.5 Flash-Lite audio in" v="$0.30" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B5)}>
        <ToolCard name="The catch?" tagline="One line in the pricing table." chip="?" at={secToFrame(B4) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="text" v="same" />
            <Line k="audio" v="−70%" good />
            <Line k="search" v="???" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="Search grounding" tagline="Free searches shrink." chip="$14/1K" at={secToFrame(B5) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="2.5 Flash free" v="1,500 / day" good />
            <Line k="Flash-Lite free" v="5,000 / month" bad />
            <Line k="then, per 1,000" v="$35 → $14" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-142/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="GOOGLE GEMINI API" lines={lines} />
      </AbsoluteFill>
      {/* captions clear after the last word so the final frame is the clean cover (loop point) */}
      <FadeOut at={secToFrame(41.3)}>
        <CaptionTrack words={WORDS} />
      </FadeOut>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short142;
