import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-013 — "LLM Gateway's free Smart Routing: one call, up to 30 models,
// no platform fee" (news-jack, named product + hard number, per learnings.md).
// Beats: SETUP (what it is, 30->1 diagram) -> REVEAL (routing is free) ->
// TWIST (optional classifier fee + launch/beta facts) -> loop back to hook.
// Cover held at frame 0 for the shelf tile; last beat resolves back into it.
// =============================================================================
export const compositionConfig = { id: 'Short013', durationInSeconds: 37.05, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(4.586); // "It's called Smart Routing..."
const B2 = secToFrame(15.557); // "The routing itself costs nothing..."
const B3 = secToFrame(24.81); // "It launched September twenty fifth..."
const CTA = secToFrame(31.184); // "If you're burning money..."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean; warn?: boolean }> = ({ k, v, good, warn }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: warn ? COLORS.accent2 : good ? COLORS.signalAlt : COLORS.d300, fontWeight: good || warn ? 700 : 400 }}>{v}</span>
  </div>
);

// A "30 models -> 1 bill" diagram: a grid of small model tokens converging,
// via an arrow, into a single highlighted result chip. Frame-based only.
const RouteDiagram: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const dotsOp = interpolate(frame, [at, at + 14], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const arrowOp = interpolate(frame, [at + 12, at + 24], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const chipPop = interpolate(frame, [at + 20, at + 32], [0.8, 1], { ...CLAMP, easing: EASINGS.overshoot });
  const chipOp = interpolate(frame, [at + 20, at + 32], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <div style={{ background: COLORS.d900, borderRadius: 12, padding: '28px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, opacity: dotsOp }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 4, background: i % 2 === 0 ? COLORS.accent : COLORS.accent2 }} />
        ))}
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 44, color: COLORS.d400, opacity: arrowOp }}>→</div>
      <div style={{
        opacity: chipOp, transform: `scale(${chipPop})`,
        background: COLORS.signal, color: COLORS.paper, borderRadius: 14,
        padding: '18px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        boxShadow: `0 10px 26px ${COLORS.signal}55`,
      }}>
        <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 40 }}>1</div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 18, letterSpacing: 1 }}>BILL</div>
      </div>
    </div>
  );
};

const Short013: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-013/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="NEW: FREE ROUTING" lines={[{ text: 'TEST 30 MODELS' }, { text: 'BILLED FOR ONE', accent: true }]} />
      </FadeOut>

      <FadeOut at={B2}>
        <ToolCard name="Smart Routing" tagline="One request, tested across up to 30 models — it picks for you." chip="NEW" at={B1 + 4}>
          <RouteDiagram at={B1 + 4} />
        </ToolCard>
      </FadeOut>

      <FadeOut at={B3}>
        <ToolCard name="The bill" tagline="Routing itself is free. You only pay for the model it picks." chip="FREE" at={B2 + 4} chipColor={COLORS.signal}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="platform fee" v="$0" good />
            <Line k="model it picks" v="you pay" />
          </div>
        </ToolCard>
      </FadeOut>

      <FadeOut at={CTA}>
        <ToolCard name="Fine print" tagline="Turn on the classifier and a small fee applies." chip="OPT-IN FEE" at={B3 + 4} chipColor={COLORS.accent2}>
          <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Line k="classifier" v="optional" warn />
            <Line k="launched" v="Sep 25, 2026" />
            <Line k="access" v="open beta, all orgs" good />
          </div>
        </ToolCard>
      </FadeOut>

      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-013/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="NEW: FREE ROUTING" lines={[{ text: 'TEST 30 MODELS' }, { text: 'BILLED FOR ONE', accent: true }]} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Stop overpaying by default.
        </div>
      </AbsoluteFill>

      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short013;
