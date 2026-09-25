import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_DISPLAY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import {
  CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark,
} from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// Short016 — "Grain Caps Free Users At 20 Meetings. This Tool Never Does."
// (versus, evergreen buffer). Beats sync to work/voiceover/words.json frame
// marks below. Proof slots are vendor-page spec rows (grain.com/pricing,
// tldv.io), not text alone — a straight plan-vs-plan comparison IS the proof.
// =============================================================================
export const compositionConfig = { id: 'Short016', durationInSeconds: 39.5, fps: 30, width: 1080, height: 1920 };

const HOOK_OUT = 138;
const B1 = { in: 141, out: 381 }; // Grain
const B2 = { in: 384, out: 696 }; // tldv
const B3 = { in: 699, out: 861 }; // same-job twist
const CTA = 864;
const LOOP = 1041;

const COVER = 'projects/short-016/cover.png';

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const SpecRow: React.FC<{ label: string; value: string; danger?: boolean; good?: boolean }> = ({ label, value, danger, good }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px', borderRadius: 12, background: COLORS.cream, border: `1px solid ${COLORS.line}`,
  }}>
    <div style={{ fontFamily: FONT_MONO, fontSize: 28, color: COLORS.muted }}>{label}</div>
    <div style={{
      fontFamily: FONT_MONO, fontWeight: 700, fontSize: 30,
      color: danger ? COLORS.danger : good ? COLORS.signal : COLORS.ink,
    }}>{value}</div>
  </div>
);

const Short016: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const ctaY = interpolate(frame, [CTA, CTA + 14], [30, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const ctaFadeOut = 1 - interpolate(frame, [LOOP - 12, LOOP], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });

  return (
    <AbsoluteFill>
      <ShortBg />
      {/* opening cover — frame 0 is the feed thumbnail: full art + full headline, no motion */}
      <CoverImage src={COVER} at={0} out={HOOK_OUT} />
      <FadeOut at={HOOK_OUT}>
        <HookTitle hold onDark kicker="FREE AI NOTETAKERS" lines={[{ text: 'Grain Caps You.' }, { text: 'tldv Never Does.', accent: true }]} />
      </FadeOut>

      <FadeOut at={B1.out}>
        <ToolCard name="Grain" tagline="Real AI meeting notes for free — but the free plan runs out." chip="20 CAP" chipColor={COLORS.danger} at={B1.in + 4}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SpecRow label="Free plan limit" value="20 meetings, ever" danger />
            <SpecRow label="Starter (paid)" value="$19/seat/mo" />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B2.out}>
        <ToolCard name="tldv" tagline="Free Forever — unlimited recordings, transcripts, AI summaries." chip="NO CAP" chipColor={COLORS.signal} at={B2.in + 4}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SpecRow label="Free plan limit" value="None — forever" good />
            <SpecRow label="Languages" value="30+" good />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3.out}>
        <ToolCard name="Same Job. Same $0." tagline="One quietly runs out on you." chip="READ FIRST" chipColor={COLORS.accent2} at={B3.in + 4}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SpecRow label="Grain free" value="20 meetings" danger />
            <SpecRow label="tldv free" value="No cap" good />
          </div>
        </ToolCard>
      </FadeOut>

      <div style={{
        position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 320,
        opacity: ctaOp * ctaFadeOut, transform: `translateY(${ctaY}px)`, textAlign: 'center',
        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 84, lineHeight: 1.15, color: COLORS.ink,
      }}>
        Read the <span style={{ color: COLORS.accent }}>plan page</span> before you get attached
      </div>

      {/* loop point — resolves back into the cover layout so the replay is seamless */}
      <CoverImage src={COVER} at={LOOP} />
      <HookTitle at={LOOP} onDark kicker="FREE AI NOTETAKERS" lines={[{ text: 'Grain Caps You.' }, { text: 'tldv Never Does.', accent: true }]} />

      <ProgressBar />
      <Watermark />
      <CaptionTrack words={WORDS} />
    </AbsoluteFill>
  );
};
export default Short016;
