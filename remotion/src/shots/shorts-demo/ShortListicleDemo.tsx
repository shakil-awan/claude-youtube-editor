import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_DISPLAY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CaptionWord, CountBadge, HookTitle, SAFE, ShortBg, ToolCard } from '../../lib/shorts';

// =============================================================================
// ShortListicleDemo — the worked example of the Shorts kit (lib/shorts.tsx).
// A complete 17.5s listicle Short: hook → 3 tool beats → follow CTA, with a
// word-synced caption track. In production /make-short generates WORDS from
// tools/gen_voiceover.py (work/voiceover/words.json) and the beats from the
// script; here the narration timings are embedded so it renders standalone.
// Narration this simulates: "Stop paying for AI tools. These three are free.
// Number one — Claude Code. It builds your entire app while you sleep. Number
// two — ElevenLabs. Studio voiceovers in thirty seconds. Number three —
// NotebookLM. It turns any PDF into a podcast. Follow for daily AI tools."
// =============================================================================
export const compositionConfig = { id: 'ShortListicleDemo', durationInSeconds: 17.5, fps: 30, width: 1080, height: 1920 };

const WORDS: readonly CaptionWord[] = [
  { word: 'Stop', start_s: 0.0, end_s: 0.28 }, { word: 'paying', start_s: 0.28, end_s: 0.62 },
  { word: 'for', start_s: 0.62, end_s: 0.76 }, { word: 'AI', start_s: 0.76, end_s: 1.06 },
  { word: 'tools.', start_s: 1.06, end_s: 1.5 },
  { word: 'These', start_s: 1.7, end_s: 1.92 }, { word: 'three', start_s: 1.92, end_s: 2.2 },
  { word: 'are', start_s: 2.2, end_s: 2.32 }, { word: 'free.', start_s: 2.32, end_s: 2.8 },
  { word: 'Number', start_s: 3.0, end_s: 3.3 }, { word: 'one,', start_s: 3.3, end_s: 3.6 },
  { word: 'Claude', start_s: 3.75, end_s: 4.1 }, { word: 'Code.', start_s: 4.1, end_s: 4.5 },
  { word: 'It', start_s: 4.7, end_s: 4.8 }, { word: 'builds', start_s: 4.8, end_s: 5.15 },
  { word: 'your', start_s: 5.15, end_s: 5.3 }, { word: 'entire', start_s: 5.3, end_s: 5.7 },
  { word: 'app', start_s: 5.7, end_s: 6.0 }, { word: 'while', start_s: 6.0, end_s: 6.25 },
  { word: 'you', start_s: 6.25, end_s: 6.4 }, { word: 'sleep.', start_s: 6.4, end_s: 6.9 },
  { word: 'Number', start_s: 7.2, end_s: 7.5 }, { word: 'two,', start_s: 7.5, end_s: 7.8 },
  { word: 'ElevenLabs.', start_s: 7.95, end_s: 8.6 },
  { word: 'Studio', start_s: 8.8, end_s: 9.2 }, { word: 'voiceovers', start_s: 9.2, end_s: 9.85 },
  { word: 'in', start_s: 9.85, end_s: 9.95 }, { word: 'thirty', start_s: 9.95, end_s: 10.3 },
  { word: 'seconds.', start_s: 10.3, end_s: 10.9 },
  { word: 'Number', start_s: 11.2, end_s: 11.5 }, { word: 'three,', start_s: 11.5, end_s: 11.8 },
  { word: 'NotebookLM.', start_s: 11.95, end_s: 12.7 },
  { word: 'It', start_s: 12.85, end_s: 12.95 }, { word: 'turns', start_s: 12.95, end_s: 13.25 },
  { word: 'any', start_s: 13.25, end_s: 13.5 }, { word: 'PDF', start_s: 13.5, end_s: 13.95 },
  { word: 'into', start_s: 13.95, end_s: 14.2 }, { word: 'a', start_s: 14.2, end_s: 14.28 },
  { word: 'podcast.', start_s: 14.28, end_s: 14.85 },
  { word: 'Follow', start_s: 15.1, end_s: 15.45 }, { word: 'for', start_s: 15.45, end_s: 15.6 },
  { word: 'daily', start_s: 15.6, end_s: 15.9 }, { word: 'AI', start_s: 15.9, end_s: 16.2 },
  { word: 'tools.', start_s: 16.2, end_s: 16.7 },
];

// beat spans (frames @30fps) — in production these come from the words.json times
const HOOK_OUT = 80;
const B1 = { in: 88, out: 206 };
const B2 = { in: 214, out: 326 };
const B3 = { in: 334, out: 440 };
const CTA = 448;

// fade-out wrapper so one beat hands off cleanly to the next
const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const ShortListicleDemo: React.FC = () => {
  const frame = useCurrentFrame();

  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const ctaY = interpolate(frame, [CTA, CTA + 14], [30, 0], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={HOOK_OUT}>
        <HookTitle kicker="FREE AI TOOLS" lines={[{ text: '3 AI tools' }, { text: 'that are FREE', accent: true }]} />
      </FadeOut>

      <FadeOut at={B1.out}>
        <CountBadge n={1} of={3} at={B1.in} />
        <ToolCard name="Claude Code" tagline="Builds your entire app while you sleep." chip="FREE" at={B1.in + 4}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '22px 26px', fontFamily: FONT_MONO, fontSize: 30, color: COLORS.d300 }}>
            <span style={{ color: COLORS.signal }}>$</span> claude &quot;build my app&quot; <span style={{ color: COLORS.d400 }}>▊</span>
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B2.out}>
        <CountBadge n={2} of={3} at={B2.in} color={COLORS.accent2} />
        <ToolCard name="ElevenLabs" tagline="Studio-grade voiceovers in 30 seconds." chip="FREE TIER" at={B2.in + 4} />
      </FadeOut>

      <FadeOut at={B3.out}>
        <CountBadge n={3} of={3} at={B3.in} color={COLORS.signal} />
        <ToolCard name="NotebookLM" tagline="Turns any PDF into a podcast." chip="FREE" at={B3.in + 4} />
      </FadeOut>

      <div style={{
        position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 320,
        opacity: ctaOp, transform: `translateY(${ctaY}px)`, textAlign: 'center',
        fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 92, lineHeight: 1.1, color: COLORS.ink,
      }}>
        Follow for <span style={{ color: COLORS.accent }}>daily</span> AI tools
      </div>

      <CaptionTrack words={WORDS} />
    </AbsoluteFill>
  );
};
export default ShortListicleDemo;
