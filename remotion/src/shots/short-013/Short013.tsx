import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_DISPLAY, FONT_MONO, FONT_BODY } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { WebBrowserFrame } from '../../lib/browser';
import {
  CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame,
} from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-013 — "OpenAI's GPT-6 Luna costs ten cents per million tokens."
// News-jack: HOOK -> SETUP (Luna) -> QUIZ -> REVEAL (Sol, ~50% off) ->
// TWIST (Claude Opus 5.5 cameo) -> LOOP back to the cover.
// All beat boundaries are cut from videos/short-013/work/voiceover/words.json
// (copied verbatim into ./words.ts) — never eyeballed.
// =============================================================================
export const compositionConfig = { id: 'Short013', durationInSeconds: 44.5, fps: 30, width: 1080, height: 1920 };

const COVER = 'projects/short-013/cover.png';

// ---- beat boundaries (frames @30fps), cut from the word timestamps ----------
// "OpenAI's GPT-6 Luna costs ten cents per million tokens. That's the cheapest
// model OpenAI has ever shipped." ends 7.546s -> hold the cover through it.
const HOOK_OUT = secToFrame(8.4); // 252 — just before "Here's the setup." (8.661s)

// "Here's the setup. This week OpenAI quietly released two new models, Luna and
// Sol, built for teams burning through huge volumes of text." (8.661 -> 17.52s)
const SETUP_IN = secToFrame(8.6); // 258
const SETUP_OUT = secToFrame(17.9); // 537 — before "Quick guess" (18.216s)

// "Quick guess, how much cheaper is Luna than OpenAI's last generation model?" (18.216 -> 22.616s)
const QUIZ_IN = secToFrame(18.1); // 543
const QUIZ_OUT = secToFrame(22.9); // 687 — before "The answer" (23.127s)

// "The answer, fifty percent. Luna runs summaries, tickets, and short answers
// at half the old price." (23.127 -> 29.536s)
const REVEAL_IN = secToFrame(23.0); // 690
const REVEAL_OUT = secToFrame(30.15); // 905 — before "But here's the twist." (30.349s)

// "But here's the twist. Ninety minutes earlier, Anthropic cut Claude's price
// too. Two labs, the same day, the same move." (30.349 -> 38.441s)
const TWIST_IN = secToFrame(31.6); // 948 — after "twist." lands (31.463s)
const TWIST_OUT = secToFrame(38.7); // 1161 — before "Ten cents" (39.138s)

// "Ten cents just became the new cheap. Lock in the model before prices move
// again." (39.138 -> 43.979s) — loop back to the cover for the seamless replay.
const LOOP_IN = secToFrame(38.9); // 1167

// fade a beat OUT smoothly so the next one hands off cleanly
const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// fade a beat IN and hold — used for the loop-back so the LAST frame is a
// static, fully-opaque poster (the shelf/last-frame QA gate), never mid-fade.
const FadeIn: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// small pill badge, visually matching CountBadge, repurposed to show a %-off
// stat rather than an "n / of" count — pops in with the same overshoot motion.
const StatPill: React.FC<{ text: string; at: number; color?: string }> = ({ text, at, color = COLORS.accent2 }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const pop = interpolate(frame, [at, at + 10], [0.8, 1], { ...CLAMP, easing: EASINGS.overshoot });
  return (
    <div style={{
      position: 'absolute', top: SAFE.top + 150, right: SAFE.side,
      transform: `scale(${pop})`, transformOrigin: 'top right', opacity: op,
      background: color, color: COLORS.paper, borderRadius: 999,
      fontFamily: FONT_MONO, fontWeight: 700, fontSize: 34, padding: '12px 30px',
      boxShadow: `0 10px 30px ${color}66`, letterSpacing: 1,
    }}>
      {text}
    </div>
  );
};

