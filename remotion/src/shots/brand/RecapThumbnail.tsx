import React from 'react';
import { AbsoluteFill, Img, getInputProps, staticFile } from 'remotion';
import { BRAND, COLORS, GRADIENT } from '../../brand';
import { FONT_DISPLAY, FONT_MONO } from '../../fonts';

// =============================================================================
// RecapThumbnail — the LANDSCAPE (16:9) thumbnail for long-form: the weekly
// recap video. Same system as ShortThumbnail (model paints the art, Remotion
// sets the type + the ToolMint mark), laid out for a 16:9 shelf: headline left,
// art breathing right, mark bottom-left.
//
// Render:
//   npx remotion still RecapThumbnail out/t.png --props='{"art":"projects/recap-001/thumb-art.png",
//     "line1":"7 AI TOOLS","line2":"THAT MATTERED","accent":"line1","kicker":"THIS WEEK"}'
//
// 1920x1080 — well above YouTube's 1280x720 recommendation.
// =============================================================================
export const compositionConfig = { id: 'RecapThumbnail', durationInSeconds: 0.2, fps: 30, width: 1920, height: 1080 };

type Props = { art?: string; line1?: string; line2?: string; accent?: 'line1' | 'line2' | 'none'; kicker?: string };

const RecapThumbnail: React.FC = () => {
  const p = getInputProps() as Props;
  const art = p.art;
  const line1 = p.line1 ?? 'HEADLINE';
  const line2 = p.line2;
  const accent = p.accent ?? 'line1';
  const kicker = p.kicker ?? 'THIS WEEK';

  const lineStyle = (isAccent: boolean): React.CSSProperties => ({
    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 132, lineHeight: 0.98,
    letterSpacing: -3, margin: 0,
    color: isAccent ? COLORS.signalAlt : '#ffffff',
    textShadow: '0 8px 40px rgba(0,0,0,0.85), 0 2px 10px rgba(0,0,0,0.9)',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {art ? <Img src={staticFile(art)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}

      {/* scrim: dark on the left where the type lives, clearing to the art on the right */}
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(6,14,10,0.94) 0%, rgba(6,14,10,0.82) 42%, rgba(6,14,10,0.25) 68%, rgba(6,14,10,0.15) 100%)' }} />

      <div style={{ position: 'absolute', top: 150, left: 96, width: 1120, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 34, letterSpacing: 8, color: COLORS.accent2, fontWeight: 700, marginBottom: 22 }}>
          {kicker}
        </div>
        <h1 style={lineStyle(accent === 'line1')}>{line1}</h1>
        {line2 ? <h1 style={lineStyle(accent === 'line2')}>{line2}</h1> : null}
        <div style={{ width: 300, height: 12, borderRadius: 999, background: GRADIENT, marginTop: 34 }} />
      </div>

      {/* the ToolMint mark */}
      <div style={{
        position: 'absolute', bottom: 74, left: 96,
        display: 'flex', alignItems: 'center', gap: 16,
        background: 'rgba(6,14,10,0.72)', border: `3px solid ${COLORS.accent}`,
        borderRadius: 999, padding: '16px 38px',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, background: COLORS.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 30, color: '#ffffff', letterSpacing: -1,
        }}>
          T<span style={{ color: '#FCD34D' }}>M</span>
        </div>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 46, letterSpacing: -1 }}>
          <span style={{ color: '#ffffff' }}>{BRAND.wordmark[0]}</span>
          <span style={{ color: COLORS.signalAlt }}>{BRAND.wordmark[1]}</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
export default RecapThumbnail;
