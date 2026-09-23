(function() {
  var KEY = 'site-theme';

  // === Чтение темы ===
  function readTheme() {
    // 1. URL — самый надёжный способ
    try {
      var m = window.location.search.match(/[?&]theme=([^&]+)/);
      if (m) return decodeURIComponent(m[1]);
    } catch(e) {}
    // 2. localStorage
    try { var v = localStorage.getItem(KEY); if (v) return v; } catch(e) {}
    // 3. cookie
    try {
      var c = document.cookie.match(/(?:^|;\s*)site-theme=([^;]+)/);
      if (c) return decodeURIComponent(c[1]);
    } catch(e) {}
    return 'default';
  }

  // === Запись темы ===
  function writeTheme(v) {
    try { localStorage.setItem(KEY, v); } catch(e) {}
    try { document.cookie = 'site-theme=' + encodeURIComponent(v) + ';path=/;max-age=31536000'; } catch(e) {}
    // Обновляем URL без перезагрузки
    try {
      var url = new URL(window.location.href);
      if (v === 'default') url.searchParams.delete('theme');
      else url.searchParams.set('theme', v);
      window.history.replaceState({}, '', url.toString());
    } catch(e) {}
  }

  // === Применение темы ===
  function applyTheme(v) {
    var root = document.documentElement;
    if (!v || v === 'default') {
      root.removeAttribute('data-site-theme');
      if (document.body) document.body.removeAttribute('data-site-theme');
    } else {
      root.setAttribute('data-site-theme', v);
      if (document.body) document.body.setAttribute('data-site-theme', v);
    }
  }

  // === Применяем сразу ===
  var current = readTheme();
  applyTheme(current);

  // === Глобальные функции ===
  window.__applyTheme = function(v) {
    applyTheme(v);
    writeTheme(v);
    current = v;
  };
  window.__getTheme = function() { return current; };

  // === Polling для синхронизации между вкладками ===
  // Работает на file:// в Chrome и Firefox
  setInterval(function() {
    var t = readTheme();
    if (t !== current) {
      current = t;
      applyTheme(t);
      var sel = document.querySelector('.theme-switcher select');
      if (sel) sel.value = t;
    }
  }, 200);

  // === Синхронизация через storage event (http/https) ===
  window.addEventListener('storage', function(e) {
    if (e.key === KEY) {
      var v = e.newValue || 'default';
      current = v;
      applyTheme(v);
      var sel = document.querySelector('.theme-switcher select');
      if (sel) sel.value = v;
    }
  });

  // === Перехват кликов по ссылкам — передаём тему через URL ===
  document.addEventListener('click', function(e) {
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    // Только внутренние ссылки, не внешние, не якоря
    if (href.match(/^(https?:|mailto:|tel:|javascript:|#)/)) return;
    // Если тема не дефолт — добавляем ?theme=X
    if (current && current !== 'default') {
      var sep = href.indexOf('?') === -1 ? '?' : '&';
      // Не дублируем если уже есть
      if (href.indexOf('theme=') === -1) {
        a.setAttribute('href', href + sep + 'theme=' + encodeURIComponent(current));
      }
    }
  }, true); // capture — сработает до перехода

  // === Список тем ===
  var THEMES = [
    ['default','Amber'],['dracula','Dracula'],['nord','Nord'],
    ['gruvbox','Gruvbox'],['tokyo-night','Tokyo Night'],['catppuccin','Catppuccin'],
    ['solarized-dark','Solarized Dark'],['solarized-light','Solarized Light'],
    ['monokai','Monokai'],['one-dark','One Dark'],['material','Material'],
    ['everforest','Everforest'],['kanagawa','Kanagawa'],['rose-pine','Rosé Pine'],
    ['ayu','Ayu'],['nightfox','Nightfox'],['vesper','Vesper'],
    ['oxocarbon','Oxocarbon'],['moonfly','Moonfly'],['sonokai','Sonokai'],
    ['iceberg','Iceberg'],['panda','Panda'],['carbonfox','Carbonfox'],
    ['duskfox','Duskfox'],['light','Light'],['github-light','GitHub Light'],
    ['paper','Paper'],['cyberpunk','Cyberpunk'],['matrix','Matrix'],['hackerman','Hackerman']
  ];

  // === UI ===
  document.addEventListener('DOMContentLoaded', function() {
    var header = document.querySelector('.header-inner');
    if (!header) return;

    // Селект тем
    var wrap = document.createElement('div');
    wrap.className = 'theme-switcher';
    var select = document.createElement('select');
    THEMES.forEach(function(t) {
      var o = document.createElement('option');
      o.value = t[0]; o.textContent = t[1];
      if (t[0] === current) o.selected = true;
      select.appendChild(o);
    });
    select.addEventListener('change', function() {
      window.__applyTheme(this.value);
    });
    wrap.appendChild(select);
    header.appendChild(wrap);

    // Кнопки A-/A+
    var sz = parseInt(localStorage.getItem('font-size') || '15', 10);
    
    

    // Наверх
    var tt = document.createElement('button');
    tt.className = 'to-top'; tt.textContent = '↑';
    tt.onclick = function() { window.scrollTo({top:0,behavior:'smooth'}); };
    document.body.appendChild(tt);
    window.addEventListener('scroll', function() {
      tt.classList.toggle('visible', window.scrollY > 400);
    });

    // Прогресс-бар
    var prog = document.createElement('div');
    prog.className = 'read-progress';
    document.body.appendChild(prog);
    window.addEventListener('scroll', function() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (h > 0 ? window.scrollY / h * 100 : 0) + '%';
    });

    // Konami
    var k = [38,38,40,40,37,39,37,39,66,65], kp = 0;
    document.addEventListener('keydown', function(e) {
      if (e.keyCode === k[kp]) {
        kp++;
        if (kp === k.length) {
          kp = 0;
          window.__applyTheme('matrix');
          var t = document.createElement('div');
          t.className = 'konami-toast';
          t.textContent = '> Wake up, Neo...';
          document.body.appendChild(t);
          setTimeout(function(){ t.remove(); }, 3000);
        }
      } else kp = 0;
    });
  });
})();
