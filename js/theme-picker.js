(function() {
  // Список тем — короткий для быстрого переключения
  var THEMES = [
    'default', 'dracula', 'nord', 'gruvbox', 'tokyo-night',
    'catppuccin', 'solarized-dark', 'monokai', 'one-dark',
    'material', 'everforest', 'kanagawa', 'rose-pine',
    'ayu', 'nightfox', 'vesper', 'oxocarbon', 'moonfly',
    'sonokai', 'iceberg', 'panda', 'carbonfox', 'duskfox',
    'light', 'github-light', 'paper', 'cyberpunk', 'matrix', 'hackerman'
  ];

  // Названия для подсказки
  var NAMES = {
    'default': 'Amber', 'dracula': 'Dracula', 'nord': 'Nord',
    'gruvbox': 'Gruvbox', 'tokyo-night': 'Tokyo Night',
    'catppuccin': 'Catppuccin', 'solarized-dark': 'Solarized Dark',
    'monokai': 'Monokai', 'one-dark': 'One Dark', 'material': 'Material',
    'everforest': 'Everforest', 'kanagawa': 'Kanagawa',
    'rose-pine': 'Rosé Pine', 'ayu': 'Ayu', 'nightfox': 'Nightfox',
    'vesper': 'Vesper', 'oxocarbon': 'Oxocarbon', 'moonfly': 'Moonfly',
    'sonokai': 'Sonokai', 'iceberg': 'Iceberg', 'panda': 'Panda',
    'carbonfox': 'Carbonfox', 'duskfox': 'Duskfox',
    'light': 'Light', 'github-light': 'GitHub Light',
    'paper': 'Paper', 'cyberpunk': 'Cyberpunk', 'matrix': 'Matrix',
    'hackerman': 'Hackerman'
  };

  function getSaved() {
    try {
      var t = localStorage.getItem('site-theme');
      if (t) return t;
    } catch(e) {}
    var m = document.cookie.match(/(?:^|;\s*)site-theme=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : 'default';
  }

  function apply(v) {
    var r = document.documentElement;
    if (v === 'default' || !v) {
      r.removeAttribute('data-site-theme');
      if (document.body) document.body.removeAttribute('data-site-theme');
    } else {
      r.setAttribute('data-site-theme', v);
      if (document.body) document.body.setAttribute('data-site-theme', v);
    }
    try { localStorage.setItem('site-theme', v); } catch(e) {}
    document.cookie = 'site-theme=' + encodeURIComponent(v) + ';path=/;max-age=31536000';
    // Синхронизация с селектом
    var sel = document.querySelector('.theme-switcher select');
    if (sel) sel.value = v;
  }

  function init() {
    // Только на мобиле
    if (!window.matchMedia('(max-width: 768px)').matches) return;

    var header = document.querySelector('.header-inner');
    if (!header) return;

    // Уже есть? Пропускаем
    if (header.querySelector('.theme-picker-btn')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-picker-btn';
    btn.setAttribute('aria-label', 'Сменить тему');
    btn.textContent = '🎨';

    // Вставляем перед гамбургером, если он есть, иначе — в конец
    var menuToggle = header.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.parentNode.insertBefore(btn, menuToggle);
    } else {
      header.appendChild(btn);
    }

    // === Клик = следующая тема ===
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      var current = getSaved();
      var idx = THEMES.indexOf(current);
      var next = THEMES[(idx + 1) % THEMES.length];

      apply(next);

      // Показываем название темы всплывашкой
      var toast = document.createElement('div');
      toast.className = 'theme-toast';
      toast.textContent = NAMES[next] || next;
      document.body.appendChild(toast);

      setTimeout(function() {
        toast.classList.add('fade');
        setTimeout(function() { toast.remove(); }, 300);
      }, 1200);

      // Анимация кнопки
      btn.style.transform = 'scale(0.85) rotate(-15deg)';
      setTimeout(function() {
        btn.style.transform = '';
      }, 200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Второй запуск — если header перестроился другими скриптами
  setTimeout(init, 500);
})();
