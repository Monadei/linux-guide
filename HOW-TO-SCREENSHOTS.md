# Как добавить скриншоты

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
