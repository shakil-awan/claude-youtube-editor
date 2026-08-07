// Brand 3-font system, SELF-HOSTED in media/library/fonts/ (Remotion's public root) so renders
// never touch the network — headless/CI/cron renders and offline Studio all work, and every
// render is deterministic. `/brand-setup` rewrites this file alongside brand.ts and brand.md;
// to swap a family, drop its latin woff2 (variable if available) into media/library/fonts/,
// update the loadFont call, and note provenance in that folder's README.md.
import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

const font = (family: string, file: string, weight: string) =>
  loadFont({ family, url: staticFile(`library/fonts/${file}`), weight });

font('Space Grotesk', 'SpaceGrotesk-latin-wght.woff2', '300 700'); // variable
font('Inter', 'Inter-latin-wght.woff2', '100 900'); // variable
font('JetBrains Mono', 'JetBrainsMono-latin-wght.woff2', '100 800'); // variable
font('Spectral', 'Spectral-latin-500.woff2', '500'); // static per weight
font('Spectral', 'Spectral-latin-600.woff2', '600');

export const FONT_DISPLAY = 'Space Grotesk';
export const FONT_BODY = 'Inter';
export const FONT_MONO = 'JetBrains Mono';
// serif for the Claude Code wordmark clone (close match to the app's serif) — not a brand font
export const FONT_SERIF = 'Spectral';
