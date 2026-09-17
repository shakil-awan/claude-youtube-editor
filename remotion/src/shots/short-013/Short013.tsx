import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-013 — "Firefox Just Killed The $19 AI Browser Subscription" (news-jack,
// named actors + a hard dollar figure, per learnings.md's best-performing pattern).
// Beats on the real voiceover: what Smart Window is -> the price comparison vs
// Merlin -> where it's rolling out -> close back to the cover for a seamless loop.
// Frame 0 holds the full cover (art + headline, static, captions off).
// =============================================================================
export const compositionConfig = { id: 'Short013', durationInSeconds: 40.6, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(4.319); // "It's called Smart Window, powered by Mistral AI..."
const B2 = secToFrame(24.707); // "Compare that to Merlin..."
const B3 = secToFrame(31.963); // "It's rolling out now in the US, Canada, and France."
const CTA = secToFrame(35.62); // "Free AI, built into your browser..."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Row: React.FC<{ label: string; a: string; b?: string; aWin?: boolean }> = ({ label, a, b, aWin }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400, flex: 1 }}>{label}</span>
    <span style={{ color: aWin ? COLORS.signalAlt : COLORS.d300, fontWeight: aWin ? 700 : 400, width: b ? 190 : 'auto', textAlign: 'right' }}>{a}</span>
    {b !== undefined ? <span style={{ color: COLORS.d300, width: 190, textAlign: 'right' }}>{b}</span> : null}
  </div>
);

const Short013: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      {/* cover / hook — frame 0 is a finished poster: full art + full headline, no motion */}
      <FadeOut at={B1}>
        <CoverImage src="projects/short-013/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="FIREFOX SMART WINDOW" lines={[{ text: 'Free AI browser' }, { text: 'KILLS THE $19', accent: true }]} />
      </FadeOut>

      {/* beat 1 — what Smart Window is: built-in, Mistral-powered, zero retention */}
      <FadeOut at={B2}>
        <ToolCard name="Smart Window" tagline="Built into Firefox — not an extension you install." chip="FREE" at={B1 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Row label="powered by" a="Mistral Small 4" aWin />
            <Row label="data retention" a="zero" aWin />
            <Row label="install" a="built-in" />
          </div>
        </ToolCard>
      </FadeOut>

      {/* beat 2 — the money proof: Firefox $0 vs Merlin $19-29/mo */}
      <FadeOut at={B3}>
        <ToolCard name="Firefox vs Merlin" tagline="Same AI browser copilot. Very different bill." chip="SAVES $19+/MO" chipColor={COLORS.signal} at={B2 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 26, color: COLORS.d400 }}>
              <span style={{ flex: 1 }}>per month</span>
              <span style={{ width: 190, textAlign: 'right', color: COLORS.signalAlt }}>FIREFOX</span>
              <span style={{ width: 190, textAlign: 'right' }}>MERLIN</span>
            </div>
            <Row label="Smart Window" a="$0" b="—" aWin />
            <Row label="Pro tier" a="—" b="$19 - $29" />
          </div>
        </ToolCard>
      </FadeOut>

      {/* beat 3 — where it's live today, honest about the rest */}
      <FadeOut at={CTA}>
        <ToolCard name="Where it's live" tagline="Beta rollout starts now, more regions to come." chip="ROLLING OUT" chipColor={COLORS.accent2} at={B3 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Row label="US · Canada · France" a="live now" aWin />
            <Row label="UK · Germany" a="later in 2026" />
          </div>
        </ToolCard>
      </FadeOut>

      {/* close — back to the cover so the last frame resolves into frame 0 (seamless loop) */}
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-013/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="FIREFOX SMART WINDOW" lines={[{ text: 'Free AI browser' }, { text: 'KILLS THE $19', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          No subscription. No credit card.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} startAt={24} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short013;
