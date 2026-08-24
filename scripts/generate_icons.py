"""마실지기 앱 아이콘(하트 로고)을 여러 사이즈로 생성합니다."""
from PIL import Image, ImageDraw
import math

TEAL_DARK = (11, 61, 56, 255)
TEAL = (18, 86, 77, 255)
WHITE = (255, 255, 255, 255)


def draw_heart(draw, cx, cy, size, color):
    # 두 개의 원 + 삼각형(다이아몬드)으로 하트 모양 근사
    r = size * 0.28
    draw.ellipse([cx - r * 1.9, cy - r * 1.55, cx - 0.05 * r, cy + r * 0.9], fill=color)
    draw.ellipse([cx + 0.05 * r, cy - r * 1.55, cx + r * 1.9, cy + r * 0.9], fill=color)
    points = [
        (cx - r * 1.85, cy - r * 0.05),
        (cx + r * 1.85, cy - r * 0.05),
        (cx, cy + r * 2.35),
    ]
    draw.polygon(points, fill=color)


def make_icon(px):
    img = Image.new('RGBA', (px, px), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    pad = int(px * 0.06)
    draw.ellipse([pad, pad, px - pad, px - pad], fill=TEAL_DARK)
    draw_heart(draw, px / 2, px / 2 + px * 0.02, px * 0.62, WHITE)
    return img


sizes = {
    'icon-1024.png': 1024,
    'icon-512.png': 512,
    'icon-192.png': 192,
    'apple-touch-icon.png': 180,
    'favicon-32.png': 32,
}

for name, s in sizes.items():
    make_icon(s).save(f'/home/claude/masilgigi-app/public/{name}')

# favicon.ico (여러 사이즈 포함)
make_icon(64).save(
    '/home/claude/masilgigi-app/public/favicon.ico',
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
)

print('done')