// compact cropped pricing-table proof slot, built on WebBrowserFrame — the
// fake-screencast technique short.md calls for instead of a real recording.
const PriceProof: React.FC<{
  appearAt: number;
  rows: { label: string; inp: string; out: string; hot?: boolean }[];
}> = ({ appearAt, rows }) => (
  <div style={{ position: 'relative', width: 856, height: 300 }}>
    <WebBrowserFrame
      url="developers.openai.com/api/docs/pricing"
      tabTitle="Pricing · OpenAI API docs"
      box={{ x: 0, y: 0, w: 856, h: 300 }}
      appearAt={appearAt}
      uiScale={1.15}
    >
      <div style={{ width: 856, fontFamily: FONT_MONO, background: '#fff' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5', background: '#fafafa', fontWeight: 700, fontSize: 24, color: '#595959' }}>
          <div style={{ flex: 1.3, padding: '14px 20px' }}>Model</div>
          <div style={{ flex: 1, padding: '14px 20px' }}>Input /1M</div>
          <div style={{ flex: 1, padding: '14px 20px' }}>Output /1M</div>
        </div>
        {rows.map((r) => (
          <div key={r.label} style={{
            display: 'flex', borderBottom: '1px solid #eee', fontSize: 26,
            background: r.hot ? `${COLORS.accent}14` : '#fff',
          }}>
            <div style={{ flex: 1.3, padding: '16px 20px', fontWeight: r.hot ? 700 : 500, color: r.hot ? COLORS.accent : '#1d1d1d' }}>{r.label}</div>
            <div style={{ flex: 1, padding: '16px 20px', fontWeight: r.hot ? 700 : 500, color: r.hot ? COLORS.accent : '#1d1d1d' }}>{r.inp}</div>
            <div style={{ flex: 1, padding: '16px 20px', fontWeight: r.hot ? 700 : 500, color: r.hot ? COLORS.accent : '#1d1d1d' }}>{r.out}</div>
          </div>
        ))}
      </div>
    </WebBrowserFrame>
  </div>
);

const Short013: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ShortBg />

      {/* ---- cover / HOOK (frame 0 = the feed poster) ---- */}
      <CoverImage src={COVER} at={0} out={HOOK_OUT} />
      <FadeOut at={HOOK_OUT}>
        <HookTitle
          hold
          onDark
          kicker="OPENAI · GPT-6"
          lines={[{ text: 'Luna costs' }, { text: '10¢ / million tokens', accent: true }]}
        />
      </FadeOut>

      {/* ---- SETUP: GPT-6 Luna ---- */}
      <FadeOut at={SETUP_OUT}>
        <ToolCard
          name="GPT-6 Luna"
          tagline="Built for huge volumes of simple tasks."
          chip="$0.10 / $0.50"
          chipColor={COLORS.accent}
          at={SETUP_IN + 4}
        >
          <PriceProof
            appearAt={SETUP_IN + 14}
            rows={[
              { label: 'GPT-5.6', inp: '$0.20', out: '$1.00' },
              { label: 'GPT-6 Luna', inp: '$0.10', out: '$0.50', hot: true },
            ]}
          />
        </ToolCard>
      </FadeOut>

      {/* ---- QUIZ: rhetorical question card ---- */}
      <FadeOut at={QUIZ_OUT}>
        <HookTitle
          at={QUIZ_IN}
          kicker="QUICK GUESS"
          lines={[{ text: 'How much cheaper' }, { text: 'than last gen?', accent: true }]}
        />
      </FadeOut>

      {/* ---- REVEAL: GPT-6 Sol, ~50% off ---- */}
      <FadeOut at={REVEAL_OUT}>
        <ToolCard
          name="GPT-6 Sol"
          tagline="The mid-tier, for real coding work."
          chip="$2 / $10"
          chipColor={COLORS.accent2}
          at={REVEAL_IN + 4}
        >
          <PriceProof
            appearAt={REVEAL_IN + 14}
            rows={[
              { label: 'GPT-5.6 Std', inp: '$4.00', out: '$20.00' },
              { label: 'GPT-6 Sol', inp: '$2.00', out: '$10.00', hot: true },
            ]}
          />
        </ToolCard>
        <StatPill text="~50% OFF" at={REVEAL_IN + 24} />
      </FadeOut>

      {/* ---- TWIST: Claude Opus 5.5 cameo (secondary framing, shorter hold) ---- */}
      <FadeOut at={TWIST_OUT}>
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 340,
          opacity: interpolate(frame, [TWIST_IN, TWIST_IN + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut }),
          transform: `translateY(${interpolate(frame, [TWIST_IN, TWIST_IN + 16], [40, 0], { ...CLAMP, easing: EASINGS.easeOut })}px)`,
          background: COLORS.d900, border: `2px solid ${COLORS.d600}`, borderRadius: 16,
          padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
        }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 24, letterSpacing: 2, color: COLORS.d400, marginBottom: 8 }}>THE SAME DAY · ANTHROPIC</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 52, color: '#fff' }}>Claude Opus 5.5</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: COLORS.d300, marginTop: 6 }}>Anthropic moved 90 minutes earlier.</div>
          </div>
          <div style={{
            background: COLORS.signal, color: COLORS.paper, borderRadius: 999,
            fontFamily: FONT_MONO, fontWeight: 700, fontSize: 30, padding: '12px 24px', whiteSpace: 'nowrap',
          }}>
            $4 / $20
          </div>
        </div>
      </FadeOut>

      {/* ---- LOOP: back to the cover for the seamless replay ---- */}
      <FadeIn at={LOOP_IN}>
        <CoverImage src={COVER} at={LOOP_IN} />
        <HookTitle
          hold
          onDark
          kicker="OPENAI · GPT-6"
          lines={[{ text: 'Luna costs' }, { text: '10¢ / million tokens', accent: true }]}
        />
      </FadeIn>

      <ProgressBar />
      <Watermark />
      {/* captions hidden once the loop returns to the cover — same reasoning as the
          frame-0 hold: CaptionTrack's default ink color vanishes on dark cover art,
          and a caption burning across the closing poster would defeat the loop. */}
      <FadeOut at={LOOP_IN}>
        <CaptionTrack words={WORDS} startAt={24} />
      </FadeOut>
    </AbsoluteFill>
  );
};
export default Short013;
