import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS, RADIUS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CountBadge, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-001 — "3 AI tools that are completely free" (script: videos/short-001/).
// Beats are cut on the REAL voiceover word times (words.ts, generated from
// words.json): each card enters on its "Number N" and hands off on the next.
// Mux videos/short-001/work/voiceover/voiceover.mp3 over the render (/make-short §5).
// =============================================================================
export const compositionConfig = { id: 'Short001', durationInSeconds: 36.9, fps: 30, width: 1080, height: 1920 };

// beat anchors, from words.ts (seconds → frames)
const B1 = secToFrame(4.261); // "Number one"
const B2 = secToFrame(12.225); // "Number two"
const B3 = secToFrame(21.142); // "Number three"
const PAYOFF = secToFrame(28.468); // "That is a faceless YouTube channel..."
const CTA = secToFrame(32.299); // "Follow for..."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// deterministic waveform for the ElevenLabs proof slot
const WAVE = [18, 34, 52, 40, 64, 48, 70, 38, 58, 44, 66, 30, 54, 62, 36, 50, 68, 42, 56, 26];

const Short001: React.FC = () => {
  const frame = useCurrentFrame();

  // the glow tracks the beat color: indigo hook/beat1 → violet beat2 → teal beat3 → indigo close
  const glow2 = interpolate(frame, [B2 - 10, B2 + 10, B3 - 10, B3 + 10], [0, 1, 1, 0], CLAMP);
  const glow3 = interpolate(frame, [B3 - 10, B3 + 10, PAYOFF - 10, PAYOFF + 10], [0, 1, 1, 0], CLAMP);

  return (
    <AbsoluteFill>
      <ShortBg />
      <AbsoluteFill style={{ opacity: glow2, background: `radial-gradient(900px 1100px at 50% -8%, ${COLORS.accent2}33, transparent 62%)` }} />
      <AbsoluteFill style={{ opacity: glow3, background: `radial-gradient(900px 1100px at 50% -8%, ${COLORS.signal}30, transparent 62%)` }} />

      {/* hook — "Stop paying for AI tools. These three are completely free." */}
      <FadeOut at={B1}>
        <HookTitle kicker="STOP PAYING" lines={[{ text: '3 AI tools' }, { text: 'completely FREE', accent: true }]} />
      </FadeOut>

      {/* beat 1 — NotebookLM: PDF → podcast */}
      <FadeOut at={B2}>
        <CountBadge n={1} of={3} at={B1} />
        <ToolCard name="NotebookLM" tagline="Any PDF becomes a podcast for your commute." chip="FREE" at={B1 + 4}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontFamily: FONT_BODY }}>
            <div style={{ background: COLORS.cream, border: `2px solid ${COLORS.line}`, borderRadius: 12, padding: '16px 24px', fontSize: 32, fontWeight: 600, color: COLORS.danger }}>PDF</div>
            <div style={{ fontSize: 36, color: COLORS.muted }}>→</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: COLORS.accent, borderRadius: RADIUS.pill, padding: '14px 26px' }}>
              <div style={{ width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderLeft: `18px solid ${COLORS.paper}` }} />
              <span style={{ fontSize: 30, fontWeight: 600, color: COLORS.paper }}>podcast</span>
            </div>
          </div>
        </ToolCard>
      </FadeOut>

      {/* beat 2 — Google AI Studio: prompt box */}
      <FadeOut at={B3}>
        <CountBadge n={2} of={3} at={B2} color={COLORS.accent2} />
        <ToolCard name="Google AI Studio" tagline="The full Gemini model, in your browser." chip="FREE" at={B2 + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: 28, color: COLORS.d400 }}>Ask Gemini anything…</span>
            <span style={{ background: COLORS.accent, color: COLORS.paper, borderRadius: 8, padding: '8px 20px', fontFamily: FONT_BODY, fontSize: 26, fontWeight: 600 }}>Run</span>
          </div>
        </ToolCard>
      </FadeOut>

      {/* beat 3 — ElevenLabs: waveform */}
      <FadeOut at={PAYOFF}>
        <CountBadge n={3} of={3} at={B3} color={COLORS.signal} />
        <ToolCard name="ElevenLabs" tagline="Studio voiceovers — ten free minutes monthly." chip="FREE TIER" at={B3 + 4}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 74 }}>
            {WAVE.map((h, i) => {
              const grow = interpolate(frame, [B3 + 6 + i * 2, B3 + 16 + i * 2], [0.15, 1], { ...CLAMP, easing: EASINGS.easeOut });
              return <div key={i} style={{ width: 22, height: h * grow, borderRadius: 6, background: i % 3 === 0 ? COLORS.signal : COLORS.accent }} />;
            })}
          </div>
        </ToolCard>
      </FadeOut>

      {/* payoff — "That is a faceless YouTube channel, for zero dollars." */}
      <FadeOut at={CTA}>
        <HookTitle at={PAYOFF} lines={[{ text: 'A faceless channel' }, { text: 'for $0', accent: true }]} />
      </FadeOut>

      {/* CTA — "Follow for one money making AI tool every single day." */}
      <HookTitle at={CTA} kicker="EVERY SINGLE DAY" lines={[{ text: 'Follow for one' }, { text: 'money-making', accent: true }, { text: 'AI tool' }]} fontSize={104} />

      <CaptionTrack words={WORDS} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short001;
