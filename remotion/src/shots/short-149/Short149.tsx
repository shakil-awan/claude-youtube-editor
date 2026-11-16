import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-149: embeddings per 1M tokens: OpenAI text-embedding-3-small $0.02, 3-large $0.13; Gemini Embedding 2 text $0.20 (Batch $0.10, free tier free),
// image $0.00012 each, audio $0.00016/s, video $0.00079/frame (developers.openai.com/api/docs/pricing, aistudio.google.com/docs/pricing, 2026-11-16).
export const compositionConfig = { id: 'Short149', durationInSeconds: 42.4, fps: 30, width: 1080, height: 1920 };
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


const END = 37.7;

const Short149: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(END);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'EMBEDDINGS' }, { text: '2¢ VS 20¢', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(7.5)}>
        <CoverImage src="projects/short-149/cover.png" out={secToFrame(7.5) - 10} />
        <HookTitle hold onDark kicker="OPENAI VS GOOGLE" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(13.9)}>
        <ToolCard name="OpenAI embeddings" tagline="Text, per 1M tokens." chip="2¢" at={secToFrame(7.5) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="3-small" v="$0.02" good />
            <Line k="3-large" v="$0.13" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(17.3)}>
        <ToolCard name="Gemini Embedding 2" tagline="Text, per 1M tokens." chip="10x" at={secToFrame(13.9) - 2} chipColor={COLORS.danger}>
          <Panel>
            <Line k="OpenAI 3-small" v="$0.02" />
            <Line k="Gemini Emb 2" v="$0.20" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(20.4)}>
        <ToolCard name="Why pay 10x?" tagline="Same job: text into vectors." chip="?" at={secToFrame(17.3) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="OpenAI" v="$0.02" />
            <Line k="Google" v="$0.20" />
            <Line k="gap" v="10x" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(26.9)}>
        <ToolCard name="Gemini Embedding 2" tagline="Free tier, then Batch halves it." chip="FREE" at={secToFrame(20.4) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="free tier" v="$0" good />
            <Line k="paid" v="$0.20" />
            <Line k="batch" v="$0.10" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(34.3)}>
        <ToolCard name="One vector space" tagline="Images, audio and video too." chip="MULTIMODAL" at={secToFrame(26.9) - 2} chipColor={COLORS.signalAlt}>
          <Panel>
            <Line k="per image" v="$0.00012" good />
            <Line k="per audio sec" v="$0.00016" />
            <Line k="per video frame" v="$0.00079" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="The verdict" tagline="Text only? OpenAI. Everything? Gemini." chip="2¢ / 20¢" at={secToFrame(34.3) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="OpenAI 3-small" v="text only" />
            <Line k="Gemini Emb 2" v="text+image+audio+video" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-149/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="OPENAI VS GOOGLE" lines={lines} />
      </AbsoluteFill>
      <FadeOut at={secToFrame(41.9)}>
        <CaptionTrack words={WORDS} />
      </FadeOut>
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short149;
