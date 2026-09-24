import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { COLORS, EASINGS } from '../../brand';
import { FONT_DISPLAY, FONT_MONO, FONT_BODY } from '../../fonts';
import { CLAMP } from '../../lib/kit';
import { WebBrowserFrame } from '../../lib/browser';
import {
  CaptionTrack, CoverImage, CountBadge, HookTitle, ProgressBar, SAFE, ShortBg, ToolCard, Watermark, secToFrame,
} from '../../lib/shorts';
import { WORDS } from './words';

// =============================================================================
// short-015 — "Reclaim is free forever. Motion costs nineteen a month."
// Versus format: HOOK -> Beat1 (Reclaim) -> Beat2 (Motion) -> Beat3 (Reclaim's
// catch) -> Beat4 (verdict) -> LOOP back to the cover.
// All beat boundaries are cut from videos/short-015/work/voiceover/words.json
// (copied verbatim into ./words.ts) — never eyeballed.
// =============================================================================
export const compositionConfig = { id: 'Short015', durationInSeconds: 48.2, fps: 30, width: 1080, height: 1920 };

const COVER = 'projects/short-015/cover.png';

// ---- beat boundaries (frames @30fps), cut from the word timestamps ----------
// "Reclaim is free forever. Motion costs nineteen dollars a month." (0 -> 4.249s)
const HOOK_OUT = secToFrame(4.8); // 144 — before "Reclaim's free Lite plan" (5.062s)

// "Reclaim's free Lite plan gives you five AI agents that auto block your
// focus time, habits, and tasks, synced to one calendar." (5.062 -> 13.154s)
const B1_IN = secToFrame(4.9); // 147
const B1_OUT = secToFrame(13.5); // 405 — before "Motion skips" (13.851s)

// "Motion skips the free plan entirely. Nineteen dollars a month buys AI
// meeting notes, task planning, and docs on top of your calendar." (13.851 -> 22.639s)
const B2_IN = secToFrame(13.6); // 408
const B2_OUT = secToFrame(23.0); // 690 — before "Reclaim's catch" (23.243s)

// "Reclaim's catch, the free tier only plans one week ahead and syncs a
// single calendar." (23.243 -> 28.862s)
const B3_IN = secToFrame(23.1); // 693
const B3_OUT = secToFrame(29.3); // 879 — before "So if you just need" (29.559s)

// "So if you just need smart time blocking, Reclaim saves you nineteen
// dollars a month, forever. If you run a team and need docs plus time
// tracking, Motion's fee earns its keep." (29.559 -> 40.588s)
const B4_IN = secToFrame(29.4); // 882
const B4_OUT = secToFrame(41.1); // 1233 — before "Reclaim is still free" (41.401s)

// "Reclaim is still free. Motion is still nineteen. Try the free one
// first." (41.401 -> 47.647s) — loop back to the cover.
const LOOP_IN = secToFrame(41.2); // 1236

// fade a beat OUT smoothly so the next one hands off cleanly
const FadeOut: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = 1 - interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeIn });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// fade a beat IN and hold — used for the loop-back so the LAST frame is a
// static, fully-opaque poster (the shelf/last-frame QA gate), never mid-fade.
const FadeIn: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at, at + 10], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  return <AbsoluteFill style={{ opacity: op }}>{children}</AbsoluteFill>;
};

// compact cropped pricing-table proof slot, built on WebBrowserFrame — the
// fake-screencast technique short.md calls for instead of a real recording.
const PlanProof: React.FC<{
  url: string; tabTitle: string; appearAt: number; cols: [string, string];
  rows: { label: string; a: string; b: string; hot?: boolean }[];
}> = ({ url, tabTitle, appearAt, cols, rows }) => (
  <div style={{ position: 'relative', width: 856, height: 300 }}>
    <WebBrowserFrame url={url} tabTitle={tabTitle} box={{ x: 0, y: 0, w: 856, h: 300 }} appearAt={appearAt} uiScale={1.15}>
      <div style={{ width: 856, fontFamily: FONT_MONO, background: '#fff' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5', background: '#fafafa', fontWeight: 700, fontSize: 24, color: '#595959' }}>
          <div style={{ flex: 1.3, padding: '14px 20px' }}>Plan</div>
          <div style={{ flex: 1, padding: '14px 20px' }}>{cols[0]}</div>
          <div style={{ flex: 1, padding: '14px 20px' }}>{cols[1]}</div>
        </div>
        {rows.map((r) => (
          <div key={r.label} style={{
            display: 'flex', borderBottom: '1px solid #eee', fontSize: 26,
            background: r.hot ? `${COLORS.accent}14` : '#fff',
          }}>
            <div style={{ flex: 1.3, padding: '16px 20px', fontWeight: r.hot ? 700 : 500, color: r.hot ? COLORS.accent : '#1d1d1d' }}>{r.label}</div>
            <div style={{ flex: 1, padding: '16px 20px', fontWeight: r.hot ? 700 : 500, color: r.hot ? COLORS.accent : '#1d1d1d' }}>{r.a}</div>
            <div style={{ flex: 1, padding: '16px 20px', fontWeight: r.hot ? 700 : 500, color: r.hot ? COLORS.accent : '#1d1d1d' }}>{r.b}</div>
          </div>
        ))}
      </div>
    </WebBrowserFrame>
  </div>
);

// one row of the verdict panel — a name, the situation, and the chip.
const VerdictRow: React.FC<{ at: number; who: string; situation: string; chip: string; chipColor: string }> = ({ at, who, situation, chip, chipColor }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [at, at + 12], [0, 1], { ...CLAMP, easing: EASINGS.easeOut });
  const y = interpolate(frame, [at, at + 16], [40, 0], { ...CLAMP, easing: EASINGS.easeOut });
  return (
    <div style={{
      opacity: op, transform: `translateY(${y}px)`,
      background: COLORS.paper, border: `2px solid ${COLORS.line}`, borderRadius: 16,
      padding: '26px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
    }}>
      <div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 40, color: COLORS.ink }}>{who}</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 28, color: COLORS.muted, marginTop: 4 }}>{situation}</div>
      </div>
      <div style={{
        background: chipColor, color: COLORS.paper, borderRadius: 999,
        fontFamily: FONT_MONO, fontWeight: 700, fontSize: 30, padding: '12px 26px', whiteSpace: 'nowrap',
      }}>
        {chip}
      </div>
    </div>
  );
};

