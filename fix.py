#!/usr/bin/env python3
import os, re

os.chdir(os.path.expanduser('~/data/linux-guide'))

print("=" * 42)
print("АВТО-ФИКС LINUX GUIDE")
print("=" * 42)

# 1. ЧИСТКА КАТАЛОГА
print("\n[1/6] Чищу каталог...")
with open('distros/index.html', 'r', encoding='utf-8') as f:
    c = f.read()

c = re.sub(r'<article class="card"><div style="font-size:2rem;margin-bottom:0\.5rem;">[^<]*</div>', '<article class="card">', c)
c = re.sub(r'<img[^>]*src=""[^>]*>', '', c)
c = re.sub(r'(<img[^>]*class="distro-icon"[^>]*>)\s*(<img[^>]*class="distro-icon"[^>]*>)', r'\1', c)

with open('distros/index.html', 'w', encoding='utf-8') as f:
    f.write(c)
print(f"  Карточек: {len(re.findall(r'<article class=.card.>', c))}")

# 2. СТИЛИ
print("\n[2/6] Добавляю стили...")
style = """

.screenshot-section {
  margin-top: 2.5rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--border);
}
.screenshot-section h2 { color: var(--accent); }
.screenshot-slot {
  background: linear-gradient(135deg, var(--panel), var(--panel-2));
  border: 2px dashed var(--border);
  padding: 2rem 1.2rem;
  text-align: center;
  margin: 1rem 0;
  border-radius: 4px;
}
.screenshot-slot .ss-icon {
  font-size: 2.5rem; display: block; margin-bottom: 0.6rem;
}
.screenshot-slot p { margin: 0.3rem 0; }
.screenshot-slot .ss-hint { color: var(--muted); font-size: 0.85rem; }
.screenshot-slot .ss-code {
  display: inline-block; background: var(--bg);
  padding: 0.5rem 0.8rem; font-size: 0.75rem;
  margin-top: 0.5rem; border-left: 2px solid var(--accent);
  white-space: pre-wrap; word-break: break-all;
  text-align: left; max-width: 100%;
}
.screenshot-slot img {
  max-width: 100%; height: auto; display: block; margin: 0 auto;
  border: 1px solid var(--border); border-radius: 4px;
}
.screenshot-slot.filled { background: none; border: none; padding: 0; }
"""
with open('css/extra.css', 'r', encoding='utf-8') as f:
    css = f.read()
if '.screenshot-section' not in css:
    with open('css/extra.css', 'a', encoding='utf-8') as f:
        f.write(style)
    print("  Стили добавлены")
else:
    print("  Стили уже есть")

# 3. СКРИНШОТ-БЛОКИ
print("\n[3/6] Добавляю блоки скриншотов...")
files = sorted([f for f in os.listdir('distros') if f.endswith('.html') and f != 'index.html'])
added = 0
skipped = 0

for fname in files:
    path = 'distros/' + fname
    slug = fname.replace('.html', '')
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    if '</main>' not in html:
        continue
    if 'screenshot-section' in html:
        skipped += 1
        continue
    m = re.search(r'<h1[^>]*>([^<]+)</h1>', html)
    name = m.group(1).strip() if m else slug
    block = '\n<section class="screenshot-section">\n<h2>Скриншот</h2>\n<div class="screenshot-slot" id="screenshot-' + slug + '" data-slug="' + slug + '">\n<div class="ss-icon">📷</div>\n<p><strong>Место для скриншота: ' + name + '</strong></p>\n<p class="ss-hint">Положи PNG в <code>img/' + slug + '.png</code>, потом замени этот блок на:</p>\n<pre class="ss-code">&lt;img src="../img/' + slug + '.png" alt="' + name + '"&gt;</pre>\n</div>\n</section>\n\n'
    html = html.replace('</main>', block + '</main>')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    added += 1
print(f"  Добавлено: {added}, пропущено: {skipped}")

# 4. ПРОВЕРКА
print("\n[4/6] Проверяю файлы...")
issues = []
for fname in files:
    with open('distros/' + fname, 'r', encoding='utf-8') as f:
        c = f.read()
    if '</html>' not in c:
        issues.append(fname)
if issues:
    print(f"  ⚠️  Проблемных файлов: {len(issues)}")
    for i in issues[:10]:
        print(f"     {i}")
else:
    print(f"  ✅ Все {len(files)} файлов целы")

# 5. HOW-TO
print("\n[5/6] Создаю инструкцию...")
howto = """# Как добавить скриншоты

## 1. Сделай скриншот
- Print Screen — весь экран
- Alt + Print Screen — активное окно
- Shift + Print Screen — область
- Ctrl + Print Screen — сразу в файл

## 2. Скопируй в проект
mkdir -p ~/data/linux-guide/img
cp ~/Pictures/Screenshots/*.png ~/data/linux-guide/img/

## 3. Переименуй по slug'у
Slug = имя файла без .html.
Пример: distros/ubuntu.html → img/ubuntu.png

## 4. Автозамена
cd ~/data/linux-guide
python3 replace-screenshots.py
"""
with open('HOW-TO-SCREENSHOTS.md', 'w', encoding='utf-8') as f:
    f.write(howto)
print("  HOW-TO-SCREENSHOTS.md создан")

# 6. АВТОЗАМЕНА
print("\n[6/6] Создаю автозамену...")
autoreplace = '''#!/usr/bin/env python3
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
    pattern = r'<div class="screenshot-slot" id="screenshot-' + re.escape(slug) + r'".*?</div>\\s*</section>'
    replacement = '<img src="../img/' + img_file + '" alt="' + slug + '" loading="lazy" style="max-width:100%;height:auto;display:block;margin:1rem auto;border:1px solid var(--border);border-radius:4px;"></section>'
    new_c, n = re.subn(pattern, replacement, c, flags=re.DOTALL)
    if n > 0:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_c)
        print("  ✓ " + slug + " ← " + img_file)
        replaced += 1
print("\\nЗаменено: " + str(replaced))
'''
with open('replace-screenshots.py', 'w', encoding='utf-8') as f:
    f.write(autoreplace)
os.chmod('replace-screenshots.py', 0o755)
print("  replace-screenshots.py создан")

print("\n" + "=" * 42)
print("ГОТОВО")
print("=" * 42)
print(f"\nСтраниц дистрибутивов: {len(files)}")
print(f"Скриншот-блоков добавлено: {added}")
print("\nОткрываю Ubuntu...")
os.system("xdg-open distros/ubuntu.html &")
