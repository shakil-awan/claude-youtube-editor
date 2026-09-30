import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-015 — ChatGPT's new $500 plan (news-jack). Pro 500 spec -> Pro 200 cut -> old limits.
// Frame 0 holds the full cover (art + headline, static, captions off).
// =============================================================================
export const compositionConfig = { id: 'Short015', durationInSeconds: 41.7, fps: 30, width: 1080, height: 1920 };

const B1 = secToFrame(6.896); // "You get twenty five times"
const B2 = secToFrame(14.257); // "Now the twist"
const B3 = secToFrame(29.977); // "Same price. Half the allowance."
const CTA = secToFrame(38.127); // "ChatGPT's new plan costs five hundred dollars."

const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at - 8, at + 2], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

const Row: React.FC<{ label: string; a: string; b: string; bWin?: boolean }> = ({ label, a, b, bWin }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 32 }}>
    <span style={{ color: COLORS.d400, flex: 1 }}>{label}</span>
    <span style={{ color: COLORS.d300, width: 190, textAlign: 'right' }}>{a}</span>
    <span style={{ color: bWin ? COLORS.signalAlt : COLORS.d300, fontWeight: bWin ? 700 : 400, width: 190, textAlign: 'right' }}>{b}</span>
  </div>
);

const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ background: COLORS.d900, borderRadius: 12, padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
);

const HOOK_LINES = [{ text: 'CHATGPT PRO' }, { text: '$500 A MONTH', accent: true }];

const Short015: React.FC = () => {
  const frame = useCurrentFrame();
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });

  return (
    <AbsoluteFill>
      <ShortBg />

      <FadeOut at={B1}>
        <CoverImage src="projects/short-015/cover.png" out={B1 - 10} />
        <HookTitle hold onDark kicker="OPENAI DEVDAY" lines={HOOK_LINES} />
      </FadeOut>

      {/* beat 1 — Pro 500 spec */}
      <FadeOut at={B2}>
        <ToolCard name="Pro 500" tagline="OpenAI's new top ChatGPT tier." chip="$500 / MONTH" at={B1 + 4}>
          <Panel>
            <Row label="price" a="" b="$500/mo" bWin />
            <Row label="usage" a="" b="25x Plus" bWin />
            <Row label="Ultrafast" a="" b="300 tok/s" bWin />
          </Panel>
        </ToolCard>
      </FadeOut>

      {/* beat 2 — Pro 200 before/after */}
      <FadeOut at={B3}>
        <ToolCard name="Pro 200" tagline="Same $200. Smaller allowance from Oct 30." chip="CUT IN HALF" at={B2 + 4}>
          <Panel>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_MONO, fontSize: 26, color: COLORS.d400 }}>
              <span style={{ flex: 1 }} />
              <span style={{ width: 190, textAlign: 'right' }}>BEFORE</span>
              <span style={{ width: 190, textAlign: 'right', color: COLORS.signalAlt }}>AFTER</span>
            </div>
            <Row label="Codex usage" a="20x Plus" b="10x Plus" bWin />
            <Row label="Pro chat/wk" a="200" b="100" bWin />
          </Panel>
        </ToolCard>
      </FadeOut>

      {/* beat 3 — where the old limits live */}
      <FadeOut at={CTA}>
        <ToolCard name="Old limits, or more" tagline="Now that costs $500 a month." chip="PRICE 2.5x" at={B3 + 4}>
          <Panel>
            <Row label="Pro 200" a="" b="$200/mo" />
            <Row label="Pro 500" a="" b="$500/mo" bWin />
          </Panel>
        </ToolCard>
      </FadeOut>

      {/* close — back to the cover for a seamless loop */}
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-015/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="OPENAI DEVDAY" lines={HOOK_LINES} />
        <div style={{
          position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center',
          fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)',
        }}>
          And the $200 one got cut.
        </div>
      </AbsoluteFill>

      {frame < secToFrame(WORDS[WORDS.length - 1].end_s) && <CaptionTrack words={WORDS} />}
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short015;
