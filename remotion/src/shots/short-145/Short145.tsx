import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-145: ChatGPT Pro/Business monthly API credits (announced Oct 28, 2026).
// (developers.openai.com/api/docs/guides/chatgpt-api-credits, 2026-11-14).
export const compositionConfig = { id: 'Short145', durationInSeconds: 47.4, fps: 30, width: 1080, height: 1920 };

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

const B1 = 5.3; // "Pay two hundred"
const B2 = 18.6; // "They work across the API"
const B3 = 26.4; // "So what's the catch?"
const B4 = 33.6; // "Business gets"
const END = 44.2; // "Pay two hundred, get two hundred back."

const Short145: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(END);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'PAY $200' }, { text: 'GET $200 BACK', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(B1)}>
        <CoverImage src="projects/short-145/cover.png" out={secToFrame(B1) - 10} />
        <HookTitle hold onDark kicker="CHATGPT PRO API CREDITS" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(B2)}>
        <ToolCard name="ChatGPT Pro" tagline="Plan price back as API credits. Monthly." chip="1:1" at={secToFrame(B1) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="Pro $100 /mo" v="$100 credits" good />
            <Line k="Pro $200 /mo" v="$200 credits" good />
            <Line k="Pro $500 /mo" v="$500 credits" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B3)}>
        <ToolCard name="Where it works" tagline="OpenAI API Platform." chip="API" at={secToFrame(B2) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="Responses + Agents" v="yes" good />
            <Line k="Realtime + Images" v="yes" good />
            <Line k="web search, files" v="yes" good />
            <Line k="Codex via API key" v="no" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(B4)}>
        <ToolCard name="The catch" tagline="Use it or lose it." chip="EXPIRES" at={secToFrame(B3) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="unused credits" v="expire each cycle" bad />
            <Line k="rollover" v="none" bad />
            <Line k="subscription age" v="7+ days" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="Business + the rest" tagline="Per month, pooled per workspace." chip="$500 CAP" at={secToFrame(B4) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="Standard seat" v="$20" good />
            <Line k="Premium seat" v="$100" good />
            <Line k="workspace cap" v="$500" />
            <Line k="Plus / Go / Free" v="$0" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-145/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="CHATGPT PRO API CREDITS" lines={lines} />
      </AbsoluteFill>
      <FadeOut at={secToFrame(47.0)}>
        <CaptionTrack words={WORDS} />
      </FadeOut>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short145;
