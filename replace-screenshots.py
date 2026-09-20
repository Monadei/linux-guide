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
    img_file = None
    for ext in ['.png', '.jpg', '.jpeg', '.webp']:
        if os.path.exists(os.path.join(img_dir, slug + ext)):
            img_file = slug + ext
            break
    if not img_file:
        continue
    path = 'distros/' + fname
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    if 'screenshot-section' not in c:
        continue
    pattern = r'<div class="screenshot-slot" id="screenshot-' + re.escape(slug) + r'".*?</div>\s*</section>'
    replacement = '<img src="../img/' + img_file + '" alt="' + slug + '" loading="lazy" style="max-width:100%;height:auto;display:block;margin:1rem auto;border:1px solid var(--border);border-radius:4px;"></section>'
    new_c, n = re.subn(pattern, replacement, c, flags=re.DOTALL)
    if n > 0:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_c)
        print("  ✓ " + slug + " ← " + img_file)
        replaced += 1
print("\nЗаменено: " + str(replaced))
