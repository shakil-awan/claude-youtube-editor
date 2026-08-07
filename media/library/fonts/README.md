# media/library/fonts/ — the self-hosted brand fonts

The woff2 files `remotion/src/fonts.ts` loads via `staticFile('library/fonts/…')`. Self-hosted so
renders never fetch from a font CDN — headless/CI/cron renders and offline Studio work, and output
is deterministic. All families are **SIL Open Font License** (redistribution permitted).

| File | Family | Weights | Source |
|---|---|---|---|
| SpaceGrotesk-latin-wght.woff2 | Space Grotesk (display) | variable 300–700 | Google Fonts, latin subset |
| Inter-latin-wght.woff2 | Inter (body) | variable 100–900 | Google Fonts, latin subset |
| JetBrainsMono-latin-wght.woff2 | JetBrains Mono (mono) | variable 100–800 | Google Fonts, latin subset |
| Spectral-latin-500.woff2 / -600 | Spectral (serif, wordmark clone only) | 500, 600 | Google Fonts, latin subset |

Swapping a family (`/brand-setup` does this for you): download the new family's **latin** woff2
(variable if it has one) from Google Fonts, drop it here, update the `loadFont` call in
`remotion/src/fonts.ts`, and update this table. Latin subsets only — non-latin scripts need their
subsets added deliberately.
