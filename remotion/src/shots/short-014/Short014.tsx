import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-014 — "Stop Paying $10 Per Million Tokens. This AI Is Free." (replacement
// format, per learnings.md's proven "number + free + money outcome" hook pattern).
// Beats: what it is -> what MIT actually unlocks -> the price proof -> the honesty
// caveat -> loop back to the cover's price contrast. Cover held at frame 0.
// =============================================================================
export const compositionConfig = { id: 'Short014', durationInSeconds: 46.5, fps: 30, width: 1080, height: 1920 };

const HOOK_OUT = secToFrame(4.853); // "It's called Atria Dawn Preview..."
const B1 = HOOK_OUT; // beat 1: Atria Dawn Preview
const B2 = secToFrame(15.186); // "That means you can download it..."
const B3 = secToFrame(22.082); // "Compare that to Claude Fable..." (the price proof slot)
const B4 = secToFrame(31.881); // "The lab says its model beats..." (the honesty beat)
const CTA = secToFrame(42.214); // "Ten dollars versus zero." (loop back to cover)

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Line: React.FC<{ k: string; v: string; good?: boolean; bad?: boolean }> = ({ k, v, good, bad }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400 }}>{k}</span>
    <span style={{ color: good ? COLORS.signalAlt : bad ? COLORS.danger : COLORS.d300, fontWeight: good || bad ? 700 : 400 }}>{v}</span>
  </div>
);

const ProofBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>
    {children}
  </div>
);

const HOOK_KICKER = '$10 PER MILLION TOKENS';
const HOOK_LINES = [{ text: 'THIS AI MODEL' }, { text: 'IS FREE', accent: true }] as const;

const Short014: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      {/* Cover / hook — frame 0 must be a finished poster: full art + full headline, nothing else. */}
      <FadeOut at={B1}>
        <CoverImage src="projects/short-014/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker={HOOK_KICKER} lines={HOOK_LINES} />
      </FadeOut>

      {/* Beat 1 — Atria Dawn Preview: name, size, license, origin. */}
      <FadeOut at={B2}>
        <ToolCard name="Atria Dawn Preview" tagline="A 744B-parameter agentic model from Shanghai AI Lab." chip="744B PARAMS" at={B1 + 4}>
          <ProofBox>
            <Line k="Parameters" v="744B" good />
            <Line k="Base" v="GLM-5.2" />
            <Line k="Lab" v="Shanghai AI Lab" />
          </ProofBox>
        </ToolCard>
      </FadeOut>

      {/* Beat 2 — what MIT actually unlocks. */}
      <FadeOut at={B3}>
        <ToolCard name="MIT License" tagline="Download it, run it, sell products built on it. Zero royalties." chip="$0 ROYALTIES" at={B2 + 4}>
          <ProofBox>
            <Line k="Download" v="Free" good />
            <Line k="Commercial use" v="Allowed" good />
            <Line k="Royalties" v="$0" good />
          </ProofBox>
        </ToolCard>
      </FadeOut>

      {/* Beat 3 — the proof slot: an actual price row, not text alone. */}
      <FadeOut at={B4}>
        <ToolCard name="Price Check" tagline="Same league of model. Wildly different price." chip="$0 VS $10" chipColor={COLORS.signal} at={B3 + 4}>
          <ProofBox>
            <Line k="Claude Fable 5.1" v="$10 / $50 per 1M" />
            <Line k="GPT-6 Astra" v="$10 / $50 per 1M" />
            <Line k="Atria Dawn Preview" v="$0" good />
          </ProofBox>
        </ToolCard>
      </FadeOut>

      {/* Beat 4 — the honesty beat, kept on screen not just in narration. */}
      <FadeOut at={CTA}>
        <ToolCard name="The Catch" tagline="The lab claims a 92.5 BrowseComp score. No outside lab has verified it yet." chip="UNVERIFIED" chipColor={COLORS.danger} at={B4 + 4}>
          <ProofBox>
            <Line k="Self-reported score" v="92.5 BrowseComp" />
            <Line k="Independently verified" v="Not yet" bad />
          </ProofBox>
        </ToolCard>
      </FadeOut>

      {/* Close — resolves back into the cover layout so the loop is seamless. */}
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-014/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker={HOOK_KICKER} lines={HOOK_LINES} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          Ten dollars versus zero. You do the math.
        </div>
      </AbsoluteFill>

      {/* groupSize=4 avoids a trailing solo-word caption page on the closing line
          ("math." alone with no context) — verified against words.json timings. */}
      <CaptionTrack words={WORDS} startAt={24} groupSize={4} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short014;
