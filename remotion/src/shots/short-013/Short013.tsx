import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS, RADIUS } from '../../brand';
import { FONT_DISPLAY, FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, SHORT, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// Short013 — "Zapier Charges $30 After 100 Free Tasks — This Tool Doesn't"
// n8n vs Zapier (videos/short-013/script/short.md). HOOK -> SETUP -> QUIZ ->
// REVEAL -> TWIST -> CTA, word-synced to the ElevenLabs voiceover (words.ts).
// Frame 0 is a finished poster (cover art + held headline) and the CTA beat
// resolves back into that same cover layout so the loop is seamless.
// =============================================================================
const COVER_SRC = 'projects/short-013/cover.png';

// ---- beat EXIT points, derived from words.ts (voiceover master clock). Each beat's own
// entrance ('at' passed to its content below) starts exactly AT the previous beat's exit
// point, so the outgoing FadeOut and the incoming entrance crossfade with no blank frame
// between them — FadeOut only fades things OUT, it does not hide content before it starts.
const HOOK_IN = 0;
const HOOK_OUT = secToFrame(7.53); // just before "Here's" (7.86s) — fade the cover out
const SETUP_OUT = secToFrame(16.6); // after "...seven hundred fifty tasks." (16.277s)
const QUIZ_OUT = secToFrame(20.6); // after "...and cost nothing?" (20.027s)
const REVEAL_OUT = secToFrame(32.6); // after "...forever, for free." (32.172s)
const TWIST_OUT = secToFrame(38.0); // after "...gives away for free." (37.791s)
// last word end (41.61s -> frame 1248) + 0.5s tail (15 frames) = 1263 frames = 42.1s.
// NOTE: gen-registry.mjs parses this literally via regex (not evaluated JS), so
// durationInSeconds must stay a numeric literal in sync with that math.
export const compositionConfig = { id: 'Short013', durationInSeconds: 42.1, fps: 30, width: 1080, height: 1920 };

// fade-out wrapper so one beat hands off cleanly to the next
const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// =============================================================================
// PriceTile — the recurring split-screen proof: Zapier's metered price vs
// n8n's flat $0. Appears in the HOOK (as part of the cover poster) and again,
// pulsing, in the TWIST beat that restates the comparison before the loop.
// =============================================================================
const PriceTile: React.FC<{ pulse?: boolean; at?: number; dark?: boolean; hold?: boolean }> = ({ pulse = false, at = 0, dark = false, hold = false }) => {
  const frame = useCurrentFrame();
  // Self-guarded entrance: `hold` (the frame-0 cover / loop-back instances) renders fully
  // formed immediately — FadeOut only handles the EXIT fade, so without this a beat's
  // PriceTile would render at opacity 1 for the whole timeline, bleeding through every
  // earlier beat until its own FadeOut kicked in (the bug this shot shipped with once).
  const opIn = hold ? 1 : interpolate(frame, [at, at + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const riseY = hold ? 0 : interpolate(frame, [at, at + 14], [24, 0], { ...CLAMP, easing: EASINGS.easeOut });
  const pulseScale = pulse
    ? interpolate(frame, [at, at + 16, at + 34], [1, 1.05, 1], { ...CLAMP, easing: EASINGS.easeInOut })
    : 1;
  const cardBg = dark ? 'rgba(6,14,10,0.55)' : COLORS.paper;
  const labelColor = dark ? 'rgba(255,255,255,0.72)' : COLORS.muted;
  const subColor = dark ? 'rgba(255,255,255,0.8)' : COLORS.muted;
  return (
    <div style={{
      position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 610, display: 'flex', gap: 22,
      opacity: opIn, transform: `translateY(${riseY}px)`,
    }}>
      <div style={{
        flex: 1, background: cardBg, border: `2px solid ${COLORS.danger}`, borderRadius: RADIUS.card,
        padding: '30px 22px', textAlign: 'center', boxShadow: dark ? 'none' : `0 10px 30px ${COLORS.danger}22`,
      }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 26, letterSpacing: 3, color: labelColor }}>ZAPIER</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 58, color: COLORS.danger, textDecoration: 'line-through', marginTop: 6 }}>
          $29.99/mo
        </div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 26, color: subColor, marginTop: 6 }}>after 100 tasks</div>
      </div>
      <div style={{
        flex: 1, background: cardBg, border: `2px solid ${COLORS.signalAlt}`, borderRadius: RADIUS.card,
        padding: '30px 22px', textAlign: 'center', transform: `scale(${pulseScale})`,
        boxShadow: `0 10px 30px ${COLORS.signalAlt}33`,
      }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 26, letterSpacing: 3, color: labelColor }}>N8N</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 58, color: COLORS.signalAlt, marginTop: 6 }}>$0</div>
        <div style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 26, color: subColor, marginTop: 6 }}>no task cap</div>
      </div>
    </div>
  );
};

