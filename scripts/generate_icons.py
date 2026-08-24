"""마실지기 앱 아이콘("마실지기" 워드마크 타일)을 여러 사이즈로 생성합니다."""
from PIL import Image

SOURCE_PATH = '/home/claude/masilgigi-app/src/assets/images/icon-text-green-v2.png'

sizes = {
    'icon-1024.png': 1024,
    'icon-512.png': 512,
    'icon-192.png': 192,
    'apple-touch-icon.png': 180,
    'favicon-32.png': 32,
}

source = Image.open(SOURCE_PATH).convert('RGBA')

for name, s in sizes.items():
    source.resize((s, s), Image.LANCZOS).save(f'/home/claude/masilgigi-app/public/{name}')

# favicon.ico (여러 사이즈 포함)
source.resize((64, 64), Image.LANCZOS).save(
    '/home/claude/masilgigi-app/public/favicon.ico',
    sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
)

print('done')
