import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, SAFE, ShortBg, ToolCard, Watermark, ProgressBar, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-015 — "Opus Clip vs Descript: Both Give 60 Free Minutes" (versus format).
// Both tools cap the free plan at 60 min/month — the catch differs: Opus Clip
// is 1080p + watermark + local-upload-only; Descript is 720p + watermark + 5GB
// storage. Beats: HOOK (same number) -> Opus Clip's own free-tier row ->
// Descript's own free-tier row -> side-by-side verdict -> loop back to cover.
// =============================================================================
export const compositionConfig = { id: 'Short015', durationInSeconds: 36.889, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(8.766); // "Opus Clip renders up to full HD…"
const B2 = secToFrame(19.481); // "Descript caps your export at seven twenty p…"
const B3 = secToFrame(26.773); // "Pick Opus Clip if resolution matters more."
const CTA = secToFrame(33.623); // "Same sixty minutes, very different trade-off."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean; bad?: boolean }> = ({ k, v, good, bad }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 30, gap: 12 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : bad ? COLORS.danger : COLORS.d300, fontWeight: good || bad ? 700 : 400, textAlign: 'right' }}>{v}</span>
  </div>
);

// One tool's own free-tier column, read straight off its pricing page.
const Column: React.FC<{ title: string; accentColor: string; children: React.ReactNode }> = ({ title, accentColor, children }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{
      fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, letterSpacing: 1, color: accentColor,
      borderBottom: `2px solid ${accentColor}55`, paddingBottom: 10, marginBottom: 2,
    }}>
      {title}
    </div>
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
        <HookTitle hold onDark kicker="BOTH GIVE 60 FREE MIN/MO" lines={[{ text: 'SAME NUMBER' }, { text: 'DIFFERENT CATCH', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="Opus Clip" tagline="Full HD exports — but every one is watermarked." chip="FREE" chipColor={COLORS.signal} at={B1 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="export" v="up to 1080p" good />
            <Line k="watermark" v="yes" bad />
            <Line k="upload" v="local files only" bad />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="Descript" tagline="720p exports, watermarked — but 5GB of storage free." chip="FREE" chipColor={COLORS.accent2} at={B2 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="export" v="720p cap" bad />
            <Line k="watermark" v="yes" bad />
            <Line k="storage" v="5GB free" good />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="The verdict" tagline="Same 60 minutes a month. Different trade-off." chip="PICK ONE" chipColor={COLORS.danger} at={B3 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '26px 26px', display: 'flex', gap: 28 }}>
            <Column title="OPUS CLIP" accentColor={COLORS.signal}>
              <Line k="export" v="1080p" good />
              <Line k="watermark" v="yes" bad />
              <Line k="storage" v="—" />
            </Column>
            <Column title="DESCRIPT" accentColor={COLORS.accent2}>
              <Line k="export" v="720p" bad />
              <Line k="watermark" v="yes" bad />
              <Line k="storage" v="5GB" good />
            </Column>
          </div>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-015/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="BOTH GIVE 60 FREE MIN/MO" lines={[{ text: 'SAME NUMBER' }, { text: 'DIFFERENT CATCH', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 40, color: 'rgba(255,255,255,0.82)',
        }}>
          Resolution or storage. Pick your catch.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short015;
