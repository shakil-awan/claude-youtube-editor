import React from 'react';
import { AbsoluteFill, Img, getInputProps, staticFile } from 'remotion';
import { BRAND, COLORS, GRADIENT } from '../../brand';
import { FONT_DISPLAY, FONT_MONO } from '../../fonts';

// =============================================================================
// ShortThumbnail — the VERTICAL (9:16) thumbnail for a Short, composed here
// rather than inside the image model. The model paints the art; Remotion sets
// the type, so headlines are never garbled/misspelled and the ToolMint mark is
// pixel-exact brand, on every thumbnail.
//
// Render (props are per-video, no file-per-video needed):
//   npx remotion still ShortThumbnail out/t.png --props='{"art":"projects/short-002/thumb-art.png",
//     "line1":"AI FOR","line2":"14 CENTS?","accent":"line2"}'
//
// art = a staticFile path under media/ (generate with tools/gen_image.py --aspect 9:16,
// prompting for NO text in the image). 1440x2560 clears YouTube's 1280 minimum width.
// =============================================================================
export const compositionConfig = { id: 'ShortThumbnail', durationInSeconds: 0.2, fps: 30, width: 1440, height: 2560 };

type Props = { art?: string; line1?: string; line2?: string; accent?: 'line1' | 'line2' | 'none' };

const ShortThumbnail: React.FC = () => {
  const p = getInputProps() as Props;
  const art = p.art;
  const line1 = p.line1 ?? 'HEADLINE';
  const line2 = p.line2;
  const accent = p.accent ?? 'line2';

  const lineStyle = (isAccent: boolean): React.CSSProperties => ({
    fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 200, lineHeight: 0.98,
    letterSpacing: -4, margin: 0, textAlign: 'center',
    color: isAccent ? COLORS.signalAlt : '#ffffff',
    textShadow: '0 8px 40px rgba(0,0,0,0.85), 0 2px 10px rgba(0,0,0,0.9)',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {art ? <Img src={staticFile(art)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}

      {/* scrim: heavy at the top for the headline, feathered so the art stays visible */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(6,14,10,0.92) 0%, rgba(6,14,10,0.62) 30%, rgba(6,14,10,0.12) 52%, rgba(6,14,10,0.55) 88%, rgba(6,14,10,0.85) 100%)' }} />

      {/* headline block — top third, where a vertical tile always shows it */}
      <div style={{ position: 'absolute', top: 150, left: 70, right: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <h1 style={lineStyle(accent === 'line1')}>{line1}</h1>
        {line2 ? <h1 style={lineStyle(accent === 'line2')}>{line2}</h1> : null}
        <div style={{ width: 320, height: 12, borderRadius: 999, background: GRADIENT, marginTop: 30 }} />
      </div>

      {/* the ToolMint mark — every thumbnail carries it */}
      <div style={{
        position: 'absolute', bottom: 90, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: 18,
        background: 'rgba(6,14,10,0.72)', border: `3px solid ${COLORS.accent}`,
        borderRadius: 999, padding: '20px 46px', backdropFilter: 'blur(6px)',
      }}>
        <div style={{
          width: 62, height: 62, borderRadius: 16, background: COLORS.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 36, color: '#ffffff', letterSpacing: -1,
        }}>
          T<span style={{ color: '#FCD34D' }}>M</span>
        </div>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 54, letterSpacing: -1 }}>
          <span style={{ color: '#ffffff' }}>{BRAND.wordmark[0]}</span>
          <span style={{ color: COLORS.signalAlt }}>{BRAND.wordmark[1]}</span>
        </span>
      </div>

      {/* tiny kicker under the mark keeps the promise on the shelf */}
      <div style={{
        position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center',
        fontFamily: FONT_MONO, fontSize: 26, letterSpacing: 5, color: 'rgba(255,255,255,0.6)',
      }}>
        ONE AI TOOL · EVERY DAY
      </div>
    </AbsoluteFill>
  );
};
export default ShortThumbnail;
