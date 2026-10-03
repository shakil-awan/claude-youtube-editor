import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-014 — DeepSeek off-peak half price (evergreen).
// Beats: peak price -> off-peak price -> peak hours timeline -> loop to cover.
// =============================================================================
export const compositionConfig = { id: 'Short014', durationInSeconds: 32.7, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(3.8); // "Its flash model costs…"
const B2 = secToFrame(10.6); // "Off peak, that drops…"
const B3 = secToFrame(14.9); // "Peak is just seven hours…"
const CTA = secToFrame(26.5); // "Same model, half the bill"

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
);
const Line: React.FC<{ k: string; v: string; good?: boolean; bad?: boolean }> = ({ k, v, good, bad }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : bad ? COLORS.danger : COLORS.d300, fontWeight: good || bad ? 700 : 400 }}>{v}</span>
  </div>
);

// 24h UTC bar; peak windows 01-04 and 06-10 highlighted
const Timeline: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [at, at + 30], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const seg = (a: number, b: number) => (
    <div style={{ position: 'absolute', left: `${(a / 24) * 100}%`, width: `${((b - a) / 24) * 100 * reveal}%`, top: 0, bottom: 0, background: COLORS.danger, borderRadius: 6 }} />
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ position: 'relative', height: 56, background: COLORS.signalAlt, borderRadius: 8, opacity: 0.85 }}>
        {seg(1, 4)}{seg(6, 10)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 26, color: COLORS.d400 }}>
        <span>00</span><span>06</span><span>12</span><span>18</span><span>24 UTC</span>
      </div>
      <div style={{ display: 'flex', gap: 28, fontFamily: FONT_MONO, fontSize: 28, color: COLORS.d300 }}>
        <span><span style={{ color: COLORS.danger }}>■</span> peak (full price)</span>
        <span><span style={{ color: COLORS.signalAlt }}>■</span> half price</span>
      </div>
    </div>
  );
};

const Short014: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const HOOK = [{ text: 'HALF PRICE AI' }, { text: 'AFTER DARK', accent: true }] as const;

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-014/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="DEEPSEEK API" lines={HOOK} fontSize={108} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="Peak price" tagline="DeepSeek flash, per million tokens." chip="FULL PRICE" chipColor={COLORS.danger} at={B1 + 4}>
          <Panel>
            <Line k="input" v="$0.30" bad />
            <Line k="output" v="$1.20" bad />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="Off-peak price" tagline="Exactly half. Same model." chip="HALF OFF" at={B2 + 4}>
          <Panel>
            <Line k="input" v="$0.15" good />
            <Line k="output" v="$0.60" good />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="Peak hours" tagline="Weekdays only. Nights and weekends are half off." chip="7 H / DAY" chipColor={COLORS.accent2} at={B3 + 4}>
          <Panel>
            <Timeline at={B3 + 12} />
          </Panel>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-014/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="DEEPSEEK API" lines={HOOK} fontSize={108} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 560, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Schedule it. Pay half.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short014;
