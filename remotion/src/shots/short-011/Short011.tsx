import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-011 — "The cheaper AI model is the one you can't use" (versus).
// Beats on the real voiceover: same input price -> cheaper output -> the gate.
// Frame 0 holds the full cover (art + headline, static, captions off).
// =============================================================================
export const compositionConfig = { id: 'Short011', durationInSeconds: 37.2, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(10.089); // "But look at output"
const B2 = secToFrame(20.643); // "And here is the part nobody mentions"
const CTA = secToFrame(33.297); // "So the cheaper model is also the one you can actually use"

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Row: React.FC<{ label: string; a: string; b: string; aWin?: boolean }> = ({ label, a, b, aWin }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400, flex: 1 }}>{label}</span>
    <span style={{ color: aWin ? COLORS.signalAlt : COLORS.d300, fontWeight: aWin ? 700 : 400, width: 190, textAlign: 'right' }}>{a}</span>
    <span style={{ color: COLORS.d300, width: 190, textAlign: 'right' }}>{b}</span>
  </div>
);

const Short011: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-011/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="OPUS 5 VS GPT-5.6 SOL" lines={[{ text: 'The cheaper one' }, { text: 'IS ALSO BETTER', accent: true }]} />
      </FadeOut>

      {/* beat 1 — the price table */}
      <FadeOut at={B2}>
        <ToolCard name="Output price" tagline="Same $5 input. The gap is on output." chip="17% CHEAPER" at={B1 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 26, color: COLORS.d400 }}>
              <span style={{ flex: 1 }}>per 1M</span>
              <span style={{ width: 190, textAlign: 'right', color: COLORS.signalAlt }}>OPUS 5</span>
              <span style={{ width: 190, textAlign: 'right' }}>SOL</span>
            </div>
            <Row label="input" a="$5.00" b="$5.00" />
            <Row label="output" a="$25.00" b="$30.00" aWin />
          </div>
        </ToolCard>
      </FadeOut>

      {/* beat 2 — the access gate */}
      <FadeOut at={CTA}>
        <ToolCard name="Who can use it" tagline="Sol needs approved access. Opus 5 does not." chip="NO WAITLIST" at={B2 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Row label="Opus 5" a="open to all" b="" aWin />
            <Row label="GPT-5.6 Sol" a="gated" b="" />
          </div>
        </ToolCard>
      </FadeOut>

      {/* close — back to the cover for a seamless loop */}
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-011/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="OPUS 5 VS GPT-5.6 SOL" lines={[{ text: 'The cheaper one' }, { text: 'IS ALSO BETTER', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          And you can actually use it.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short011;
