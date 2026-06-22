#!/usr/bin/env python3
"""Generate a 1200x630 social share card per blog post.

Each card = the post's cover photo, darkened with a gradient for legibility,
with the post title (serif), a gold eyebrow (tags) and a wordmark footer.
Output: public/og/<slug>.png  -> referenced as og:image / twitter:image.

Run from the project root:  python3 scripts/gen_og_images.py
Re-run whenever you add or rename a post. (Pillow required: pip install pillow)
"""
import os, re, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS = os.path.join(ROOT, "src", "content", "posts.ts")
PHOTOS = os.path.join(ROOT, "public", "photos")
OUT = os.path.join(ROOT, "public", "og")
W, H = 1200, 630
GOLD = (255, 207, 138)

SERIF_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()


def parse_posts():
    src = open(POSTS, encoding="utf-8").read()
    marks = [(m.group(1), m.start()) for m in re.finditer(r"slug:\s*'([^']+)'", src)]
    out = []
    for i, (slug, at) in enumerate(marks):
        chunk = src[at:(marks[i + 1][1] if i + 1 < len(marks) else len(src))]
        title = (re.search(r"title:\s*'((?:[^'\\]|\\.)*)'", chunk) or [None, slug])[1]
        cover = (re.search(r"cover:\s*'([^']+)'", chunk) or [None, ""])[1]
        tags = re.findall(r"'([^']+)'", (re.search(r"tags:\s*\[([^\]]*)\]", chunk) or [None, ""])[1])
        out.append({"slug": slug, "title": title.replace("\\'", "'"), "cover": cover, "tags": tags})
    return out


def cover_fill(img, w, h):
    src_ratio = img.width / img.height
    dst_ratio = w / h
    if src_ratio > dst_ratio:
        nh = h; nw = int(h * src_ratio)
    else:
        nw = w; nh = int(w / src_ratio)
    img = img.resize((nw, nh), Image.LANCZOS)
    return img.crop(((nw - w) // 2, (nh - h) // 2, (nw - w) // 2 + w, (nh - h) // 2 + h))


def tracked(draw, xy, text, fnt, fill, tracking=0):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking
    return x


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for wd in words:
        t = (cur + " " + wd).strip()
        if draw.textlength(t, font=fnt) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = wd
    if cur:
        lines.append(cur)
    return lines


def make_card(post):
    cover_path = os.path.join(ROOT, "public", post["cover"].lstrip("/")) if post["cover"] else ""
    if cover_path and os.path.exists(cover_path):
        bg = cover_fill(Image.open(cover_path).convert("RGB"), W, H)
    else:
        bg = Image.new("RGB", (W, H), (16, 16, 34))

    # darken for legibility: global dim + bottom-left gradient
    overlay = Image.new("L", (W, H), 0)
    od = ImageDraw.Draw(overlay)
    for y in range(H):
        # stronger at the bottom
        a = int(70 + 150 * (y / H) ** 1.4)
        od.line([(0, y), (W, y)], fill=a)
    black = Image.new("RGB", (W, H), (6, 6, 16))
    bg = Image.composite(black, bg, overlay)
    bg = bg.filter(ImageFilter.GaussianBlur(0.4))

    d = ImageDraw.Draw(bg)
    pad = 72

    # gold rule
    d.rectangle([pad, 372, pad + 54, 378], fill=GOLD)

    # eyebrow (tags or JOURNAL)
    eyebrow = " · ".join((post["tags"][:3] or ["journal"])).upper()
    f_eye = font(SANS_BOLD, 22)
    tracked(d, (pad, 396), eyebrow, f_eye, GOLD, tracking=2)

    # title (auto-fit serif, up to 3 lines)
    size = 66
    while size >= 40:
        f_title = font(SERIF_BOLD, size)
        lines = wrap(d, post["title"], f_title, W - pad * 2)
        if len(lines) <= 3:
            break
        size -= 4
    y = 432
    for ln in lines[:3]:
        d.text((pad, y), ln, font=f_title, fill=(255, 255, 255))
        y += int(size * 1.16)

    # footer wordmark
    f_foot = font(SANS, 22)
    tracked(d, (pad, H - 56), "MARCUS MOO", f_foot, (255, 255, 255), tracking=3)
    mark_w = sum(d.textlength(c, font=f_foot) + 3 for c in "MARCUS MOO")
    d.text((pad + mark_w + 14, H - 56), "·  APAC Technology Evangelist",
           font=f_foot, fill=(255, 255, 255, 180))

    os.makedirs(OUT, exist_ok=True)
    out_path = os.path.join(OUT, post["slug"] + ".jpg")
    bg.save(out_path, "JPEG", quality=86, optimize=True)
    return out_path


def main():
    posts = parse_posts()
    if not posts:
        print("No posts found.")
        sys.exit(1)
    for p in posts:
        path = make_card(p)
        print(f"  • {os.path.relpath(path, ROOT)}   ({p['title']})")
    print(f"Generated {len(posts)} OG card(s).")


if __name__ == "__main__":
    main()
