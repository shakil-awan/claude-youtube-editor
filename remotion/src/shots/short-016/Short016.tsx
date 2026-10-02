import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-016 — "Adobe Express Free: 100,000 Templates, No Card" (evergreen)
export const compositionConfig = { id: 'Short016', durationInSeconds: 41.2, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(6.3); // "You get over one hundred thousand templates."
const B2 = secToFrame(14.5); // "Four thousand Adobe fonts."
const B3 = secToFrame(22.8); // "So what does paying get you?"
const CTA = secToFrame(34.0); // "If you only need templates…"

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean }> = ({ k, v, good }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : COLORS.d300, fontWeight: good ? 700 : 400 }}>{v}</span>
  </div>
);
const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
);

const Short016: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const hook = { kicker: 'NO CREDIT CARD', lines: [{ text: '100,000+ TEMPLATES' }, { text: 'FREE', accent: true }] };

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-016/cover.png" out={B1 - 10} />
        <HookTitle hold onDark {...hook} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="Adobe Express" tagline="Free plan. Not a trial. No card." chip="FREE" at={B1 + 4}>
          <Panel>
            <Line k="cost" v="$0" good />
            <Line k="templates" v="100,000+" good />
            <Line k="credit card" v="none" />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="What's inside" tagline="Stock, fonts and storage, all included." chip="INCLUDED" at={B2 + 4}>
          <Panel>
            <Line k="stock assets" v="1M+" good />
            <Line k="Adobe Fonts" v="4,000+" good />
            <Line k="storage" v="5 GB" />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="Premium" tagline="Only worth it if you use the AI credits." chip="$9.99/MO" at={B3 + 4} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="generative credits" v="250 / mo" />
            <Line k="storage" v="100 GB" />
          </Panel>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-016/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} {...hook} />
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short016;
