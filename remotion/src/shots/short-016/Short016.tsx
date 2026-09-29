import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

export const compositionConfig = { id: 'Short016', durationInSeconds: 39.0, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(4.7);
const B2 = secToFrame(15.5);
const B3 = secToFrame(27.0);
const CTA = secToFrame(32.2);

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

const Short016: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-016/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="STOP PAYING" lines={[{ text: '$15 A MONTH' }, { text: 'TO TALK', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="Wispr Flow" tagline="Free plan. No credit card." chip="FREE" at={B1 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="desktop / week" v="2,000 words" good />
            <Line k="Pro" v="$15/mo ($12 yearly)" />
          </div>
        </ToolCard>
      </FadeOut>
      <FadeOut at={B3}>
        <ToolCard name="Willow" tagline="Free plan. No card. Same $15 Pro." chip="FREE" at={B2 + 4} chipColor={COLORS.accent2}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="works in" v="Gmail, Slack, Notion" />
            <Line k="Pro" v="$15/mo ($12 yearly)" />
          </div>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="The catch" tagline="Free Willow caps its writing assistant." chip="READ THIS" at={B3 + 4} chipColor={COLORS.danger}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="Scribe / week" v="20 uses" />
          </div>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-016/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="STOP PAYING" lines={[{ text: '$15 A MONTH' }, { text: 'TO TALK', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Start free. Pay at the wall.
        </div>
      </AbsoluteFill>

      <Sequence durationInFrames={Math.round(compositionConfig.durationInSeconds * 30) - 40}>
        <CaptionTrack words={WORDS} />
      </Sequence>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short016;
