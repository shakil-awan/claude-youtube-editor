import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import {
  CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark,
} from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// Short015 — "Notion Just Put Its AI Behind The $20 Plan" (news-jack).
// Beats sync to work/voiceover/words.json via the frame marks below (computed
// from the word start times, not eyeballed). Proof slots are price/spec tables
// built from vendor-page facts checked in script/short.md — no screencast
// needed for a pricing-page story, a clean price table IS the proof.
// =============================================================================
export const compositionConfig = { id: 'Short015', durationInSeconds: 34.9, fps: 30, width: 1080, height: 1920 };

const HOOK_OUT = 105;
const B1 = { in: 108, out: 375 };
const B2 = { in: 378, out: 648 };
const B3 = { in: 657, out: 921 };
const CTA = 930;

const COVER = 'projects/short-015/cover.png';

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// A price row for the plan-comparison proof slot — the "not text alone" evidence.
const PriceRow: React.FC<{ plan: string; price: string; aiIncluded: boolean; highlight?: boolean }> = ({ plan, price, aiIncluded, highlight }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 22px', borderRadius: 12,
    background: highlight ? COLORS.d900 : COLORS.cream,
    border: highlight ? `2px solid ${COLORS.signal}` : `1px solid ${COLORS.line}`,
  }}>
    <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 32, color: highlight ? COLORS.d300 : COLORS.ink }}>{plan}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{
        fontFamily: FONT_MONO, fontSize: 24, fontWeight: 700,
        color: aiIncluded ? COLORS.signalAlt : COLORS.danger,
      }}>
        {aiIncluded ? 'AI ✓' : 'AI trial only'}
      </div>
      <div style={{
        fontFamily: FONT_MONO, fontWeight: 700, fontSize: 34,
        color: highlight ? COLORS.signalAlt : COLORS.ink,
      }}>{price}</div>
    </div>
  </div>
);

const SpecRow: React.FC<{ label: string; value: string; danger?: boolean }> = ({ label, value, danger }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', borderRadius: 12, background: COLORS.cream, border: `1px solid ${COLORS.line}`,
  }}>
    <div style={{ fontFamily: FONT_MONO, fontSize: 28, color: COLORS.muted }}>{label}</div>
    <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 30, color: danger ? COLORS.danger : COLORS.ink }}>{value}</div>
  </div>
);

const Short015: React.FC = () => {
  return (
    <AbsoluteFill>
      <ShortBg />
      {/* opening cover — frame 0 is the feed thumbnail: full art + full headline, no motion */}
      <CoverImage src={COVER} at={0} out={HOOK_OUT} />
      <FadeOut at={HOOK_OUT}>
        <HookTitle hold onDark kicker="NOTION AI" lines={[{ text: 'Locked Behind' }, { text: 'the $20 Plan', accent: true }]} />
      </FadeOut>

      <FadeOut at={B1.out}>
        <ToolCard name="Notion Pricing" tagline="Full Notion AI now ships with one plan only." chip="TODAY" chipColor={COLORS.accent2} at={B1.in + 4}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <PriceRow plan="Free" price="$0" aiIncluded={false} />
            <PriceRow plan="Plus" price="$10/mo" aiIncluded={false} />
            <PriceRow plan="Business" price="$20/mo" aiIncluded highlight />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B2.out}>
        <ToolCard name="Free & Plus" tagline="A limited trial of Notion AI, then a hard wall." chip="LIMITED" chipColor={COLORS.danger} at={B2.in + 4}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SpecRow label="Complimentary AI replies" value="Trial only" />
            <SpecRow label="After the trial runs out" value="Upgrade wall" danger />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3.out}>
        <ToolCard name="The Real Cost" tagline="What Notion now wants for the AI half of the product." chip="$20/mo" chipColor={COLORS.signal} at={B3.in + 4}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SpecRow label="Free / Plus workspace" value="No ongoing AI" danger />
            <SpecRow label="Business workspace" value="Full AI, $20/mo" />
          </div>
        </ToolCard>
      </FadeOut>

      {/* loop point — resolves back into the cover layout so the replay is seamless */}
      <CoverImage src={COVER} at={CTA} />
      <HookTitle at={CTA} onDark kicker="NOTION AI" lines={[{ text: 'Locked Behind' }, { text: 'the $20 Plan', accent: true }]} />

      <ProgressBar />
      <Watermark />
      <CaptionTrack words={WORDS} />
    </AbsoluteFill>
  );
};
export default Short015;
