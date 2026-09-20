(function() {
  // Тема по времени суток (только если пользователь не выбирал)
  var hasChoice = false;
  try { hasChoice = !!localStorage.getItem('site-theme'); } catch(e) {}
  if (!hasChoice) {
    var h = new Date().getHours();
    var t = (h >= 7 && h < 20) ? 'light' : 'default';
    document.documentElement.setAttribute('data-site-theme', t);
    if (document.body) document.body.setAttribute('data-site-theme', t);
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Skip to content
    var skip = document.createElement('a');
    skip.href = '#main-content';
    skip.className = 'skip-to-content';
    skip.textContent = 'Перейти к содержимому';
    document.body.insertBefore(skip, document.body.firstChild);
    var main = document.querySelector('main');
    if (main) main.id = 'main-content';

    // Мобильное меню
    var header = document.querySelector('.header-inner');
    var nav = document.querySelector('.nav');
    if (header && nav) {
      var toggle = document.createElement('button');
      toggle.className = 'menu-toggle';
      toggle.setAttribute('aria-label', 'Меню');
      toggle.textContent = '☰';
      toggle.onclick = function() { nav.classList.toggle('open'); };
      var logo = header.querySelector('.logo');
      if (logo) logo.insertAdjacentElement('afterend', toggle);
    }

    // Контрастная тема — кнопка в шапке
    if (header) {
      var cc = document.createElement('button');
      cc.className = 'menu-toggle';
      cc.style.display = 'block';
      cc.textContent = '◐';
      cc.title = 'Контрастная тема';
      cc.onclick = function() {
        document.body.classList.toggle('contrast-mode');
        localStorage.setItem('contrast', document.body.classList.contains('contrast-mode') ? '1' : '0');
      };
      header.appendChild(cc);
      if (localStorage.getItem('contrast') === '1') document.body.classList.add('contrast-mode');
    }

    // Горячие клавиши
    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === '/') {
        e.preventDefault();
        var s = document.querySelector('.search-box input');
        if (s) s.focus();
      }
      if (e.key === 'Escape') {
        var r = document.querySelector('.search-results');
        if (r) r.classList.remove('active');
      }
      if (e.key === 't' || e.key === 'T') {
        var themes = ['default','light','dracula','nord','gruvbox','tokyo-night','catppuccin','matrix'];
        var cur = window.__getTheme ? window.__getTheme() : 'default';
        var idx = themes.indexOf(cur);
        var next = themes[(idx + 1) % themes.length];
        if (window.__applyTheme) window.__applyTheme(next);
      }
    });

    // Выбор шрифта
    if (header) {
      var fonts = [
        { v: 'default', n: 'Шрифт' },
        { v: 'jetbrains', n: 'JetBrains Mono' },
        { v: 'fira', n: 'Fira Code' },
        { v: 'iosevka', n: 'Iosevka' },
        { v: 'hack', n: 'Hack' },
        { v: 'cascadia', n: 'Cascadia' },
        { v: 'ibm', n: 'IBM Plex' }
      ];
      var savedFont = localStorage.getItem('font-family') || 'default';
      if (savedFont !== 'default') document.body.style.fontFamily = getFontStack(savedFont);
      var fontBox = document.createElement('div');
      fontBox.className = 'theme-switcher';
      var fsel = document.createElement('select');
      fonts.forEach(function(f) {
        var o = document.createElement('option');
        o.value = f.v; o.textContent = f.n;
        if (f.v === savedFont) o.selected = true;
        fsel.appendChild(o);
      });
      fsel.addEventListener('change', function() {
        var v = this.value;
        document.body.style.fontFamily = v === 'default' ? '' : getFontStack(v);
        localStorage.setItem('font-family', v);
      });
      fontBox.appendChild(fsel);
      header.appendChild(fontBox);
    }

    // Пасхалка sandwich
    var si = document.querySelector('.search-box input');
    if (si) si.addEventListener('input', function() {
      if (this.value.toLowerCase() === 'sudo make me a sandwich') {
        var t = document.createElement('div');
        t.className = 'sandwich-toast';
        t.textContent = 'Okay. 🥪';
        document.body.appendChild(t);
        setTimeout(function(){ t.remove(); }, 2000);
        this.value = '';
      }
    });

    // Мини-терминал
    var footer = document.querySelector('.site-footer .container');
    if (footer && !document.querySelector('.mini-term')) {
      var term = document.createElement('div');
      term.className = 'mini-term';
      term.innerHTML = '<div class="out">Linux Guide Shell v1.0 — введи help</div>' +
        '<div><span class="prompt">guest@guide:~$</span> <input type="text" id="term-input" autocomplete="off"></div>';
      footer.appendChild(term);
      var ti = term.querySelector('#term-input');
      ti.addEventListener('keydown', function(e) {
        if (e.key !== 'Enter') return;
        var cmd = this.value.trim().toLowerCase();
        this.value = '';
        var out = '';
        if (cmd === 'help') out = 'Команды: help, ls, about, theme, matrix, contrast, random, clear';
        else if (cmd === 'ls') out = 'index.html  install.html  faq.html  distros/  about.html';
        else if (cmd === 'about') out = 'Linux Guide — сделал Артём (Monadei), 2026';
        else if (cmd === 'theme') out = 'Тема: ' + (window.__getTheme ? window.__getTheme() : 'default');
        else if (cmd === 'matrix') { if (window.__applyTheme) window.__applyTheme('matrix'); out = 'Wake up, Neo...'; }
        else if (cmd === 'contrast') { document.body.classList.toggle('contrast-mode'); out = 'Контраст переключён'; }
        else if (cmd === 'random') { out = 'Открываю случайный дистрибутив...'; setTimeout(function(){ location.href = 'distros/' + randomDistro() + '.html'; }, 500); }
        else if (cmd === 'clear') { term.querySelectorAll('.out, .line').forEach(function(el){el.remove();}); return; }
        else if (cmd === '') return;
        else out = 'bash: ' + cmd + ': команда не найдена';
        var line = document.createElement('div');
        line.className = 'out'; line.textContent = '$ ' + cmd;
        term.insertBefore(line, term.lastElementChild);
        var resp = document.createElement('div');
        resp.className = 'out'; resp.textContent = out;
        term.insertBefore(resp, term.lastElementChild);
      });
    }

    // Service Worker
    if ('serviceWorker' in navigator) {
      var swPath = (window.location.pathname.indexOf('/distros/') !== -1 ? '../' : '') + 'service-worker.js';
      navigator.serviceWorker.register(swPath).catch(function(){});
    }
  });

  function getFontStack(v) {
    var map = {
      jetbrains: '"JetBrains Mono", monospace', fira: '"Fira Code", monospace',
      iosevka: 'Iosevka, monospace', hack: 'Hack, monospace',
      cascadia: '"Cascadia Code", monospace', ibm: '"IBM Plex Mono", monospace'
    };
    return map[v] || '';
  }
})();

window.randomDistro = function() {
  var d = ['debian','ubuntu','mint','pop-os','zorin','elementary','kali','parrot','mxlinux','antix','puppy','lubuntu','xubuntu','kubuntu','deepin','raspberry-pi-os','fedora','almalinux','rocky','arch','manjaro','endeavouros','cachyos','garuda','steamos','opensuse','gentoo','slackware','void','nixos','alpine','tails','qubes','nobara','bazzite','lmde','artix','solus','clear'];
  return d[Math.floor(Math.random() * d.length)];
};