// =============================================================================
// TaskMeter — SETUP's proof slot: Zapier's 100-task meter filling to its cap,
// with the literal price row beneath it ("750 tasks -> $29.99/mo").
// =============================================================================
const TaskMeter: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [at, at + 44], [0, 100], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 26, color: COLORS.muted }}>
        <span>TASKS USED</span>
        <span>{Math.round(fill)} / 100</span>
      </div>
      <div style={{ height: 26, borderRadius: 13, background: COLORS.line, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${fill}%`, background: fill >= 99.5 ? COLORS.danger : COLORS.accent2, borderRadius: 13 }} />
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8,
        padding: '18px 22px', background: COLORS.cream, borderRadius: 12, border: `1px solid ${COLORS.line}`,
      }}>
        <span style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 30, color: COLORS.ink }}>750 tasks</span>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 34, color: COLORS.danger }}>$29.99/mo</span>
      </div>
    </div>
  );
};

// =============================================================================
// SpecRow / SpecTable — REVEAL's proof slot: n8n Community Edition's real
// spec line (source: n8n.io/pricing + docs.n8n.io community-edition-features).
// =============================================================================
const SpecRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 2px', borderBottom: `1px solid ${COLORS.line}` }}>
    <span style={{ fontFamily: FONT_BODY, fontWeight: 500, fontSize: 30, color: COLORS.muted }}>{label}</span>
    <span style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 30, color: COLORS.ink }}>{value}</span>
  </div>
);

const SpecTable: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <SpecRow label="License" value="Community Edition" />
    <SpecRow label="Hosting" value="Self-hosted" />
    <SpecRow label="Price" value="$0 forever" />
    <SpecRow label="Task cap" value="None" />
  </div>
);

// =============================================================================
// QuizCard — the rhetorical-question beat. No proof slot needed per the plan;
// a held typographic beat on the brand background.
// =============================================================================
const QuizCard: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at, at + 14], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const y = interpolate(frame, [at, at + 18], [40, 0], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <div style={{
      position: 'absolute', left: SAFE.side, right: SAFE.side, top: SHORT.H / 2 - 240,
      opacity: op, transform: `translateY(${y}px)`, textAlign: 'center',
    }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 28, letterSpacing: 6, color: COLORS.muted, marginBottom: 26 }}>
        THE QUESTION
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 82, lineHeight: 1.18, color: COLORS.ink }}>
        What if a tool had <span style={{ color: COLORS.accent }}>no task limit</span> — and cost{' '}
        <span style={{ color: COLORS.signal }}>nothing</span>?
      </div>
    </div>
  );
};

// The hook headline, reused verbatim at the CTA/loop beat so the last frame
// resolves back into the opening poster.
const HOOK_LINES = [
  { text: 'Zapier charges $30' },
  { text: 'after 100 tasks.' },
  { text: 'This tool is free.', accent: true },
] as const;

const Short013: React.FC = () => {
  const frame = useCurrentFrame();

  // CTA beat fades the cover layout back IN (mirror of FadeOut), starting exactly when TWIST
  // begins its own exit fade so the two crossfade with no blank frame between them.
  const ctaOp = interpolate(frame, [TWIST_OUT, TWIST_OUT + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg glow={COLORS.accent} />

      {/* ---------------- HOOK / cover poster (frame 0 = the Shorts shelf tile) ---------------- */}
      <FadeOut at={HOOK_OUT}>
        <CoverImage src={COVER_SRC} out={HOOK_OUT} />
        <HookTitle hold onDark kicker="ZAPIER VS n8n" lines={HOOK_LINES} fontSize={72} />
        <PriceTile at={HOOK_IN} dark hold />
      </FadeOut>

      {/* ---------------- SETUP — Zapier's 100-task cap, with the real price row ---------------- */}
      <FadeOut at={SETUP_OUT}>
        <ToolCard
          name="Zapier"
          tagline="Free plan caps at 100 tasks/mo. Then you pay per task."
          chip="AT LIMIT"
          chipColor={COLORS.danger}
          at={HOOK_OUT}
        >
          <TaskMeter at={HOOK_OUT + 20} />
        </ToolCard>
      </FadeOut>

      {/* ---------------- QUIZ — rhetorical beat, no proof slot ---------------- */}
      <FadeOut at={QUIZ_OUT}>
        <QuizCard at={SETUP_OUT} />
      </FadeOut>

      {/* ---------------- REVEAL — n8n's real spec row ---------------- */}
      <FadeOut at={REVEAL_OUT}>
        <ToolCard
          name="n8n"
          tagline="Self-hosted Community Edition. No execution cap, ever."
          chip="$0"
          chipColor={COLORS.signal}
          at={QUIZ_OUT}
        >
          <SpecTable />
        </ToolCard>
      </FadeOut>

      {/* ---------------- TWIST — the comparison settles ---------------- */}
      <FadeOut at={TWIST_OUT}>
        <HookTitle
          at={REVEAL_OUT}
          lines={[{ text: 'Zapier: $29.99/mo' }, { text: 'n8n: $0, forever.', accent: true }]}
          fontSize={72}
        />
        <PriceTile pulse at={REVEAL_OUT} />
      </FadeOut>

      {/* ---------------- CTA / LOOP — back to the exact cover layout ---------------- */}
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src={COVER_SRC} at={TWIST_OUT} />
        <HookTitle hold onDark kicker="ZAPIER VS n8n" lines={HOOK_LINES} fontSize={72} />
        <PriceTile at={TWIST_OUT} dark hold />
      </AbsoluteFill>

      <Watermark />
      <ProgressBar />
      <CaptionTrack words={WORDS} />
    </AbsoluteFill>
  );
};

export default Short013;
