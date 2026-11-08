import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_BODY, FONT_MONO } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { CaptionTrack, CoverImage, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame } from '../../lib/shorts';
import { WORDS } from './words';

export const compositionConfig = { id: 'Short127', durationInSeconds: 36.8, fps: 30, width: 1080, height: 1920 };

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

const Short127: React.FC = () => {
  const frame = useCurrentFrame();
  const CTA = secToFrame(33.3);
  const ctaOp = interpolate(frame, [CTA, CTA + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const lines = [{ text: 'VIDEO AI DROPS' }, { text: 'TO 7¢ A SECOND', accent: true }];
  return (
    <AbsoluteFill>
      <ShortBg />
      <FadeOut at={secToFrame(3.5)}>
        <CoverImage src="projects/short-127/cover.png" out={secToFrame(3.5) - 10} />
        <HookTitle hold onDark kicker="GEMINI OMNI" lines={lines} />
      </FadeOut>
      <FadeOut at={secToFrame(9.9)}>
        <ToolCard name="Omni 1.1 Flash" tagline="Video output today." chip="$17.50" at={secToFrame(3.5) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="video out /1M" v="$17.50" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(13.3)}>
        <ToolCard name="One second of video" tagline="720p, 5,792 tokens." chip="~10¢" at={secToFrame(9.9) - 2}>
          <Panel>
            <Line k="tokens /sec" v="5,792" />
            <Line k="cost /sec" v="~$0.10" bad />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(17.9)}>
        <ToolCard name="December 3, 2026" tagline="1.1 reroutes to 1.2." chip="DEC 3" at={secToFrame(13.3) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="requests to" v="Omni 1.1 Flash" />
            <Line k="billed as" v="Omni 1.2 Flash" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(21.8)}>
        <ToolCard name="Omni 1.2 Flash" tagline="Video output." chip="$12.00" at={secToFrame(17.9) - 2}>
          <Panel>
            <Line k="video out /1M" v="$12.00" good />
            <Line k="cost /sec" v="~$0.07" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(27.0)}>
        <ToolCard name="Everything else" tagline="Same on both." chip="SAME" at={secToFrame(21.8) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="text out /1M" v="$9.00" />
            <Line k="input /1M" v="$1.50" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={secToFrame(31.0)}>
        <ToolCard name="One minute of video" tagline="Rounded." chip="-30%" at={secToFrame(27.0) - 2}>
          <Panel>
            <Line k="Omni 1.1" v="~$6.00" bad />
            <Line k="Omni 1.2" v="~$4.20" good />
          </Panel>
        </ToolCard>
      </FadeOut>
      <FadeOut at={CTA}>
        <ToolCard name="Reroutes on its own" tagline="No code changes." chip="AUTO" at={secToFrame(31.0) - 2} chipColor={COLORS.accent2}>
          <Panel>
            <Line k="effective" v="Dec 3, 2026" />
          </Panel>
        </ToolCard>
      </FadeOut>
      <AbsoluteFill style={{ opacity: ctaOp }}>
        <CoverImage src="projects/short-127/cover.png" at={CTA} />
        <HookTitle hold onDark at={CTA} kicker="GEMINI OMNI" lines={lines} />
        <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 520, textAlign: 'center', fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,0.82)' }}>
          Google's video AI drops to 7¢ a second.
        </div>
      </AbsoluteFill>
      <CaptionTrack words={WORDS} />
      <Watermark at={12} />
      <ProgressBar />
    </AbsoluteFill>
  );
};
export default Short127;
