import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-015 — "Stop Paying $10 A Month For AI Code Completions" (replacement
// format). Beats: the cost hook -> what OpenCode is (stat block) -> bring your
// own model (no forced subscription) -> head-to-head price vs GitHub Copilot
// Pro -> close returns to the cover for a seamless loop.
// =============================================================================
export const compositionConfig = { id: 'Short015', durationInSeconds: 36.2, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(5.619); // "It's called OpenCode..."
const B2 = secToFrame(13.967); // "Here's the trick..."
const B3 = secToFrame(28.723); // "Compare that to GitHub Copilot's paid plan..."
const CTA = secToFrame(33.913); // "OpenCode costs zero."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Row: React.FC<{ k: string; v: string; good?: boolean }> = ({ k, v, good }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : COLORS.d300, fontWeight: good ? 700 : 400 }}>{v}</span>
  </div>
);

const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
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
        <HookTitle hold onDark kicker="THE $10/MO ALTERNATIVE" lines={[{ text: 'THIS CODING AGENT' }, { text: 'COSTS $0', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="OpenCode" tagline="Free, open source coding agent — terminal, IDE, or desktop." chip="FREE" at={B1 + 4}>
          <Panel>
            <Row k="GitHub stars" v="208,000" good />
            <Row k="contributors" v="950" good />
            <Row k="monthly developers" v="16,000,000" good />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="Bring your own model" tagline="No forced subscription — ever." chip="YOUR KEY" at={B2 + 4} chipColor={COLORS.accent2}>
          <Panel>
            <Row k="Claude / GPT / Gemini" v="your API key" good />
            <Row k="Copilot / ChatGPT Plus" v="already paying? reuse it" good />
            <Row k="included free models" v="$0" good />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="The price, side by side" tagline="Same job. Very different bill." chip="READ THIS" at={B3 + 4} chipColor={COLORS.danger}>
          <Panel>
            <Row k="OpenCode" v="$0 / mo" good />
            <Row k="GitHub Copilot Pro" v="$10 / mo" />
          </Panel>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-015/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="THE $10/MO ALTERNATIVE" lines={[{ text: 'THIS CODING AGENT' }, { text: 'COSTS $0', accent: true }]} />
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short015;
