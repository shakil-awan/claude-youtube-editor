import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../../brand';
import { FONT_DISPLAY } from '../../fonts';

// =============================================================================
// ChannelAvatar — the channel profile picture, rendered from the brand contract.
// 800×800; YouTube circle-crops it, so everything important stays well inside a
// centered circle. Render: npx remotion still ChannelAvatar --frame=0 out/avatar.png
// Regenerate whenever /brand-setup changes the palette or wordmark.
// =============================================================================
export const compositionConfig = { id: 'ChannelAvatar', durationInSeconds: 0.2, fps: 30, width: 800, height: 800 };

const ChannelAvatar: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.accent, alignItems: 'center', justifyContent: 'center' }}>
    {/* soft depth: gold glow low-right, teal glow up-left — the brand gradient as light */}
    <AbsoluteFill style={{ background: `radial-gradient(560px 560px at 78% 82%, ${COLORS.accent2}55, transparent 60%)` }} />
    <AbsoluteFill style={{ background: `radial-gradient(560px 560px at 20% 16%, ${COLORS.signal}66, transparent 60%)` }} />
    <div style={{
      fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 300, letterSpacing: -14,
      color: COLORS.paper, display: 'flex', alignItems: 'baseline', zIndex: 1,
    }}>
      T<span style={{ color: '#FCD34D' }}>M</span>
    </div>
    {/* the "minted" tick — a coin edge under the monogram */}
    <div style={{ width: 260, height: 14, borderRadius: 999, background: COLORS.paper, opacity: 0.9, marginTop: 8, zIndex: 1 }} />
  </AbsoluteFill>
);
export default ChannelAvatar;
