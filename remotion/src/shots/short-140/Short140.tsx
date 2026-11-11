import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-140: GPT-6 Cyber $20/$100 vs GPT-6 Astra $10/$50 (OpenAI pricing page, 2026-11-11).
// Cover held at frame 0; closes on the cover so the loop is seamless.
export const compositionConfig = { id: 'Short140', durationInSeconds: 39.4, fps: 30, width: 1080, height: 1920 };

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

const Short140: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(35.6);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'GPT-6 CYBER' }, { text: '2x ASTRA', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(3.5)}>
        <CoverImage src="projects/short-140/cover.png" out={secToFrame(3.5) - 10} />
        <HookTitle hold onDark kicker="OPENAI API" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(10.4)}>
        <ToolCard name="GPT-6 Cyber" tagline="Security-tuned." chip="$20/$100" at={secToFrame(3.5) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="input /1M" v="$20" bad />
            <Line k="cached /1M" v="$2" />
            <Line k="output /1M" v="$100" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(15.2)}>
        <ToolCard name="GPT-6 Astra" tagline="The flagship." chip="$10/$50" at={secToFrame(10.4) - 2}>
          <Panel>
            <Line k="input /1M" v="$10" good />
            <Line k="cached /1M" v="$1" />
            <Line k="output /1M" v="$50" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(17.6)}>
        <ToolCard name="Double the bill" tagline="Same family." chip="2x" at={secToFrame(15.2) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="Cyber" v="$20 / $100" bad />
            <Line k="Astra" v="$10 / $50" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(25.2)}>
        <ToolCard name="Past 272K tokens" tagline="Long prompts cost more." chip="$150" at={secToFrame(17.6) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="input /1M" v="$20 → $40" bad />
            <Line k="output /1M" v="$100 → $150" bad />
            <Line k="context" v="1.05M tokens" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(30.9)}>
        <ToolCard name="Gated access" tagline="No self-serve sign-up." chip="APPROVAL" at={secToFrame(25.2) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="requires" v="Daybreak Red" />
            <Line k="plus" v="OpenAI approval" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="GPT-5.6 Cyber" tagline="Last generation." chip="$12.50/$75" at={secToFrame(30.9) - 2}>
          <Panel>
            <Line k="input /1M" v="$12.50" />
            <Line k="output /1M" v="$75" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-140/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="OPENAI API" lines={lines} />
        <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center', fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)' }}>
          $100 out vs Astra's $50.
        </div>
      </AbsoluteFill>
      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short140;
