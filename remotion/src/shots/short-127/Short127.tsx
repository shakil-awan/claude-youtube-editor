import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

export const compositionConfig = { id: 'Short127', durationInSeconds: 38.4, fps: 30, width: 1080, height: 1920 };
const T = [secToFrame(2.7), secToFrame(9.0), secToFrame(14.6), secToFrame(18.0), secToFrame(27.4)];
const CTA = secToFrame(31.2);

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};
const Line: React.FC<{ k: string; v: string; good?: boolean; bad?: boolean }> = ({ k, v, good, bad }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: bad ? COLORS.danger : good ? COLORS.signalAlt : COLORS.d300, fontWeight: good || bad ? 700 : 400 }}>{v}</span>
  </div>
);
const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
);

const Short127: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'FLASH-LITE OUT' }, { text: '40¢ TO $2.50', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={T[0]}>
        <CoverImage src="projects/short-127/cover.png" out={T[0] - 10} />
        <HookTitle hold onDark kicker="GEMINI PRICING" lines={lines} />
      </FadeOut>
      <FadeOut at={T[1]}>
        <ToolCard name="Flash-Lite 2.5" tagline="Google, older." chip="$0.10 / $0.40" at={T[0] - 2}>
          <Panel><Line k="input /1M" v="$0.10" /><Line k="output /1M" v="$0.40" good /></Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={T[2]}>
        <ToolCard name="Flash-Lite 3.5" tagline="Google, newer." chip="$0.30 / $2.50" at={T[1] - 2}>
          <Panel><Line k="input /1M" v="$0.30" /><Line k="output /1M" v="$2.50" bad /></Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={T[3]}>
        <ToolCard name="6x on output" tagline="Same family." chip="6X" at={T[2] - 2} chipColor={COLORS.accent2}>
          <Panel><Line k="2.5 output" v="$0.40" good /><Line k="3.5 output" v="$2.50" bad /></Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={T[4]}>
        <ToolCard name="Claude Haiku 5.5" tagline="Prompts under 100K." chip="$0.10 / $0.50" at={T[3] - 2}>
          <Panel><Line k="input /1M" v="$0.10" /><Line k="output /1M" v="$0.50" good /></Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="5x cheaper" tagline="On output." chip="5X" at={T[4] - 2} chipColor={COLORS.accent2}>
          <Panel><Line k="Flash-Lite 3.5" v="$2.50" bad /><Line k="Haiku 5.5" v="$0.50" good /></Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-127/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="GEMINI PRICING" lines={lines} />
        <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center', fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)' }}>
          Cheap is just a version number.
        </div>
      </AbsoluteFill>
      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short127;