const Short015: React.FC = () => {
  return (
    <AbsoluteFill>
      <ShortBg />

      {/* ---- cover / HOOK (frame 0 = the feed poster) ---- */}
      <CoverImage src={COVER} at={0} out={HOOK_OUT} />
      <FadeOut at={HOOK_OUT}>
        <HookTitle
          hold
          onDark
          kicker="RECLAIM VS MOTION"
          lines={[{ text: 'FREE', accent: true }, { text: 'vs $19/month' }]}
        />
      </FadeOut>

      {/* ---- Beat 1: Reclaim.ai ---- */}
      <FadeOut at={B1_OUT}>
        <CountBadge n={1} of={2} at={B1_IN} color={COLORS.accent} />
        <ToolCard
          name="Reclaim.ai"
          tagline="Free, forever — smart time blocking."
          chip="FREE"
          chipColor={COLORS.signal}
          at={B1_IN + 4}
        >
          <PlanProof
            url="reclaim.ai/pricing"
            tabTitle="Pricing · Reclaim.ai"
            appearAt={B1_IN + 14}
            cols={['Price', 'Calendars']}
            rows={[
              { label: 'Lite', a: '$0', b: '1', hot: true },
              { label: 'Starter', a: '$10/mo', b: 'Unlimited' },
            ]}
          />
        </ToolCard>
      </FadeOut>

      {/* ---- Beat 2: Motion ---- */}
      <FadeOut at={B2_OUT}>
        <CountBadge n={2} of={2} at={B2_IN} color={COLORS.accent2} />
        <ToolCard
          name="Motion"
          tagline="No free plan — AI docs & meeting notes."
          chip="$19/mo"
          chipColor={COLORS.accent2}
          at={B2_IN + 4}
        >
          <PlanProof
            url="usemotion.com/pricing"
            tabTitle="Pricing · Motion"
            appearAt={B2_IN + 14}
            cols={['Price', 'AI docs']}
            rows={[
              { label: 'Free', a: '—', b: 'No' },
              { label: 'Pro AI', a: '$19/mo', b: 'Yes', hot: true },
            ]}
          />
        </ToolCard>
      </FadeOut>

      {/* ---- Beat 3: Reclaim's catch ---- */}
      <FadeOut at={B3_OUT}>
        <ToolCard
          name="Reclaim.ai"
          tagline="Free tier: 1 week ahead, 1 calendar."
          chip="THE CATCH"
          chipColor={COLORS.warn}
          at={B3_IN + 4}
        />
      </FadeOut>

      {/* ---- Beat 4: verdict ---- */}
      <FadeOut at={B4_OUT}>
        <div style={{ position: 'absolute', left: SAFE.side, right: SAFE.side, top: SAFE.top + 200, display: 'flex', flexDirection: 'column', gap: 26 }}>
          <VerdictRow at={B4_IN + 4} who="Solo, just time-blocking" situation="Reclaim saves the full $19/mo." chip="FREE" chipColor={COLORS.signal} />
          <VerdictRow at={B4_IN + 40} who="Team, docs + tracking" situation="Motion's fee earns its keep." chip="$19/mo" chipColor={COLORS.accent2} />
        </div>
      </FadeOut>

      {/* ---- LOOP: back to the cover for the seamless replay ---- */}
      <FadeIn at={LOOP_IN}>
        <CoverImage src={COVER} at={LOOP_IN} />
        <HookTitle
          hold
          onDark
          kicker="RECLAIM VS MOTION"
          lines={[{ text: 'FREE', accent: true }, { text: 'vs $19/month' }]}
        />
      </FadeIn>

      <ProgressBar />
      <Watermark />
      {/* captions hidden once the loop returns to the cover — CaptionTrack's
          default ink color vanishes on dark cover art, and a caption burning
          across the closing poster would defeat the loop. */}
      <FadeOut at={LOOP_IN}>
        <CaptionTrack words={WORDS} startAt={24} />
      </FadeOut>
    </AbsoluteFill>
  );
};
export default Short015;
