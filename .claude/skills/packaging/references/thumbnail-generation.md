# Thumbnail generation — the render engine behind Stage 5

Stage 3 of `SKILL.md` produces thumbnail **concepts** (text). This file is how those
concepts become **actual images**. Default is `PackagingThumbnail` — no image API, zero
cost. Nano Banana Pro is a paid, owner-authorized opt-in for the rare bet it alone can serve.
Tune the defaults as you learn what your audience clicks.

## The decisions (locked in)

- **Remotion renders the text, not a model.** `PackagingThumbnail` sets the headline word
  directly, so it can never be garbled/misspelled — that was the #1 failure mode of
  model-rendered text, and it's now structurally impossible rather than caught by a verify loop.
- **The real presenter photo, placed as-is.** `media/library/faces/` (git-ignored, you supply
  it — see that folder's README) still anchors identity, but `PackagingThumbnail` places the
  actual photo directly (feathered into the color block at its edge) instead of asking a model
  to re-pose/re-express it into a generated scene. Honest, free, and there is no "face drifts
  from the reference" failure mode to chase.
- **This lives inside `/packaging`**, as Stage 5 — one skill packages a video end to end.

## The loud-vs-calm rule (do NOT reconcile these)

`brand.md` is deliberately **calm/premium** (Linear/Anthropic) for what's *inside* the video.
The **thumbnail is the opposite by design** — big saturated color block, giant headline word,
starburst energy — because it lives on the browse wall and plays by CTR rules, not brand rules.
`PackagingThumbnail`'s two-tone diagonal + starburst backdrop is intentionally louder than
`GeneratedArt` (the calm in-video cover art) for exactly this reason. Never "tone down" a
thumbnail to match the in-video brand. Two systems, on purpose.

## The tool (default — no API, no cost)

`remotion/src/shots/brand/PackagingThumbnail.tsx`, 1920×1080. Props:

| prop | required | notes |
|---|---|---|
| `word` | yes | the ONE dominant hook — huge, single focal element (Thumbnail Checklist #1) |
| `sub` | no | 1–3 word fragment; combines with the title, never repeats it |
| `photo` | no | staticFile path to a REAL photo in `media/library/faces/`; omit for a text-only bet |
| `bg` | no | `emerald` \| `gold` \| `teal` — default `emerald` |

```
cd remotion && npx remotion still PackagingThumbnail ../videos/<project>/packaging/thumbs/A.png \
  --props='{"word":"FREE","sub":"no card needed","bg":"emerald","photo":"library/faces/face-ref-01.jpg"}'
```

Generate the 3 A/B/C concepts into `thumbs/A.png|B.png|C.png`. Keep each variant's props in
`thumbs/A.json` etc. so refinements are diffs, not rewrites. Then convert to the YouTube-spec
JPG (`PIL`, quality stepped down until <2MB) and attach.

**Comparing variants:** stitch the final A/B/C into one labeled side-by-side
(`thumbs/_ABC-set.jpg`, e.g. with `PIL`) so you can eyeball the test set together, the way the
browse wall will.

**Photo placement notes:**

- The photo fills the right ~54% of the frame, top-anchored, `object-fit: cover`; a portrait or
  head-and-shoulders shot with the subject roughly centered works best.
- Its left edge feathers into the `bg` color via a CSS mask — no manual cutout/background-removal
  needed. A plain-ish background on the source photo blends more cleanly than a busy one.
- Omitting `photo` entirely is a legitimate concept, not a fallback to apologize for — a bold
  color block + huge word + logo is a real, proven thumbnail style on its own.

## The verify loop (run on EVERY render before surfacing it)

Read the generated image back and check — adjust props and re-render if any fail:

1. **One dominant hook.** No second competing text block; the frame is not busy.
2. **Bright + saturated + positive.** The `bg` color reads punchy, not muddy; the starburst is
   visible without overpowering the headline.
3. **Photo (if used) sits naturally.** The feathered edge shouldn't show a hard seam — if it
   does, the source photo's background is too busy or too different in tone from `bg`; try a
   different `bg` or crop.
4. **On-theme + wholesome.** No IP concerns — a real photo of the actual presenter has none of
   the "hallucinated logo" or "held prop" risk a generative render carries.
5. **Spec.** 16:9, ≥1280px wide (1920×1080 native), exports <2MB as JPG.

Only surface renders that pass. Review A/B/C together and steer from there.

## Iterating (the back-and-forth)

- Change one field at a time (`bg` OR `word` OR `photo`) so cause↔effect is clear.
- Since rendering is instant and free, iterate freely — there's no per-render cost pressure like
  the paid path had.
- Keep each variation's props in `thumbs/A.json` etc.

## Paid opt-in — Nano Banana Pro (owner-authorized only)

Reach for this only when a bet specifically needs a fully re-imagined photoreal scene —
a staged environment, a re-posed/re-expressed face — that `PackagingThumbnail`'s real-photo
placement can't give, and only with the owner's explicit sign-off on the spend. It is the
exception path, not a fallback to reach for by default.

- **Model id:** `gemini-3-pro-image` (Nano Banana Pro). Fallback: `gemini-3.1-flash-image`
  (Nano Banana 2, faster/cheaper, slightly weaker text).
- **Access:** `GEMINI_API_KEY` in `.env`; Gemini API enabled + billing on the Google project.
- **The tool:** `tools/gen_thumbnail.py` — passes the prompt + the `media/library/faces/` kit to
  the model, saves the PNG + a sidecar `.json` (prompt, model, seed, refs).

```
python tools/gen_thumbnail.py --prompt "…full prompt…" --out videos/video-N/packaging/thumbs/A.png --jpg
python tools/gen_thumbnail.py --prompt-file A.txt --out A.png --size 4K --seed 42   # keeper, reproducible
python tools/gen_thumbnail.py --prompt "…" --out A.png --dry-run                    # validate, no billing
```

**Passing a brand/product logo:** pass the real logo as an extra `--ref` so the model reproduces
it faithfully (e.g. `media/library/logos/claude-code-bot.png`). Any explicit `--ref` you pass
*replaces* the default `media/library/faces/` kit, so include the face ref explicitly too:
`--ref media/library/faces/face-ref-01.jpg --ref media/library/logos/claude-code-bot.png`. In the
prompt, name the roles: "Image 1 = the creator's identity, Image 2 = the Claude Code logo."

### How to prompt Nano Banana Pro

Write the prompt as a **detailed brief for a human artist**, not a keyword list. Five rules
that measurably improved output (Google's official guidance, confirmed in practice):

1. **Positive framing, not negation.** Say what you *want* ("bright, softly-blurred studio")
   rather than what you don't ("not dark, no clutter"). The model can latch onto a banned noun
   and *include* it. ONE exception earns its keep (proven failure mode, see below): a single
   line forbidding text/logos *inside* sub-images.
2. **Labeled brief:** Reference-roles → Subject & Action → Setting & Lighting → Composition →
   Text → Style. Each gets a full descriptive sentence.
3. **Explicit reference roles.** "Image 1 is the identity reference — this exact man's face.
   Image 2 is the Claude Code logo — reproduce it faithfully on the toggle/laptop." Never just
   "the reference."
4. **Cinematographer language.** Real lens + lighting terms buy depth and integration:
   `85mm at f/2, shallow depth of field`, `soft diffused window light`, `green rim light`,
   `bokeh background`. This is what stops the face looking pasted-on.
5. **Text = quoted word + described font + placement.** `"FREE" (F-R-E-E)`, heavy bold
   condensed sans-serif, color, outline, where it sits. One dominant hook only.

### Template 1 — graphic composite (the loud A/B style)

```
A high-energy, photorealistic YouTube thumbnail, 16:9, in a bold saturated modern-tech style.

REFERENCE ROLES: Image 1 is the identity reference — render this exact man with an identical
face, beard, hair and skin tone. Image 2 is the Claude Code logo, a coral-orange pixel-robot
mascot — reproduce it faithfully as <the toggle knob | the corner badge>.

SUBJECT & ACTION: the man from Image 1, large, head-and-shoulders on the <right> third,
<happily-shocked | amazed and delighted> — big open-mouthed smile, raised eyebrows, wide bright
eyes — looking straight into the lens.

SETTING & LIGHTING: a dark, softly blurred studio with a <green> key-glow and a crisp rim light
that separates and relights him so he sits naturally in the scene and matches its color grade.
Shot on an 85mm lens at f/2, shallow depth of field, bokeh background.

TEXT: one headline word, "<WORD>" (letters <W-O-R-D>), in a heavy bold condensed sans-serif,
<color> fill with a thick <outline> outline and a soft drop shadow, huge on the <opposite> side —
the single dominant focal element and the only headline.

COMPOSITION: <the toggle + 3 proof cards | a burst of ~12 image cards pouring from the logo>.
Every small card holds AI-generated art as pure imagery only (no lettering inside them).

STYLE: clean, punchy, professional high-CTR thumbnail — bright, saturated, high dynamic range,
uncluttered, with the headline dominant.
```

### Template 2 — realistic office photo (the authentic C style)

```
A bright, authentic DSLR photograph used as a YouTube thumbnail, 16:9 — one genuinely
photographed, natural scene.

REFERENCE ROLES: Image 1 = this exact man's identity. Image 2 = the Claude Code logo, shown
large and crisp on the laptop screen.

SUBJECT & ACTION: the man from Image 1 at a wooden desk, big genuine open-mouthed smile, looking
into the lens, holding up ONE printed poster in his right hand; his left hand rests on the desk.
Both hands correctly formed with five fingers each; no other hands anywhere in the image.

SETTING: a bright home office — window with soft natural daylight, a plant, an open laptop turned
to camera showing the Claude Code robot big and crisp, a few printed AI character prints on the desk.

PROPS & TEXT: a bold "FREE" (F-R-E-E) card, white letters on red, standing upright in an acrylic
sign holder on the desk (freestanding, no hand) — the only text. In his hand, a poster of ONE
striking, wholesome AI-generated character (a cute 3D robot or cartoon kid hero), family-friendly.

LIGHTING & CAMERA: soft diffused window light, warm; 35mm at f/2.8, shallow depth of field, sharp
on face and signs; natural color grade.

STYLE: a believable candid desk photo — premium, bright, wholesome.
```

### The verify loop for the paid path (run on EVERY render before surfacing it)

Read the generated image back and check — regenerate if any fail:

1. **Text is spelled right and legible.** The #1 failure of model-rendered text. Zoom in; if
   the word is garbled/misspelled/warped, regenerate (re-state the letters, or reduce word length).
2. **Face reads as the creator.** Same features as the reference; not a generic AI face, not distorted.
3. **One dominant hook.** No second competing text block; the frame is not busy (busy = the
   average tier, single hook = the top tier).
4. **Bright + saturated + positive.** Not dark/muted; expression is high-energy positive, never
   the facepalm/flat-smile floor.
5. **Hands sane — count them.** No extra fingers, nothing crossing the face, and **no phantom
   hand** (a held sign whose arm can't be the subject's). If a two-prop pose creates an impossible hand,
   put one prop in a **desk sign-holder** instead of a hand — a reliable fix.
6. **No stray lettering.** Sub-image cards, posters and props carry **no text or brand logos** —
   garbled labels and stray rival logos love to creep into sub-images. Only the one mark you asked for.
7. **On-theme + wholesome.** Held/showcase images match what the video really makes (honesty
   guardrail) and are family-friendly — no glamour/"AI-girlfriend" bait, watch for IP (Superman,
   real product brands) unless you okay it.
8. **Spec.** 16:9, ≥1280px wide, exports <2MB as JPG.

### Failure modes → fixes (paid path only)

| Symptom | Fix |
|---|---|
| Garbled / misspelled word | Re-state letters (`F-R-E-E`); shorten to 1–2 words; regenerate; try Pro if on Flash. |
| Face drifts from the reference | Add more/better refs to `media/library/faces/`; say "exact same face, do not stylize". |
| Busy frame / two text blocks | "ONLY one headline, no other text"; remove the object; simplify background. |
| Dark / muted | Name the saturated accent explicitly; add "bright, high contrast, rim-lit". |
| Square / wrong ratio | Enforced by `image_config` (16:9) — if it still drifts, restate 16:9 in the prompt too. |
| Face looks pasted-on (flat cut-out) | Add cinematographer relight language: "relit to match the scene's <green> glow, same color grade, 85mm f/2, rim light, soft edges." |
| Phantom / impossible hand | Give both hands a job ("right hand holds X, left rests on desk; no other hands"); or move a prop into a **desk sign-holder**. |
| Garbled text / rival logo inside a sub-image | One explicit line: sub-images are "pure imagery only, no lettering or brand logos" (the sole earned negative). |
| Off-theme / glamour / IP in showcase | Use what the video actually makes (storybook character); "wholesome, family-friendly"; avoid glamour + trademarked characters/products. |
| No image returned | Check the printed model text (safety block / wrong model id); adjust prompt or `--model`. |
