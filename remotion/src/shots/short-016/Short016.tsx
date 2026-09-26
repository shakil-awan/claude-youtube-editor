import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-016 — "QuillBot Caps You At 125 Words — Grammarly Doesn't" (versus
// format). Beats: the cap hook -> QuillBot free + premium price -> Grammarly
// free scope + Pro price -> the verdict (pick by job) -> close returns to the
// cover for a seamless loop.
// =============================================================================
export const compositionConfig = { id: 'Short016', durationInSeconds: 39.4, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(5.654); // "QuillBot's free paraphraser gives you..."
const B2 = secToFrame(18.356); // "Grammarly's free plan checks..."
const B3 = secToFrame(29.362); // "So pick by the job..."
const CTA = secToFrame(35.144); // "Everyday writing checks..."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Row: React.FC<{ k: string; v: string; good?: boolean }> = ({ k, v, good }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : COLORS.d300, fontWeight: good ? 700 : 400 }}>{v}</span>
  </div>
);

const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 14 }}>
    {children}
  </div>
);

const Short016: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-016/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="FREE PLAN, COMPARED" lines={[{ text: '125 WORDS' }, { text: 'vs UNLIMITED', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="QuillBot (free)" tagline="Standard + Fluency modes only, capped per rewrite." chip="125 WORDS" at={B1 + 4} chipColor={COLORS.danger}>
          <Panel>
            <Row k="paraphraser cap" v="125 words" />
            <Row k="modes" v="2 of 9" />
            <Row k="Premium (annual)" v="$8.33 / mo" good />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="Grammarly (free)" tagline="Grammar, spelling, and tone — no word cap." chip="UNLIMITED" at={B2 + 4} chipColor={COLORS.signal}>
          <Panel>
            <Row k="grammar / spelling / tone" v="unlimited" good />
            <Row k="free AI prompts" v="100" good />
            <Row k="Pro (annual)" v="$12 / mo" />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="Pick by the job" tagline="Rewriting long text vs. everyday checking." chip="VERDICT" at={B3 + 4} chipColor={COLORS.accent2}>
          <Panel>
            <Row k="rewriting engine" v="QuillBot" good />
            <Row k="everyday checks" v="Grammarly free" good />
          </Panel>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-016/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="FREE PLAN, COMPARED" lines={[{ text: '125 WORDS' }, { text: 'vs UNLIMITED', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Which one do you reach for?
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short016;
