import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-016 — "Typeform Caps You At 100. This Tool Doesn't." (replacement)
// Typeform's free plan — and its $28/mo Basic tier — both cap responses at
// 100/mo. Tally is unlimited forms + submissions, free forever, no card; the
// only paid thing is removing Tally's own branding ($24/mo).
// Beats: HOOK -> SETUP (Typeform's cap, even paid) -> REVEAL (Tally: none) ->
// TWIST (only paid thing is branding removal) -> loop back to hook.
// =============================================================================
export const compositionConfig = { id: 'Short016', durationInSeconds: 37.176, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(7.477); // "...still caps you at one hundred." (Typeform proof card)
const B2 = secToFrame(11.865); // "Unlimited forms, unlimited submissions..." (Tally proof card)
const B3 = secToFrame(24.857); // "The only thing you are missing is removing..." (branding catch)
const CTA = secToFrame(31.556); // "If a hundred responses a month is holding your business back..."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean }> = ({ k, v, good }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : COLORS.danger, fontWeight: 700 }}>{v}</span>
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
        <HookTitle hold onDark kicker="TYPEFORM CAPS YOU AT" lines={[{ text: '100 RESPONSES' }, { text: 'TALLY DOESN’T', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="Typeform" tagline="Free plan AND the $28/mo Basic tier — same cap." chip="100 / MO CAP" chipColor={COLORS.danger} at={B1 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="Free plan" v="100 responses/mo" />
            <Line k="Basic — $28/mo" v="100 responses/mo" />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="Tally" tagline="Unlimited forms, unlimited submissions. Free forever." chip="UNLIMITED" chipColor={COLORS.signal} at={B2 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="Forms" v="unlimited" good />
            <Line k="Submissions" v="unlimited" good />
            <Line k="Credit card" v="not required" good />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="The only catch" tagline="Logic, uploads, payments, 45+ languages — all free." chip="$24 / MO" chipColor={COLORS.accent2} at={B3 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="Conditional logic, uploads, payments" v="free" good />
            <Line k="Remove Tally branding" v="$24/mo" />
          </div>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-016/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="TYPEFORM CAPS YOU AT" lines={[{ text: '100 RESPONSES' }, { text: 'TALLY DOESN’T', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Stop paying for Typeform. Switch.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short016;
