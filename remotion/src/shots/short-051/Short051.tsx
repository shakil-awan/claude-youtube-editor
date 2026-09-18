import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-051 — "Stop Paying $49.50/Mo For AI Customer Replies" (replacement:
// Intercom Fin's $0.99/outcome, 50-outcome floor vs Chatbase's free tier).
// Structure: HOOK (the $49.50 floor) -> SETUP (Fin's per-outcome meter) ->
// QUIZ (guess the free price) -> REVEAL (Chatbase's free-plan stat tile) ->
// TWIST (Fin's own 14-day unlimited trial) -> CLOSE (loops back to the cover).
// Beat boundaries are the real words.json start times for each line's first word.
// =============================================================================
export const compositionConfig = { id: 'Short051', durationInSeconds: 41.77, fps: 30, width: 1080, height: 1920 };

// "That's Intercom's Fin agent..." — cover/hook fades, Fin setup card enters
const HOOK_OUT = secToFrame(5.155); // 155
// "Guess what a free alternative costs." — Fin card fades, quiz card enters
const B2 = secToFrame(12.225); // 367
// "Chatbase's free plan is zero dollars..." — quiz fades, Chatbase reveal enters
const B3 = secToFrame(15.163); // 455
// "Even Fin gives you a free fourteen day trial..." — reveal fades, twist enters
const B4 = secToFrame(29.687); // 891
// "So test drive the expensive one..." — twist fades, loop-close cover returns
const CTA = secToFrame(35.341); // 1060

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// k/v proof row — the receipt-meter and stat-tile slots share this shape.
const Line: React.FC<{ k: string; v: string; good?: boolean; bad?: boolean }> = ({ k, v, good, bad }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : bad ? COLORS.danger : COLORS.d300, fontWeight: good || bad ? 700 : 400 }}>{v}</span>
  </div>
);

const ProofBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
    {children}
  </div>
);

// QUIZ beat — a plain held question card with its OWN entrance + exit gating (unlike
// ToolCard, a bare div has no built-in "at" fade-in, so it must be computed here or it
// bleeds into every earlier frame, including frame 0's cover poster).
const QuizCard: React.FC<{ at: number; out: number; children: React.ReactNode }> = ({ at, out, children }) => {
  const frame = useCurrentFrame();
  const opIn = interpolate(frame, [at, at + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const opOut = 1 - interpolate(frame, [out - 8, out + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  const y = interpolate(frame, [at, at + 16], [30, 0], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <div style={{
      position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 360,
      textAlign: 'center', fontFamily: FONT_BODY, fontWeight: 700, fontSize: 68, lineHeight: 1.15, color: COLORS.ink,
      opacity: Math.min(opIn, opOut), transform: `translateY(${y}px)`,
    }}>
      {children}
    </div>
  );
};

const Short051: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      {/* HOOK — frame 0 is the shelf/feed thumbnail: cover art + a fully-held payoff
          headline, no entrance animation, no burned-in caption over the poster. */}
      <FadeOut at={HOOK_OUT}>
        <CoverImage src="projects/short-051/cover.png" out={HOOK_OUT} />
        <HookTitle hold onDark kicker="INTERCOM'S FIN AI AGENT" lines={[{ text: '$49.50 / MO' }, { text: 'JUST TO REPLY', accent: true }]} />
      </FadeOut>

      {/* SETUP — Fin's real per-outcome pricing, ticking to the floor */}
      <FadeOut at={B2}>
        <ToolCard name="Fin (Intercom)" tagline="$0.99 per resolved chat. 50-outcome monthly minimum." chip="$49.50/MO FLOOR" chipColor={COLORS.danger} at={HOOK_OUT + 4}>
          <ProofBox>
            <Line k="per outcome" v="$0.99" />
            <Line k="minimum outcomes" v="50" />
            <Line k="= monthly floor" v="$49.50" bad />
          </ProofBox>
        </ToolCard>
      </FadeOut>

      {/* QUIZ — plain question card, held pause (retention grammar). Gated on BOTH ends:
          it must not bleed into the HOOK/SETUP frames before B2, nor linger into REVEAL. */}
      <QuizCard at={B2} out={B3}>
        Guess what a <span style={{ color: COLORS.accent }}>free</span> alternative costs.
      </QuizCard>

      {/* REVEAL — Chatbase's real free-plan numbers */}
      <FadeOut at={B4}>
        <ToolCard name="Chatbase" tagline="Free plan does the same core job for a small shop's volume." chip="$0/MO" chipColor={COLORS.signal} at={B3 + 4}>
          <ProofBox>
            <Line k="cost" v="$0/mo" good />
            <Line k="message credits" v="50/mo" />
            <Line k="AI agents" v="1" />
          </ProofBox>
        </ToolCard>
      </FadeOut>

      {/* TWIST — Fin's own trial is free and unlimited for 14 days */}
      <FadeOut at={CTA}>
        <ToolCard name="Fin's own trial" tagline="Test drive it free before the meter ever starts." chip="14-DAY TRIAL" chipColor={COLORS.accent2} at={B4 + 4}>
          <ProofBox>
            <Line k="trial length" v="14 days" />
            <Line k="resolutions" v="unlimited" good />
          </ProofBox>
        </ToolCard>
      </FadeOut>

      {/* CLOSE — loops back to the cover layout so the replay is seamless */}
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-051/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="INTERCOM'S FIN AI AGENT" lines={[{ text: '$49.50 / MO' }, { text: 'JUST TO REPLY', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Or $0/mo on Chatbase. Your call.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} startAt={24} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short051;
