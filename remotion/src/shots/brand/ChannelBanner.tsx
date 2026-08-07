import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BRAND, COLORS, GRADIENT } from '../../brand';
import { FONT_BODY, FONT_DISPLAY, FONT_MONO } from '../../fonts';

// =============================================================================
// ChannelBanner — YouTube channel art, rendered from the brand contract.
// 2560×1440 with EVERYTHING important inside YouTube's guaranteed-visible safe
// area: a centered 1235×338 box (TV shows all of it, desktop ~2560×423, mobile
// only the safe box). Render: npx remotion still ChannelBanner --frame=0 out/banner.png
// =============================================================================
export const compositionConfig = { id: 'ChannelBanner', durationInSeconds: 0.2, fps: 30, width: 2560, height: 1440 };

const ChannelBanner: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.paper, alignItems: 'center', justifyContent: 'center' }}>
    <AbsoluteFill style={{ background: `radial-gradient(1400px 900px at 50% -10%, ${COLORS.accent}1f, transparent 60%)` }} />
    <AbsoluteFill style={{ backgroundImage: `radial-gradient(${COLORS.line} 2px, transparent 2px)`, backgroundSize: '56px 56px', opacity: 0.5 }} />

    {/* safe 1235×338 box centered at (1280, 720) — all content lives inside it */}
    <div style={{ width: 1235, height: 338, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, zIndex: 1 }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 150, letterSpacing: -4, lineHeight: 1 }}>
        <span style={{ color: COLORS.ink }}>{BRAND.wordmark[0]}</span>
        <span style={{ color: COLORS.accent }}>{BRAND.wordmark[1]}</span>
        <span style={{ color: COLORS.ink }}>{BRAND.wordmark[2]}</span>
      </div>
      <div style={{ width: 560, height: 10, borderRadius: 999, background: GRADIENT }} />
      <div style={{ fontFamily: FONT_BODY, fontWeight: 600, fontSize: 44, color: COLORS.muted }}>
        One money-making AI tool. Every day.
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 28, letterSpacing: 4, color: COLORS.signal, fontWeight: 700 }}>
        NEW SHORT DAILY · 11AM &amp; 5PM ET
      </div>
    </div>
  </AbsoluteFill>
);
export default ChannelBanner;
