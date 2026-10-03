import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-013 — Cloudflare Clef (news-jack, launched 2026-10-01).
// Beats: what it does (ticket triage) -> 209 ms vs 524 ms -> Apache 2.0 -> loop to cover.
// =============================================================================
export const compositionConfig = { id: 'Short013', durationInSeconds: 30.9, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(4.0); // "It's called Clef"
const B2 = secToFrame(10.6); // "It answers in about two hundred ms"
const B3 = secToFrame(18.2); // "The weights are Apache…"
const CTA = secToFrame(25.9); // "Cloudflare just open sourced the free AI…"

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
);
const Line: React.FC<{ k: string; v: string; good?: boolean }> = ({ k, v, good }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : COLORS.d300, fontWeight: good ? 700 : 400 }}>{v}</span>
  </div>
);

const Bar: React.FC<{ label: string; ms: number; max: number; color: string; at: number }> = ({ label, ms, max, color, at }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [at, at + 24], [0, ms / max], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32, color: COLORS.d300 }}>
        <span>{label}</span><span style={{ color, fontWeight: 700 }}>{ms} ms</span>
      </div>
      <div style={{ height: 30, background: COLORS.d800, borderRadius: 8 }}>
        <div style={{ height: '100%', width: `${w * 100}%`, background: color, borderRadius: 8 }} />
      </div>
    </div>
  );
};

const Short013: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const HOOK = [{ text: 'FREE AI THAT' }, { text: 'SORTS YOUR WORK', accent: true }] as const;

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-013/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="CLOUDFLARE CLEF" lines={HOOK} fontSize={104} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="Clef" tagline="Is it urgent? Which team takes it?" chip="OPEN SOURCE" at={B1 + 4}>
          <Panel>
            <Line k="message" v="“refund me NOW”" />
            <Line k="urgent" v="yes" good />
            <Line k="route to" v="billing" good />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="Median speed" tagline="Over 2x faster than the rival it tested." chip="2.5x" at={B2 + 4} chipColor={COLORS.accent2}>
          <Panel>
            <Bar label="Clef" ms={209} max={524} color={COLORS.signalAlt} at={B2 + 10} />
            <Bar label="Rival (Jev)" ms={524} max={524} color={COLORS.d400} at={B2 + 10} />
          </Panel>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="Run it yourself" tagline="Weights on Hugging Face. Or use Workers AI." chip="APACHE 2.0" at={B3 + 4}>
          <Panel>
            <Line k="license" v="Apache 2.0" good />
            <Line k="weights" v="Hugging Face" />
            <Line k="hosted" v="Workers AI" />
          </Panel>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-013/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="CLOUDFLARE CLEF" lines={HOOK} fontSize={104} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 560, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Triage in about 209 ms.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short013;
