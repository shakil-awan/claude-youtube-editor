"""Offline fallback cover art (no API): abstract emerald/gold art, 1080x1920, no text.

Used when both image backends (Replicate, Gemini) are out of credit.
  python tools/local_cover.py wave  media/projects/short-105/cover.png
  python tools/local_cover.py coin  media/projects/short-106/cover.png
"""
import math
import random
import sys

from PIL import Image, ImageDraw, ImageFilter

W, H = 1080, 1920
EMERALD = (16, 185, 129)
GOLD = (245, 190, 60)


def base():
    img = Image.new("RGB", (W, H), (18, 20, 24))
    px = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        c = int(18 + 14 * t)
        px.line([(0, y), (W, y)], fill=(c, c + 2, c + 6))
    return img


def glow(layer, blur):
    return layer.filter(ImageFilter.GaussianBlur(blur))


def wave(img):
    cx, cy = W // 2, 1250
    rnd = random.Random(5)
    glow_l = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(glow_l)
    for r in range(120, 560, 60):
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=EMERALD, width=8)
    bars = 31
    for i in range(bars):
        x = 90 + i * (W - 180) / (bars - 1)
        hgt = 40 + 330 * math.exp(-((i - bars / 2) ** 2) / 55) * (0.6 + 0.4 * rnd.random())
        d.rounded_rectangle([x - 11, cy - hgt, x + 11, cy + hgt], 11, fill=GOLD)
    return glow_l


def coin(img):
    cx, cy = W // 2, 1250
    glow_l = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(glow_l)
    for r in range(480, 80, -40):
        k = (480 - r) / 400
        col = tuple(int(EMERALD[i] * (1 - k) + GOLD[i] * k) for i in range(3))
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=col, width=10)
    d.ellipse([cx - 90, cy - 90, cx + 90, cy + 90], fill=GOLD)
    return glow_l


def main():
    kind, out = sys.argv[1], sys.argv[2]
    img = base()
    layer = {"wave": wave, "coin": coin}[kind](img)
    soft = glow(layer, 28)
    img = Image.composite(img, img, Image.new("L", (W, H), 255))
    from PIL import ImageChops
    img = ImageChops.add(img, ImageChops.multiply(soft, Image.new("RGB", (W, H), (200, 200, 200))))
    img = ImageChops.add(img, layer)
    img.save(out)


if __name__ == "__main__":
    main()
