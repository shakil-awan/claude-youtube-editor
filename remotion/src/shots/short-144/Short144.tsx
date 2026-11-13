import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-144: Claude Fast mode. Fable 5.2 $16/$80 (std $8/$40); Opus 5.5 $8/$40 (std $4/$20); no Batch.
// (platform.claude.com/docs/en/about-claude/pricing, 2026-11-13).
export const compositionConfig = { id: 'Short144', durationInSeconds: 37.9, fps: 30, width: 1080, height: 1920 };

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean; bad?: boolean }> = ({ k, v, good, bad }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: bad ? COLORS.danger : good ? COLORS.signalAlt : COLORS.d300, fontWeight: good || bad ? 700 : 400 }}>{v}</span>
  </div>
);
const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
);

const B1 = 4.0; // "It costs sixteen"
const B2 = 13.9; // "Opus five point five Fast"
const B3 = 20.5; // "Here is the twist"
const B4 = 29.3; // "And Fast mode does not work"
const END = 32.5; // "So Fable Fast costs"

const Short144: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(END);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'FABLE FAST $16' }, { text: 'OPUS FAST $8', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(B1)}>
        <CoverImage src="projects/short-144/cover.png" out={secToFrame(B1) - 10} />
        <HookTitle hold onDark kicker="CLAUDE API FAST MODE" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(B2)}>
        <ToolCard name="Fable 5.2 Fast" tagline="Up to 2.5x faster output." chip="2x" at={secToFrame(B1) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="standard in/out" v="$8 / $40" />
            <Line k="Fast in/out" v="$16 / $80" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B3)}>
        <ToolCard name="Opus 5.5 Fast" tagline="Also double." chip="2x" at={secToFrame(B2) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="standard in/out" v="$4 / $20" />
            <Line k="Fast in/out" v="$8 / $40" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B4)}>
        <ToolCard name="The twist" tagline="Per 1M tokens, in / out." chip="$8/$40" at={secToFrame(B3) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="Opus 5.5 Fast" v="$8 / $40" good />
            <Line k="Fable 5.2 standard" v="$8 / $40" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="No Batch discount" tagline="Fast mode skips the Batch API." chip="NO BATCH" at={secToFrame(B4) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="Fast + Batch" v="not available" bad />
            <Line k="Fast + caching" v="stacks" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-144/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="CLAUDE API FAST MODE" lines={lines} />
      </AbsoluteFill>
      <FadeOut at={secToFrame(37.5)}>
        <CaptionTrack words={WORDS} />
      </FadeOut>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short144;
