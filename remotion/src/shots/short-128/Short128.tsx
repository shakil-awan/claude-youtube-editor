import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

export const compositionConfig = { id: 'Short128', durationInSeconds: 36.4, fps: 30, width: 1080, height: 1920 };
const T = [secToFrame(3.9), secToFrame(13.6), secToFrame(15.4), secToFrame(19.6), secToFrame(21.9), secToFrame(26.9)];
const CTA = secToFrame(31.4);

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

const Short128: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'IMAGE AI OUTPUT' }, { text: 'SAME $30', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={T[0]}>
        <CoverImage src="projects/short-128/cover.png" out={T[0] - 10} />
        <HookTitle hold onDark kicker="OPENAI VS GOOGLE" lines={lines} />
      </FadeOut>
      <FadeOut at={T[1]}>
        <ToolCard name="Output price" tagline="Per 1M image tokens." chip="$30" at={T[0] - 2} chipColor={COLORS.accent2}>
          <Panel><Line k="gpt-image-2.5" v="$30.00" /><Line k="Nano Banana 2.1" v="$30.00" /></Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={T[2]}>
        <ToolCard name="Check the input" tagline="Where it splits." chip="INPUT" at={T[1] - 2} chipColor={COLORS.accent2}>
          <Panel><Line k="gpt-image-2.5" v="?" /><Line k="Nano Banana 2.1" v="?" /></Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={T[3]}>
        <ToolCard name="Nano Banana 2.1" tagline="Google. Input per 1M." chip="$1.50" at={T[2] - 2}>
          <Panel><Line k="input /1M" v="$1.50" good /><Line k="image out /1M" v="$30.00" /></Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={T[4]}>
        <ToolCard name="gpt-image-2.5" tagline="OpenAI. Input per 1M." chip="$8.00" at={T[3] - 2} chipColor={COLORS.danger}>
          <Panel><Line k="input /1M" v="$8.00" bad /><Line k="image out /1M" v="$30.00" /></Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={T[5]}>
        <ToolCard name="5x more" tagline="On input." chip="5X" at={T[4] - 2} chipColor={COLORS.accent2}>
          <Panel><Line k="Nano Banana 2.1" v="$1.50" good /><Line k="gpt-image-2.5" v="$8.00" bad /></Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="One K image" tagline="Nano Banana 2.1." chip="3.36¢" at={T[5] - 2}>
          <Panel><Line k="1K image" v="$0.0336" good /></Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-128/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="OPENAI VS GOOGLE" lines={lines} />
        <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center', fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)' }}>
          Same $30 sticker. 5x on input.
        </div>
      </AbsoluteFill>
      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short128;
