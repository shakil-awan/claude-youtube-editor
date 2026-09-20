import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-015 — "OpenAI's cheapest AI price ever expires in 62 days" (news-jack:
// GPT-5.6 Sol API price cut with a hard expiry date, per learnings.md's
// named-product + hard-number hook pattern).
// Beats: setup+quiz (GPT-5.6 Sol) -> reveal (the numbers) -> scope (what it
// covers) -> twist (the Nov 21 rollback), looping back to the held cover.
// =============================================================================
export const compositionConfig = { id: 'Short015', durationInSeconds: 47.4, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(4.331); // "GPT five point six Sol just got a price cut..."
const B2 = secToFrame(12.55); // "Input tokens dropped twenty percent..."
const B3 = secToFrame(22.477); // "That covers the API, Codex credits..."
const CTA = secToFrame(31.417); // "Here's the twist..."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean }> = ({ k, v, good }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : COLORS.d300, fontWeight: good ? 700 : 400 }}>{v}</span>
  </div>
);

const GuessChip: React.FC<{ v: string; active?: boolean }> = ({ v, active }) => (
  <div style={{
    fontFamily: FONT_MONO, fontSize: 30, fontWeight: 700, padding: '10px 22px', borderRadius: 999,
    background: active ? COLORS.accent : COLORS.d900, color: active ? COLORS.paper : COLORS.d300,
    border: `2px solid ${active ? COLORS.accent : COLORS.line}`,
  }}>{v}</div>
);

const Short015: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-015/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="EXPIRES IN 62 DAYS" lines={[{ text: 'CHEAPEST AI' }, { text: 'PRICE EVER', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="GPT-5.6 Sol" tagline="OpenAI's flagship API model just got cheaper. Guess how much." chip="PRICE CUT" at={B1 + 4}>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <GuessChip v="10%" />
            <GuessChip v="20%" active />
            <GuessChip v="33%" active />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="The reveal" tagline="Real numbers, straight from OpenAI." chip="REVEAL" chipColor={COLORS.accent2} at={B2 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="input / 1M tok" v="$5 -> $4" good />
            <Line k="output / 1M tok" v="$30 -> $20" good />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="What it covers" tagline="API, Codex credits, and ChatGPT Work only." chip="SCOPE" chipColor={COLORS.signal} at={B3 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="API / Codex / Work" v="new price" good />
            <Line k="Plus / Pro / Business" v="unchanged" />
          </div>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-015/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="EXPIRES IN 62 DAYS" lines={[{ text: 'CHEAPEST AI' }, { text: 'PRICE EVER', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 40, color: 'rgba(255,255,255,0.82)',
        }}>
          Rolls back Nov 21, 2026 — lock it in now.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short015;
