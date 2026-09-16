import React from 'react';
import { AbsoluteFill, Img, getInputProps, staticFile } from 'remotion';
import { BRAND, COLORS } from '../../brand';
import { FONT_DISPLAY } from '../../fonts';

// =============================================================================
// PackagingThumbnail — the long-form 16:9 thumbnail bet, rendered with NO image
// API. Two things the paid pipeline (Nano Banana Pro, tools/gen_thumbnail.py)
// was buying: (1) legible headline text — Remotion sets it directly, so it can
// never be garbled/misspelled, the #1 failure mode in
// packaging/references/thumbnail-generation.md; (2) the presenter's face —
// `photo` takes the REAL reference photo from media/library/faces/ as-is (no
// AI re-pose/re-expression) and feathers its edge into the color block via a
// CSS mask, rather than asking a model to redraw it into a generated scene.
// LOUD BY DESIGN — this is deliberately the opposite of the calm in-video
// brand (see the loud-vs-calm rule in the reference doc); never tone it down.
//
// Render:
//   npx remotion still PackagingThumbnail out/A.png --props='{"word":"FREE",
//     "sub":"no card needed","photo":"library/faces/face-ref-01.jpg","bg":"emerald"}'
// =============================================================================
export const compositionConfig = { id: 'PackagingThumbnail', durationInSeconds: 0.2, fps: 30, width: 1920, height: 1080 };

type Props = {
  word: string; // the ONE dominant hook — huge, single focal element (Thumbnail Checklist #1)
  sub?: string; // small supporting fragment; combines with the title, never repeats it
  photo?: string; // staticFile path to a REAL presenter photo (media/library/faces/); omit for text-only
  bg?: 'emerald' | 'gold' | 'teal';
};

const BG_POP: Record<NonNullable<Props['bg']>, string> = {
  emerald: COLORS.accent,
  gold: COLORS.accent2,
  teal: COLORS.signal,
};

// faux text-stroke: layered offset shadows read as a thick outline (the "heavy outline"
// the thumbnail-generation.md prompt template asks Nano Banana Pro for — done here in CSS).
const outlineShadow = (color: string, w: number) => {
  const offsets = [-1, 0, 1];
  const layers: string[] = [];
  for (const x of offsets) for (const y of offsets) if (x || y) layers.push(`${x * w}px ${y * w}px 0 ${color}`);
  return layers;
};

const PackagingThumbnail: React.FC = () => {
  const p = getInputProps() as Props;
  const word = p.word ?? 'FREE';
  const sub = p.sub;
  const photo = p.photo;
  const pop = BG_POP[p.bg ?? 'emerald'];
  const dark = COLORS.d900;

  // starburst behind the headline — high-energy punch, generated rather than hand-typed degrees
  const RAYS = 16;
  const rayStops = Array.from({ length: RAYS }, (_, i) => {
    const start = (360 / RAYS) * i;
    const mid = start + 180 / RAYS;
    return `${pop}30 ${start}deg, transparent ${mid}deg`;
  }).join(', ');

  return (
    <AbsoluteFill style={{ backgroundColor: dark, fontFamily: FONT_DISPLAY }}>
      {/* bold two-tone diagonal color block — the loud backdrop, never the calm in-video gradient */}
      <AbsoluteFill style={{ background: `linear-gradient(112deg, ${dark} 0%, ${dark} 40%, ${pop} 64%, ${pop} 100%)` }} />
      <AbsoluteFill style={{ background: `conic-gradient(from 0deg at 32% 48%, ${rayStops})`, opacity: 0.6 }} />
      <AbsoluteFill style={{ background: `radial-gradient(640px 640px at 32% 48%, ${pop}22, transparent 70%)` }} />

      {photo ? (
        <div style={{
          position: 'absolute', right: 0, top: 0, width: '54%', height: '100%',
          maskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 12%, black 28%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 12%, black 28%)',
        }}>
          <Img src={staticFile(photo)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
        </div>
      ) : null}

      {/* headline — the one dominant hook */}
      <div style={{ position: 'absolute', left: 96, top: '50%', transform: 'translateY(-50%)', maxWidth: 980 }}>
        <h1 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 216, lineHeight: 0.95, margin: 0,
          color: '#ffffff', letterSpacing: -5,
          textShadow: [...outlineShadow(dark, 5), '0 18px 50px rgba(0,0,0,0.55)'].join(', '),
        }}>
          {word}
        </h1>
        {sub ? (
          <div style={{
            marginTop: 26, fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 52,
            color: pop, textShadow: [...outlineShadow(dark, 3), '0 4px 20px rgba(0,0,0,0.5)'].join(', '),
          }}>
            {sub}
          </div>
        ) : null}
      </div>

      {/* the ToolMint mark */}
      <div style={{
        position: 'absolute', bottom: 50, left: 96,
        display: 'flex', alignItems: 'center', gap: 14,
        background: 'rgba(6,14,10,0.72)', border: `3px solid ${COLORS.accent}`,
        borderRadius: 999, padding: '14px 34px',
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12, background: COLORS.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 26, color: '#ffffff', letterSpacing: -1,
        }}>
          T<span style={{ color: '#FCD34D' }}>M</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: 40, letterSpacing: -1 }}>
          <span style={{ color: '#ffffff' }}>{BRAND.wordmark[0]}</span>
          <span style={{ color: COLORS.signalAlt }}>{BRAND.wordmark[1]}</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
export default PackagingThumbnail;
