import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CountBadge, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-010 — "OpenAI just cut AI prices 80%" (news-jack).
// Beats anchored to the real Liam voiceover (words.ts). Frame 0 holds the full
// cover: art + complete headline, static, captions off — it is the shelf tile.
// The close returns to the cover layout so the loop is seamless.
// =============================================================================
export const compositionConfig = { id: 'Short010', durationInSeconds: 35.4, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(12.04); // "Here is what eighty percent off actually buys you"
const B2 = secToFrame(22.872); // "Terra dropped too"
const B3 = secToFrame(27.063); // "The flagship, Sol, did not move"
const CTA = secToFrame(30.059); // "So if you are building anything with AI…"

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const PriceRow: React.FC<{ label: string; was: string; now: string; color: string }> = ({ label, was, now, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontFamily: FONT_MONO, fontSize: 34 }}>
    <span style={{ color: COLORS.muted }}>{label}</span>
    <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ color: COLORS.danger, textDecoration: 'line-through' }}>{was}</span>
      <span style={{ color: COLORS.muted }}>→</span>
      <span style={{ color, fontWeight: 700 }}>{now}</span>
    </span>
  </div>
);

const Short010: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      {/* hook — cover held static through frame 24; this frame is the tile */}
      <FadeOut at={B1}>
        <CoverImage src="projects/short-010/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="OPENAI JUST CUT PRICES" lines={[{ text: 'AI got' }, { text: '80% CHEAPER', accent: true }]} />
      </FadeOut>

      {/* beat 1 — what 80% off actually buys */}
      <FadeOut at={B2}>
        <CountBadge n={1} of={3} at={B1} />
        <ToolCard name="GPT-5.6 Luna" tagline="A whole novel processed for twenty cents." chip="80% OFF" at={B1 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <PriceRow label="input  / 1M" was="$1.00" now="$0.20" color={COLORS.signalAlt} />
            <PriceRow label="output / 1M" was="$6.00" now="$1.20" color={COLORS.signalAlt} />
          </div>
        </ToolCard>
      </FadeOut>

      {/* beat 2 — Terra */}
      <FadeOut at={B3}>
        <CountBadge n={2} of={3} at={B2} color={COLORS.accent2} />
        <ToolCard name="GPT-5.6 Terra" tagline="The mid-tier model dropped too." chip="20% OFF" at={B2 + 4} chipColor={COLORS.accent2}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '22px 26px' }}>
            <PriceRow label="input  / 1M" was="$2.50" now="$2.00" color={COLORS.accent2} />
          </div>
        </ToolCard>
      </FadeOut>

      {/* beat 3 — Sol unchanged */}
      <FadeOut at={CTA}>
        <CountBadge n={3} of={3} at={B3} color={COLORS.signal} />
        <ToolCard name="GPT-5.6 Sol" tagline="The flagship did not move at all." chip="NO CHANGE" at={B3 + 4} chipColor={COLORS.muted}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '22px 26px' }}>
            <PriceRow label="input  / 1M" was="$5.00" now="$5.00" color={COLORS.muted} />
          </div>
        </ToolCard>
      </FadeOut>

      {/* close — resolves back into the cover layout so the loop is seamless */}
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-010/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="MOVE YOUR CHEAP TASKS" lines={[{ text: 'AI got' }, { text: '80% CHEAPER', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Switch to Luna today.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short010;
