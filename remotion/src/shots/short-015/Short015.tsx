import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// short-015 — "Google's New AI Costs $2 Now. $4 Later." (news-jack, Gemini 4 Argon)
export const compositionConfig = { id: 'Short015', durationInSeconds: 40.7, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(7.1); // "Right now it costs…"
const B2 = secToFrame(18.5); // "Later, it doubles."
const B3 = secToFrame(23.3); // "And you cannot use it yet."
const B4 = secToFrame(28.8); // "The upside…"
const CTA = secToFrame(34.0); // "So today's price is a preview."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean; bad?: boolean }> = ({ k, v, good, bad }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: bad ? COLORS.danger : good ? COLORS.signalAlt : COLORS.d300, fontWeight: good || bad ? 700 : 400 }}>{v}</span>
  </div>
);
const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
);

const Short015: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const hook = { kicker: 'INTRO PRICE', lines: [{ text: '$2 NOW' }, { text: '$4 LATER', accent: true }] };

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-015/cover.png" out={B1 - 10} />
        <HookTitle hold onDark {...hook} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="Gemini 4 Argon" tagline="Google's new frontier model, intro pricing." chip="TODAY" at={B1 + 4}>
          <Panel>
            <Line k="input / 1M tokens" v="$2" good />
            <Line k="output / 1M tokens" v="$10" good />
            <Line k="cached input" v="95% off" />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="Then it doubles" tagline="Google's own post: rates rise after intro." chip="LATER" at={B2 + 4} chipColor={COLORS.danger}>
          <Panel>
            <Line k="input / 1M tokens" v="$4" bad />
            <Line k="output / 1M tokens" v="$20" bad />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B4}>
        <ToolCard name="Not open yet" tagline="Cyber defenders first. No public date." chip="ACCESS" at={B3 + 4} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="rollout" v="Fairwind program" />
            <Line k="public API" v="no date" bad />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="The upside" tagline="Output limit jumps to a million tokens." chip="1M OUT" at={B4 + 4}>
          <Panel>
            <Line k="before" v="64K output" />
            <Line k="Argon" v="1M output" good />
          </Panel>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-015/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} {...hook} />
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short015;
