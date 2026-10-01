import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-016 — Fathom free (unlimited) vs Otter free (300 min). Evergreen versus.
// Beats: Fathom free -> Otter limits -> paid prices -> the catch -> cover.
// =============================================================================
export const compositionConfig = { id: 'Short016', durationInSeconds: 44.5, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(6.223); // "Fathom gives you unlimited"
const B2 = secToFrame(14.315); // "Otter caps each conversation"
const B3 = secToFrame(26.03); // "Fathom's paid plan"
const B4 = secToFrame(31.173); // "The catch?"
const CTA = secToFrame(40.437); // "Otter's free plan has a ceiling"

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean; bad?: boolean }> = ({ k, v, good, bad }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : bad ? COLORS.danger : COLORS.d300, fontWeight: good || bad ? 700 : 400 }}>{v}</span>
  </div>
);

const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
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
        <HookTitle hold onDark kicker="OTTER FREE STOPS AT 300 MIN" lines={[{ text: 'FATHOM FREE' }, { text: 'IS UNLIMITED', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="Fathom Free" tagline="Free forever. No minute cap." chip="FREE" at={B1 + 4}>
          <Panel>
            <Line k="recordings" v="unlimited" good />
            <Line k="transcripts" v="unlimited" good />
            <Line k="AI summaries" v="instant" good />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="Otter Free" tagline="Three caps in one plan." chip="CAPPED" at={B2 + 4} chipColor={COLORS.danger}>
          <Panel>
            <Line k="minutes / month" v="300" bad />
            <Line k="per conversation" v="30 min" bad />
            <Line k="file imports" v="3 ever" bad />
            <Line k="Pro plan" v="$16.99/mo" />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B4}>
        <ToolCard name="Going paid" tagline="Fathom's upgrade is optional." chip="PRICES" at={B3 + 4} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="Otter Pro" v="$16.99/mo" bad />
            <Line k="Otter Pro annual" v="$8.33/mo" />
            <Line k="Fathom Premium" v="$20/mo" />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="The catch" tagline="Free Fathom is solo-friendly only." chip="READ THIS" at={B4 + 4} chipColor={COLORS.danger}>
          <Panel>
            <Line k="Ask Fathom AI" v="limited" bad />
            <Line k="team features" v="paid only" bad />
          </Panel>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-016/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="OTTER FREE STOPS AT 300 MIN" lines={[{ text: 'FATHOM FREE' }, { text: 'IS UNLIMITED', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Otter has a ceiling.
        </div>
      </AbsoluteFill>

      {frame < CTA ? <CaptionTrack words={WORDS} /> : null}
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short016;
