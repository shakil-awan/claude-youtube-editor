import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

export const compositionConfig = { id: 'Short128', durationInSeconds: 41.4, fps: 30, width: 1080, height: 1920 };

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

const Short128: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(38.9);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'LONG PROMPTS' }, { text: '2X ELSEWHERE', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(3.9)}>
        <CoverImage src="projects/short-128/cover.png" out={secToFrame(3.9) - 10} />
        <HookTitle hold onDark kicker="1M CONTEXT" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(10.5)}>
        <ToolCard name="Claude Sonnet 5.5" tagline="Input per 1M tokens." chip="FLAT" at={secToFrame(3.9) - 2}>
          <Panel>
            <Line k="9K prompt" v="$2.00" good />
            <Line k="900K prompt" v="$2.00" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(18.3)}>
        <ToolCard name="GPT-6.1 Sol" tagline="Input per 1M tokens." chip="2X" at={secToFrame(10.5) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="up to 272K" v="$2.00" />
            <Line k="over 272K" v="$4.00" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(26.5)}>
        <ToolCard name="Gemini 3.1 Pro Preview" tagline="Input per 1M tokens." chip="2X" at={secToFrame(18.3) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="up to 200K" v="$2.00" />
            <Line k="over 200K" v="$4.00" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(29.4)}>
        <ToolCard name="Long prompts" tagline="Where bills explode." chip="$$$" at={secToFrame(26.5) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="Sol >272K" v="$4.00" bad />
            <Line k="Gemini >200K" v="$4.00" bad />
            <Line k="Sonnet 5.5" v="$2.00" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(33.9)}>
        <ToolCard name="Sonnet 5.5" tagline="Flat across 1M." chip="$2" at={secToFrame(29.4) - 2}>
          <Panel>
            <Line k="input /1M" v="$2.00" good />
            <Line k="output /1M" v="$10.00" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="The exception" tagline="Haiku 5.5." chip="100K" at={secToFrame(33.9) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="up to 100K" v="$0.10" />
            <Line k="over 100K" v="$0.50" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-128/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="1M CONTEXT" lines={lines} />
        <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center', fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)' }}>
          Sonnet keeps long context flat.
        </div>
      </AbsoluteFill>
      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short128;
