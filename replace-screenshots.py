#!/usr/bin/env python3
import os, re

os.chdir(os.path.expanduser('~/data/linux-guide'))

img_dir = 'img'
if not os.path.isdir(img_dir):
    print("Нет папки img/")
    exit(1)

files = sorted([f for f in os.listdir('distros') if f.endswith('.html') and f != 'index.html'])
replaced = 0

for fname in files:
    slug = fname.replace('.html', '')
    path = 'distros/' + fname

    img_file = None
    for ext in ['.png', '.jpg', '.jpeg', '.webp', '.gif']:
        if os.path.exists(os.path.join(img_dir, slug + ext)):
            img_file = slug + ext
            break

    if not img_file:
        continue

    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()

    if 'screenshot-section' not in c:
        continue

    m = re.search(r'<h1[^>]*>([^<]+)</h1>', c)
    name = m.group(1).strip() if m else slug

    pattern = r'<div class="screenshot-slot"[^>]*>.*?</div>\s*</section>'
    replacement = (
        '<div class="screenshot-slot filled">'
        '<img src="../img/' + img_file + '" alt="' + name + '" loading="lazy">'
        '</div>\n</section>'
    )

    new_c, n = re.subn(pattern, replacement, c, flags=re.DOTALL)
    if n > 0:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_c)
        print("  OK " + slug + " <- " + img_file)
        replaced += 1

print()
print("Заменено: " + str(replaced))
if replaced == 0:
    print("Не найдено ни одной картинки в img/ с именем страницы.")
