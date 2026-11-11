import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-139: Gemini 4 Carbon opens to all paying API devs (Nov 10) at $2/$10; $4/$20 from Dec 1.
// Cover held at frame 0; closes on the cover so the loop is seamless.
export const compositionConfig = { id: 'Short139', durationInSeconds: 45.2, fps: 30, width: 1080, height: 1920 };

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

const Short139: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(39.6);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'GEMINI 4 CARBON' }, { text: '$2 TILL NOV 30', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(5.5)}>
        <CoverImage src="projects/short-139/cover.png" out={secToFrame(5.5) - 10} />
        <HookTitle hold onDark kicker="GOOGLE API" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(16.4)}>
        <ToolCard name="Gemini 4 Carbon" tagline="Open to every paying dev." chip="$2/$10" at={secToFrame(5.5) - 2}>
          <Panel>
            <Line k="input /1M" v="$2" good />
            <Line k="output /1M" v="$10" good />
            <Line k="Argon (same)" v="$2 / $10" />
            <Line k="opened" v="Nov 10, 2026" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(22.8)}>
        <ToolCard name="From December 1" tagline="Intro price ends Nov 30." chip="2x" at={secToFrame(16.4) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="input /1M" v="$2 → $4" bad />
            <Line k="output /1M" v="$10 → $20" bad />
            <Line k="batch" v="$1/$5 → $2/$10" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(32.3)}>
        <ToolCard name="Flagship output" tagline="Per 1M output tokens." chip="$10" at={secToFrame(22.8) - 2}>
          <Panel>
            <Line k="Gemini 4 Carbon" v="$10" good />
            <Line k="Claude Fable 5.2" v="$40" />
            <Line k="GPT-6 Astra" v="$50" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(37.8)}>
        <ToolCard name="10M output tokens" tagline="Same job, next month." chip="$200" at={secToFrame(32.3) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="November" v="$100" good />
            <Line k="December" v="$200" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="No free tier" tagline="Paid API only." chip="PAID" at={secToFrame(37.8) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="free tier" v="not available" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-139/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="GOOGLE API" lines={lines} />
        <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 650, textAlign: 'center', fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)' }}>
          $4 / $20 from Dec 1.
        </div>
      </AbsoluteFill>
      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short139;
