#!/usr/bin/env python3
"""
gen_image.py — in-video AI images, from Replicate (FLUX) or the direct Google Gemini API.

Generates the art for a video beat / cover frame / thumbnail background, saves PNG + a
sidecar .json (prompt, model, refs, seed) so any render can be reproduced or re-rolled.

WHY FLUX IS THE DEFAULT: this repo never asks an image model to render TEXT — Remotion sets
every headline and the ToolMint mark in real brand fonts (see ShortThumbnail/RecapThumbnail).
Text rendering was the only thing the premium tiers bought us, so the cheapest strong ART
model wins: FLUX schnell is ~$0.003/image vs ~$0.0336 for Gemini lite (~11x cheaper).

Model presets:
  flux     -> black-forest-labs/flux-schnell    (Replicate; DEFAULT — fastest + cheapest art)
  flux-dev -> black-forest-labs/flux-dev        (Replicate; slower, higher fidelity)
  pro      -> gemini-3-pro-image                (Nano Banana Pro — best text rendering)
  fast     -> gemini-3.1-flash-image            (Nano Banana 2)
  lite     -> gemini-3.1-flash-lite-image       (Nano Banana 2 Lite)
Any raw model id is accepted: "owner/name" routes to Replicate, anything else to Gemini.

Usage:
  python tools/gen_image.py --prompt "..." --aspect 9:16 --out media/projects/short-007/cover.png
  python tools/gen_image.py --prompt-file p.txt --model pro --aspect 16:9 --out x.png
  python tools/gen_image.py --prompt "..." --model lite --ref media/library/faces/a.jpg --out x.png
  --aspect 9:16 (default, vertical shorts) | 16:9 | 1:1 ...   --size 1K|2K|4K (Gemini only)
  --seed N   --dry-run

Keys in .env (or the environment): REPLICATE_API_KEY (or REPLICATE_API_TOKEN) for FLUX,
GEMINI_API_KEY + the google-genai SDK for the Gemini tiers. If a FLUX model is requested
and no Replicate key is present, it falls back to Gemini lite rather than failing an
unattended batch run. Reference images are Gemini-only (FLUX here is text-to-image).
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRESETS = {
    "flux": "black-forest-labs/flux-schnell",
    "flux-dev": "black-forest-labs/flux-dev",
    "pro": "gemini-3-pro-image",
    "fast": "gemini-3.1-flash-image",
    "lite": "gemini-3.1-flash-lite-image",
}
DEFAULT_MODEL = "flux"
FALLBACK_MODEL = "gemini-3.1-flash-lite-image"   # used when a FLUX run has no Replicate key
# The Gemini lite tier only accepts 1K; asking for 2K/4K is a hard 400. Clamp instead of
# crashing an unattended batch run.
MAX_SIZE = {"gemini-3.1-flash-lite-image": "1K"}
RESPONSE_MODALITIES = ["TEXT", "IMAGE"]
REPLICATE_URL = "https://api.replicate.com/v1/models/{model}/predictions"


def load_env():
    env = {}
    p = os.path.join(ROOT, ".env")
    if os.path.exists(p):
        for line in open(p, encoding="utf-8"):
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return {**env, **os.environ}


def get_arg(args, name, default=None):
    return args[args.index(name) + 1] if name in args else default


def get_args_multi(args, name):
    return [args[i + 1] for i, a in enumerate(args) if a == name]


def rel(p):
    try:
        return os.path.relpath(p, ROOT)
    except ValueError:
        return p


def mime_for(path):
    return "image/png" if path.lower().endswith(".png") else "image/jpeg"


def is_replicate(model):
    """Replicate model ids look like owner/name; Gemini ids never contain a slash."""
    return "/" in model


def gen_replicate(model, prompt, aspect, seed, token):
    """FLUX via Replicate. 'Prefer: wait' returns the finished prediction inline, so no
    polling loop in the common case; we still poll if it comes back unfinished."""
    payload = {"input": {
        "prompt": prompt,
        "aspect_ratio": aspect,
        "num_outputs": 1,
        "output_format": "png",
        "go_fast": True,
        "megapixels": "1",
    }}
    if seed is not None:
        payload["input"]["seed"] = seed

    req = urllib.request.Request(
        REPLICATE_URL.format(model=model),
        data=json.dumps(payload).encode(), method="POST",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json",
                 "Prefer": "wait"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            pred = json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"Replicate API error {e.code}: {e.read().decode('utf-8', 'replace')[:400]}")

    # poll if it is still running
    for _ in range(60):
        if pred.get("status") in ("succeeded", "failed", "canceled"):
            break
        time.sleep(2)
        gr = urllib.request.Request(pred["urls"]["get"], headers={"Authorization": f"Bearer {token}"})
        with urllib.request.urlopen(gr, timeout=60) as r:
            pred = json.load(r)

    if pred.get("status") != "succeeded":
        sys.exit(f"Replicate prediction {pred.get('status')}: {str(pred.get('error'))[:300]}")

    out = pred.get("output")
    url = out[0] if isinstance(out, list) else out
    if not url:
        sys.exit("Replicate returned no image URL")
    with urllib.request.urlopen(url, timeout=120) as r:
        return r.read()


def gen_gemini(model, prompt, aspect, size, seed, refs, api_key):
    from google import genai
    from google.genai import types

    contents = [prompt]
    for r in refs:
        with open(r, "rb") as f:
            contents.append(types.Part.from_bytes(data=f.read(), mime_type=mime_for(r)))

    cfg_kwargs = dict(
        response_modalities=RESPONSE_MODALITIES,
        image_config=types.ImageConfig(aspect_ratio=aspect, image_size=size),
    )
    if seed is not None and "seed" in types.GenerateContentConfig.model_fields:
        cfg_kwargs["seed"] = seed

    client = genai.Client(api_key=api_key)
    try:
        resp = client.models.generate_content(
            model=model, contents=contents, config=types.GenerateContentConfig(**cfg_kwargs))
    except Exception as e:
        sys.exit(f"Gemini API error: {type(e).__name__}: {e}")

    img_bytes, texts = None, []
    for cand in (resp.candidates or []):
        for part in ((cand.content.parts if cand.content else None) or []):
            inline = getattr(part, "inline_data", None)
            if inline and inline.data:
                img_bytes = inline.data
            elif getattr(part, "text", None):
                texts.append(part.text)
    if texts:
        print("  model text:", " ".join(texts)[:300])
    if not img_bytes:
        sys.exit("No image returned (safety block / refusal / wrong model id?)")
    return img_bytes


def main():
    args = sys.argv[1:]
    dry = "--dry-run" in args

    prompt = get_arg(args, "--prompt")
    pf = get_arg(args, "--prompt-file")
    if pf:
        prompt = open(pf, encoding="utf-8").read()
    out = get_arg(args, "--out")
    if not prompt or not out:
        sys.exit("need --prompt/--prompt-file and --out (see file header)")

    model = PRESETS.get(get_arg(args, "--model", DEFAULT_MODEL), get_arg(args, "--model", DEFAULT_MODEL))
    aspect = get_arg(args, "--aspect", "9:16")
    size = get_arg(args, "--size", "1K")
    seed = get_arg(args, "--seed")
    seed = int(seed) if seed is not None else None
    refs = [r for r in get_args_multi(args, "--ref") if os.path.exists(r)]

    env = load_env()
    token = (env.get("REPLICATE_API_KEY") or env.get("REPLICATE_API_TOKEN") or "").strip()

    if is_replicate(model):
        if not token:
            print(f"  ! no REPLICATE_API_KEY — falling back to {FALLBACK_MODEL}")
            model = FALLBACK_MODEL
        elif refs:
            print("  ! --ref is Gemini-only (FLUX here is text-to-image); ignoring refs")
            refs = []
    if model in MAX_SIZE and size != MAX_SIZE[model]:
        print(f"  ! {model} only supports {MAX_SIZE[model]} — using that instead of {size}")
        size = MAX_SIZE[model]

    backend = "replicate" if is_replicate(model) else "gemini"
    print(f"backend={backend}  model={model}  aspect={aspect}  size={size}  seed={seed}")
    print(f"refs ({len(refs)}):", ", ".join(rel(r) for r in refs) or "(none)")
    print(f"out -> {rel(out)}")
    if dry:
        print("[dry-run] validated; no API call.")
        return

    if backend == "replicate":
        img_bytes = gen_replicate(model, prompt, aspect, seed, token)
    else:
        api_key = env.get("GEMINI_API_KEY", "").strip()
        if not api_key:
            sys.exit("GEMINI_API_KEY not set in .env")
        img_bytes = gen_gemini(model, prompt, aspect, size, seed, refs, api_key)

    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with open(out, "wb") as f:
        f.write(img_bytes)
    print(f"  png  -> {rel(out)}  ({len(img_bytes)//1024}KB)")

    sidecar = os.path.splitext(out)[0] + ".json"
    with open(sidecar, "w", encoding="utf-8") as f:
        json.dump({"prompt": prompt, "backend": backend, "model": model, "aspect_ratio": aspect,
                   "image_size": size if backend == "gemini" else None, "seed": seed,
                   "refs": [rel(r) for r in refs],
                   "created": time.strftime("%Y-%m-%dT%H:%M:%S")}, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"  meta -> {rel(sidecar)}")


if __name__ == "__main__":
    main()
