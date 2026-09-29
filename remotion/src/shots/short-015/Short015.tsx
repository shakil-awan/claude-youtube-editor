import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

export const compositionConfig = { id: 'Short015', durationInSeconds: 39.6, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(3.95);
const B2 = secToFrame(13.6);
const B3 = secToFrame(22.3);
const CTA = secToFrame(32.97);

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

const Short015: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-015/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="SAME PRICE" lines={[{ text: 'UP TO 30%' }, { text: 'LESS PER JOB', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="Claude Sonnet 5.5" tagline="Price unchanged from Sonnet 5." chip="SEPT 28" at={B1 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="input / 1M" v="$2" good />
            <Line k="output / 1M" v="$10" good />
          </div>
        </ToolCard>
      </FadeOut>
      <FadeOut at={B3}>
        <ToolCard name="What changed" tagline="Faster, and cheaper per task." chip="VS SONNET 5" at={B2 + 4} chipColor={COLORS.accent2}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="speed" v="30%+ faster" good />
            <Line k="cost per task" v="up to 30% less" good />
          </div>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="Also on the page" tagline="Cheap caching, every major cloud." chip="DETAILS" at={B3 + 4} chipColor={COLORS.danger}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="cache reads / 1M" v="$0.20" good />
            <Line k="clouds" v="AWS, Google, Azure" />
            <Line k="Haiku 5.5" v="coming weeks" />
          </div>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-015/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="SAME PRICE" lines={[{ text: 'UP TO 30%' }, { text: 'LESS PER JOB', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Same price. Less per job.
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
export default Short015;
