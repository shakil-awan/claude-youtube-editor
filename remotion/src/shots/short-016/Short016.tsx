import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-016 — ElevenLabs free plan can't be used commercially; $6 Starter can (evergreen).
// Frame 0 holds the full cover (art + headline, static, captions off).
// =============================================================================
export const compositionConfig = { id: 'Short016', durationInSeconds: 39.7, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(3.738); // "Here is the catch"
const B2 = secToFrame(19.482); // "The fix costs six dollars"
const CTA = secToFrame(33.507); // "ElevenLabs free voices can't make you money"

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Row: React.FC<{ label: string; value: string; good?: boolean }> = ({ label, value, good }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400, flex: 1 }}>{label}</span>
    <span style={{ color: good ? COLORS.signalAlt : COLORS.d300, fontWeight: good ? 700 : 400, textAlign: 'right' }}>{value}</span>
  </div>
);

const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
);

const HOOK_LINES = [{ text: 'FREE VOICES' }, { text: "CAN'T EARN", accent: true }];

const Short016: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-016/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="ELEVENLABS" lines={HOOK_LINES} />
      </FadeOut>

      {/* beat 1 — the free plan */}
      <FadeOut at={B2}>
        <ToolCard name="Free plan" tagline="Great for testing. Not for monetizing." chip="NO COMMERCIAL USE" at={B1 + 4}>
          <Panel>
            <Row label="credits / month" value="10k" />
            <Row label="text to speech" value="yes" />
            <Row label="commercial use" value="NOT ALLOWED" />
          </Panel>
        </ToolCard>
      </FadeOut>

      {/* beat 2 — Starter */}
      <FadeOut at={CTA}>
        <ToolCard name="Starter" tagline="Six dollars unlocks the license." chip="$6 / MONTH" at={B2 + 4}>
          <Panel>
            <Row label="credits / month" value="30k" good />
            <Row label="commercial license" value="included" good />
            <Row label="voice cloning" value="instant" good />
          </Panel>
        </ToolCard>
      </FadeOut>

      {/* close — back to the cover for a seamless loop */}
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-016/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="ELEVENLABS" lines={HOOK_LINES} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Six dollars can.
        </div>
      </AbsoluteFill>

      {frame < secToFrame(WORDS[WORDS.length - 1].end_s) && <CaptionTrack words={WORDS} />}
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short016;
