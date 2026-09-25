(function() {
  // Список тем с превью-цветами
  var THEMES = [
    { id: 'default', name: 'Amber', colors: ['#0a0a0a','#121212','#ffb000','#d6d6d6'] },
    { id: 'dracula', name: 'Dracula', colors: ['#282a36','#44475a','#bd93f9','#f8f8f2'] },
    { id: 'nord', name: 'Nord', colors: ['#2e3440','#4c566a','#88c0d0','#eceff4'] },
    { id: 'gruvbox', name: 'Gruvbox', colors: ['#282828','#504945','#fabd2f','#ebdbb2'] },
    { id: 'tokyo-night', name: 'Tokyo Night', colors: ['#1a1b26','#2f3549','#7aa2f7','#c0caf5'] },
    { id: 'catppuccin', name: 'Catppuccin', colors: ['#1e1e2e','#45475a','#cba6f7','#cdd6f4'] },
    { id: 'solarized-dark', name: 'Solarized Dark', colors: ['#002b36','#073642','#b58900','#93a1a1'] },
    { id: 'solarized-light', name: 'Solarized Light', colors: ['#fdf6e3','#eee8d5','#b58900','#657b83'] },
    { id: 'monokai', name: 'Monokai', colors: ['#272822','#49483e','#a6e22e','#f8f8f2'] },
    { id: 'one-dark', name: 'One Dark', colors: ['#282c34','#353b45','#61afef','#abb2bf'] },
    { id: 'material', name: 'Material', colors: ['#263238','#37474f','#82aaff','#eeffff'] },
    { id: 'everforest', name: 'Everforest', colors: ['#2d353b','#3d484d','#a7c080','#d3c6aa'] },
    { id: 'kanagawa', name: 'Kanagawa', colors: ['#1f1f28','#363646','#7e9cd8','#dcd7ba'] },
    { id: 'rose-pine', name: 'Rosé Pine', colors: ['#191724','#26233a','#ebbcba','#e0def4'] },
    { id: 'ayu', name: 'Ayu', colors: ['#0b0e14','#1a1f29','#e6b450','#bfbdb6'] },
    { id: 'nightfox', name: 'Nightfox', colors: ['#192330','#29394d','#719cd6','#cdcecf'] },
    { id: 'vesper', name: 'Vesper', colors: ['#101010','#1c1c1c','#ffc799','#ffffff'] },
    { id: 'oxocarbon', name: 'Oxocarbon', colors: ['#161616','#393939','#78a9ff','#f2f4f8'] },
    { id: 'moonfly', name: 'Moonfly', colors: ['#080808','#1c1c1c','#80a0ff','#bdbdbd'] },
    { id: 'sonokai', name: 'Sonokai', colors: ['#2c2e34','#414550','#9ed072','#e2e2e3'] },
    { id: 'iceberg', name: 'Iceberg', colors: ['#161821','#262a3a','#84a0c6','#c6c8d1'] },
    { id: 'panda', name: 'Panda', colors: ['#292a2b','#3e4142','#ff75b5','#e6e6e6'] },
    { id: 'carbonfox', name: 'Carbonfox', colors: ['#161616','#282828','#33b1ff','#f2f4f8'] },
    { id: 'duskfox', name: 'Duskfox', colors: ['#232136','#393552','#c4a7e7','#e0def4'] },
    { id: 'light', name: 'Light', colors: ['#f5f5f5','#e8e8e8','#0066cc','#1a1a1a'] },
    { id: 'github-light', name: 'GitHub Light', colors: ['#ffffff','#eaeef2','#0969da','#24292f'] },
    { id: 'paper', name: 'Paper', colors: ['#faf4e8','#e8dcc8','#b8651a','#3a3226'] },
    { id: 'cyberpunk', name: 'Cyberpunk', colors: ['#0d0221','#241447','#ff2a6d','#e0e0ff'] },
    { id: 'matrix', name: 'Matrix', colors: ['#000000','#141414','#00ff41','#00ff41'] },
    { id: 'hackerman', name: 'Hackerman', colors: ['#0a0e14','#161d28','#ffb454','#b3b1ad'] }
  ];

  function getSaved() {
    try {
      var t = localStorage.getItem('site-theme');
      if (t) return t;
    } catch(e) {}
    var m = document.cookie.match(/(?:^|;\s*)site-theme=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : 'default';
  }

  function applyTheme(v) {
    var root = document.documentElement;
    if (v === 'default' || !v) {
      root.removeAttribute('data-site-theme');
      if (document.body) document.body.removeAttribute('data-site-theme');
    } else {
      root.setAttribute('data-site-theme', v);
      if (document.body) document.body.setAttribute('data-site-theme', v);
    }
    try { localStorage.setItem('site-theme', v); } catch(e) {}
    document.cookie = 'site-theme=' + encodeURIComponent(v) + ';path=/;max-age=31536000';
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Показываем только на мобиле
    var isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    var header = document.querySelector('.header-inner');
    if (!header) return;

    // ===== Кнопка-палитра =====
    var btn = document.createElement('button');
    btn.className = 'theme-picker-btn';
    btn.setAttribute('aria-label', 'Выбрать тему');
    btn.innerHTML = '<span class="tp-icon">🎨</span>';

    // Вставляем рядом с гамбургером
    var menuToggle = header.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.parentNode.insertBefore(btn, menuToggle);
    } else {
      header.appendChild(btn);
    }

    // ===== Модальное окно =====
    var modal = document.createElement('div');
    modal.className = 'theme-picker-modal';
    modal.innerHTML = '<div class="theme-picker-overlay"></div>' +
      '<div class="theme-picker-content">' +
        '<div class="theme-picker-head">' +
          '<h3>🎨 Выбери тему</h3>' +
          '<button class="theme-picker-close" aria-label="Закрыть">✕</button>' +
        '</div>' +
        '<div class="theme-picker-grid"></div>' +
      '</div>';
    document.body.appendChild(modal);

    var grid = modal.querySelector('.theme-picker-grid');
    var current = getSaved();

    THEMES.forEach(function(t) {
      var card = document.createElement('button');
      card.className = 'theme-picker-card';
      if (t.id === current) card.classList.add('active');
      card.setAttribute('data-theme', t.id);

      var swatches = t.colors.map(function(c) {
        return '<span style="background:' + c + '"></span>';
      }).join('');

      card.innerHTML = '<div class="tp-swatches">' + swatches + '</div>' +
                       '<div class="tp-name">' + t.name + '</div>';

      card.addEventListener('click', function() {
        applyTheme(t.id);
        grid.querySelectorAll('.theme-picker-card').forEach(function(c) {
          c.classList.remove('active');
        });
        card.classList.add('active');
        // Обновляем селект в шапке если он есть
        var select = document.querySelector('.theme-switcher select');
        if (select) select.value = t.id;
        // Закрываем с задержкой
        setTimeout(function() {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }, 300);
      });

      grid.appendChild(card);
    });

    function openModal() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', openModal);
    modal.querySelector('.theme-picker-overlay').addEventListener('click', closeModal);
    modal.querySelector('.theme-picker-close').addEventListener('click', closeModal);

    // Esc закрывает
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  });
})();
