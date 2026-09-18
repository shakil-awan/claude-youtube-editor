import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS, RADIUS, SHADOW } from '../../brand';
import { FONT_BODY, FONT_DISPLAY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-050 — "Suno Gives 50 Free Credits A Day. Udio Caps You At 3." (versus)
// Beats: HOOK/COVER (both numbers) -> QUIZ (which is cheaper?) -> REVEAL (entry
// tier price table, $8 vs $10) -> TWIST (top tier, same table, $24 vs $30) ->
// LOOP CLOSE (restates the hook numbers, returns to the cover layout). All
// vendor numbers are the ones fact-checked in script/short.md's beats table.
// =============================================================================
export const compositionConfig = { id: 'Short050', durationInSeconds: 40.206, fps: 30, width: 1080, height: 1920 };

const HOOK_OUT = secToFrame(4.85); // before "Which" (4.911s)
const QUIZ_OUT = secToFrame(7.9); // before "Suno's" (8.185s)
const REVEAL_SUNO_AT = secToFrame(8.185); // "Suno's paid plan starts..."
const REVEAL_UDIO_AT = secToFrame(14.571); // "Udio's cheapest paid plan..."
const REVEAL_OUT = secToFrame(18.7); // before "Go to the top tier" (18.797s)
const TWIST_SUNO_AT = secToFrame(21.653); // "Suno's biggest plan..."
const TWIST_UDIO_AT = secToFrame(25.844); // "Udio's biggest plan..."
const TWIST_OUT = secToFrame(33.6); // before "Remember" (33.913s)
const CTA = TWIST_OUT; // loop close: back to the cover

const SUNO = COLORS.signalAlt; // mint-green — matches the cover art's green half
const UDIO = COLORS.accent2; // gold — matches the cover art's gold half

// fade-out wrapper so one beat hands off cleanly to the next
const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// static (no entrance animation) so it is correct on frame 0, under the cover hold
const StatTile: React.FC<{ label: string; value: string; sub: string; color: string }> = ({ label, value, sub, color }) => (
  <div style={{ flex: 1, background: 'rgba(10,16,13,0.55)', border: `2px solid ${color}88`, borderRadius: RADIUS.panel, padding: '26px 20px', textAlign: 'center' }}>
    <div style={{ fontFamily: FONT_MONO, fontSize: 24, letterSpacing: 3, color: 'rgba(255,255,255,0.7)' }}>{label}</div>
    <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 64, color, marginTop: 8, textShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>{value}</div>
    <div style={{ fontFamily: FONT_BODY, fontSize: 26, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{sub}</div>
  </div>
);

// the cover layout — hook AND loop-close share this exact composition so the
// last frame resolves back into frame 0 (seamless replay).
const CoverLayout: React.FC<{ at?: number; hold?: boolean }> = ({ at = 0, hold = true }) => (
  <>
    <CoverImage src="projects/short-050/cover.png" at={at} out={at === 0 ? HOOK_OUT - 10 : undefined} />
    <HookTitle hold={hold} onDark at={at} kicker="FREE PLAN · PER DAY" lines={[{ text: '50 FREE CREDITS', accent: true }, { text: 'UDIO CAPS AT 3' }]} fontSize={84} />
    <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 560, display: 'flex', gap: 24 }}>
      <StatTile label="SUNO / DAY" value="50" sub="free credits" color={SUNO} />
      <StatTile label="UDIO / DAY" value="3" sub="capped songs" color={UDIO} />
    </div>
  </>
);

// one row of the price table — a colored dot pops in at `at`, the exact frame
// the vendor's name is spoken, so the "which one gets highlighted first" reads
// as a direct answer to the narration rather than a guess.
const PriceRow: React.FC<{ label: string; price: string; detail: string; color: string; at: number }> = ({ label, price, detail, color, at }) => {
  const frame = useCurrentFrame();
  // rows are fully legible from the card's entrance onward (never half-faded) — only the
  // accent dot pops in at `at` to mark which vendor the narration is naming right now.
  const pop = interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.overshoot });
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: color, transform: `scale(${pop})`, boxShadow: `0 4px 16px ${color}77`, flexShrink: 0 }} />
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 42, color: COLORS.ink, flex: 1 }}>{label}</div>
        <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 42, color }}>{price}</div>
      </div>
      <div style={{ fontFamily: FONT_BODY, fontSize: 27, color: COLORS.muted, marginLeft: 38, marginTop: 4 }}>{detail}</div>
    </div>
  );
};

// the plain question card — beat 2 (QUIZ): no chip, no proof slot, just the
// question held on screen while the voiceover pauses on it.
const QuizCard: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at, at + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const y = interpolate(frame, [at, at + 16], [40, 0], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <div style={{
      position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 340,
      opacity: op, transform: `translateY(${y}px)`,
      background: COLORS.paper, border: `2px solid ${COLORS.line}`, borderRadius: RADIUS.card,
      boxShadow: SHADOW.card, padding: '56px 46px', textAlign: 'center',
    }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 28, letterSpacing: 5, color: COLORS.muted, marginBottom: 26 }}>THE QUESTION</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 60, lineHeight: 1.28, color: COLORS.ink }}>
        Which one is cheaper once you want to <span style={{ color: COLORS.accent }}>keep</span> what you make?
      </div>
    </div>
  );
};

const Short050: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      {/* HOOK / COVER — both numbers, held as a finished poster on frame 0 */}
      <FadeOut at={HOOK_OUT}>
        <CoverLayout at={0} hold />
      </FadeOut>

      {/* QUIZ — a beat of held silence before the reveal */}
      <FadeOut at={QUIZ_OUT}>
        <QuizCard at={HOOK_OUT + 2} />
      </FadeOut>

      {/* REVEAL — entry-tier price table, Suno highlighted first, Udio second */}
      <FadeOut at={REVEAL_OUT}>
        <ToolCard name="Paid plans" tagline="What it costs once the free tier isn't enough." chip="ENTRY TIER" chipColor={COLORS.accent} at={QUIZ_OUT + 6}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <PriceRow label="Suno" price="$8/mo" detail="2,500 credits · full commercial rights" color={SUNO} at={REVEAL_SUNO_AT} />
            <PriceRow label="Udio" price="$10/mo" detail="2,400 credits" color={UDIO} at={REVEAL_UDIO_AT} />
          </div>
        </ToolCard>
      </FadeOut>

      {/* TWIST — same layout, top-tier numbers: the gap holds */}
      <FadeOut at={TWIST_OUT}>
        <ToolCard name="Top tier" tagline="Go all the way up. The gap holds." chip="TOP TIER" chipColor={COLORS.accent2} at={REVEAL_OUT + 6}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <PriceRow label="Suno" price="$24/mo" detail="10,000 credits" color={SUNO} at={TWIST_SUNO_AT} />
            <PriceRow label="Udio" price="$30/mo" detail="6,000 credits" color={UDIO} at={TWIST_UDIO_AT} />
          </div>
        </ToolCard>
      </FadeOut>

      {/* LOOP CLOSE — back to the exact cover layout; last frame ≈ frame 0 */}
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverLayout at={CTA} hold />
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short050;
