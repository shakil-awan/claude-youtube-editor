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
// short-014 — "Anthropic's Claude Opus 5.5 just got 40% cheaper."
// News-jack: HOOK -> SETUP (Opus 5.5 list price) -> QUIZ -> REVEAL (cache price,
// 60% off) -> TWIST (GPT-6 Sol/Luna cameo) -> LOOP back to the cover.
// All beat boundaries are cut from videos/short-014/work/voiceover/words.json
// (copied verbatim into ./words.ts) — never eyeballed.
// =============================================================================
export const compositionConfig = { id: 'Short014', durationInSeconds: 50.3, fps: 30, width: 1080, height: 1920 };

const COVER = 'projects/short-014/cover.png';

// ---- beat boundaries (frames @30fps), cut from the word timestamps ----------
// "Anthropic's Claude Opus five point five just got forty percent cheaper.
// That is Anthropic's new flagship model, and it costs less to run than the
// one it replaces." (0 -> 11.262s) — hold the cover through it.
const HOOK_OUT = secToFrame(11.8); // 354 — before "Here's the setup." (11.958s)

// "Here's the setup. Opus five point five launched this week for coding and
// long agent tasks, the jobs that burn through tokens fastest." (11.958 -> 21.014s)
const SETUP_IN = secToFrame(11.9); // 357
const SETUP_OUT = secToFrame(21.6); // 648 — before "Quick guess" (21.826s)

// "Quick guess, how much do cached tokens cost now?" (21.826 -> 25.147s)
const QUIZ_IN = secToFrame(21.7); // 651
const QUIZ_OUT = secToFrame(25.9); // 777 — before "The answer" (26.099s)

// "The answer, twenty cents per million, sixty percent below the old price.
// Input dropped to four dollars, output to twenty dollars per million tokens."
// (26.099 -> 35.375s)
const REVEAL_IN = secToFrame(26.0); // 780
const REVEAL_OUT = secToFrame(35.8); // 1074 — before "But here's the twist." (36.071s)

// "But here's the twist. Ninety minutes later, OpenAI answered back with two
// cheaper GPT-6 models of its own." (36.071 -> 42.596s)
const TWIST_IN = secToFrame(37.2); // 1116 — after "twist." lands (37.07s)
const TWIST_OUT = secToFrame(43.0); // 1290 — before "Forty percent cheaper" (43.293s)

