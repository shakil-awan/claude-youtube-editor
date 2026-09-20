import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-016 — "Synthesia's free plan gives you 10 minutes. HeyGen gives you 3."
// (replacement/versus format, named products + hard numbers, buffer-slot
// evergreen so it won't age by publish time).
// Beats: HeyGen free specs -> Synthesia free specs -> the catch -> verdict,
// looping back to the held cover.
// =============================================================================
export const compositionConfig = { id: 'Short016', durationInSeconds: 40.0, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(3.982); // "HeyGen's free plan gives you three videos..."
const B2 = secToFrame(15.546); // "Synthesia's free plan gives you twelve hundred credits..."
const B3 = secToFrame(24.149); // "But there's a catch..."
const CTA = secToFrame(29.478); // "So for raw minutes, Synthesia wins..."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean; bad?: boolean }> = ({ k, v, good, bad }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : bad ? COLORS.danger : COLORS.d300, fontWeight: good || bad ? 700 : 400 }}>{v}</span>
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
        <HookTitle hold onDark kicker="FREE PLAN COMPARISON" lines={[{ text: '3X MORE' }, { text: 'FREE VIDEO', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="HeyGen — Free" tagline="3 videos a month, 1 minute each. 3 minutes total." chip="FREE" at={B1 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="video / month" v="3 min" />
            <Line k="custom avatars" v="1" />
            <Line k="languages" v="30+" />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="Synthesia — Free" tagline="1,200 credits a month, about 10 minutes of video." chip="FREE" chipColor={COLORS.accent2} at={B2 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="video / month" v="~10 min" good />
            <Line k="avatars" v="9" />
            <Line k="languages" v="160+" good />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="The catch" tagline="No downloads, and the Synthesia watermark stays." chip="READ THIS" chipColor={COLORS.danger} at={B3 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="downloads" v="blocked" bad />
            <Line k="watermark" v="stays" bad />
          </div>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-016/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="FREE PLAN COMPARISON" lines={[{ text: '3X MORE' }, { text: 'FREE VIDEO', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 40, color: 'rgba(255,255,255,0.82)',
        }}>
          Synthesia wins minutes. HeyGen wins customization.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short016;