// "Forty percent cheaper, and still Anthropic's best model. Prices are
// falling, your bill should too." (43.293 -> 49.783s) — loop back to the cover.
const LOOP_IN = secToFrame(43.1); // 1293

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
  cols: [string, string];
  rows: { label: string; a: string; b: string; hot?: boolean }[];
}> = ({ appearAt, cols, rows }) => (
  <div style={{ position: 'relative', width: 856, height: 300 }}>
    <WebBrowserFrame
      url="anthropic.com/claude/opus"
      tabTitle="Opus pricing · Anthropic"
      box={{ x: 0, y: 0, w: 856, h: 300 }}
      appearAt={appearAt}
      uiScale={1.15}
    >
      <div style={{ width: 856, fontFamily: FONT_MONO, background: '#fff' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5', background: '#fafafa', fontWeight: 700, fontSize: 24, color: '#595959' }}>
          <div style={{ flex: 1.3, padding: '14px 20px' }}>Model</div>
          <div style={{ flex: 1, padding: '14px 20px' }}>{cols[0]}</div>
          <div style={{ flex: 1, padding: '14px 20px' }}>{cols[1]}</div>
        </div>
        {rows.map((r) => (
          <div key={r.label} style={{
            display: 'flex', borderBottom: '1px solid #eee', fontSize: 26,
            background: r.hot ? `${COLORS.accent}14` : '#fff',
          }}>
            <div style={{ flex: 1.3, padding: '16px 20px', fontWeight: r.hot ? 700 : 500, color: r.hot ? COLORS.accent : '#1d1d1d' }}>{r.label}</div>
            <div style={{ flex: 1, padding: '16px 20px', fontWeight: r.hot ? 700 : 500, color: r.hot ? COLORS.accent : '#1d1d1d' }}>{r.a}</div>
            <div style={{ flex: 1, padding: '16px 20px', fontWeight: r.hot ? 700 : 500, color: r.hot ? COLORS.accent : '#1d1d1d' }}>{r.b}</div>
          </div>
        ))}
      </div>
    </WebBrowserFrame>
  </div>
);

const Short014: React.FC = () => {
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
          kicker="ANTHROPIC · OPUS 5.5"
          lines={[{ text: '40% cheaper', accent: true }, { text: 'than the last flagship' }]}
        />
      </FadeOut>

      {/* ---- SETUP: Opus 5.5 list price ---- */}
      <FadeOut at={SETUP_OUT}>
        <ToolCard
          name="Claude Opus 5.5"
          tagline="For coding and long agent runs."
          chip="$4 / $20"
          chipColor={COLORS.accent}
          at={SETUP_IN + 4}
        >
          <PriceProof
            appearAt={SETUP_IN + 14}
            cols={['Input /1M', 'Output /1M']}
            rows={[
              { label: 'Opus 5', a: '$5.00', b: '$25.00' },
              { label: 'Opus 5.5', a: '$4.00', b: '$20.00', hot: true },
            ]}
          />
        </ToolCard>
      </FadeOut>

      {/* ---- QUIZ: rhetorical question card ---- */}
      <FadeOut at={QUIZ_OUT}>
        <HookTitle
          at={QUIZ_IN}
          kicker="QUICK GUESS"
          lines={[{ text: 'What do cached' }, { text: 'tokens cost now?', accent: true }]}
        />
      </FadeOut>

      {/* ---- REVEAL: cache price, 60% off ---- */}
      <FadeOut at={REVEAL_OUT}>
        <ToolCard
          name="Claude Opus 5.5"
          tagline="Cached tokens now cost 60% less."
          chip="$0.20 / cache"
          chipColor={COLORS.accent2}
          at={REVEAL_IN + 4}
        >
          <PriceProof
            appearAt={REVEAL_IN + 14}
            cols={['Cache read', 'vs. before']}
            rows={[
              { label: 'Opus 5', a: '$0.50 / 1M', b: '—' },
              { label: 'Opus 5.5', a: '$0.20 / 1M', b: '-60%', hot: true },
            ]}
          />
        </ToolCard>
        <StatPill text="60% OFF cache" at={REVEAL_IN + 24} />
      </FadeOut>

      {/* ---- TWIST: GPT-6 Sol / Luna cameo (secondary framing, shorter hold) ---- */}
      <FadeOut at={TWIST_OUT}>
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 340,
          opacity: interpolate(frame, [TWIST_IN, TWIST_IN + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut }),
          transform: `translateY(${interpolate(frame, [TWIST_IN, TWIST_IN + 16], [40, 0], { ...CLAMP, easing: EASINGS.easeOut })}px)`,
          background: COLORS.d900, border: `2px solid ${COLORS.d600}`, borderRadius: 16,
          padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
        }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 24, letterSpacing: 2, color: COLORS.d400, marginBottom: 8 }}>90 MIN LATER · OPENAI</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 52, color: '#fff' }}>GPT-6 Sol / Luna</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 30, color: COLORS.d300, marginTop: 6 }}>OpenAI answered back the same day.</div>
          </div>
          <div style={{
            background: COLORS.signal, color: COLORS.paper, borderRadius: 999,
            fontFamily: FONT_MONO, fontWeight: 700, fontSize: 30, padding: '12px 24px', whiteSpace: 'nowrap',
          }}>
            from $0.10
          </div>
        </div>
      </FadeOut>

      {/* ---- LOOP: back to the cover for the seamless replay ---- */}
      <FadeIn at={LOOP_IN}>
        <CoverImage src={COVER} at={LOOP_IN} />
        <HookTitle
          hold
          onDark
          kicker="ANTHROPIC · OPUS 5.5"
          lines={[{ text: '40% cheaper', accent: true }, { text: 'than the last flagship' }]}
        />
      </FadeIn>

      <ProgressBar />
      <Watermark />
      {/* captions hidden once the loop returns to the cover — CaptionTrack's
          default ink color vanishes on dark cover art, and a caption burning
          across the closing poster would defeat the loop. */}
      <FadeOut at={LOOP_IN}>
        <CaptionTrack words={WORDS} startAt={24} />
      </FadeOut>
    </AbsoluteFill>
  );
};
export default Short014;
