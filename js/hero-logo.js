(function() {
  var NAME = 'Monade OS';
  var GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#01@$%&';

  document.addEventListener('DOMContentLoaded', function() {
    var heroLogo = document.querySelector('.hero-logo');
    if (!heroLogo) return;

    heroLogo.textContent = '';
    heroLogo.classList.add('pixel-logo');

    var container = document.createElement('div');
    container.className = 'hero-logo-text pixel-text';
    heroLogo.appendChild(container);

    var cursor = document.createElement('span');
    cursor.className = 'hero-cursor pixel-cursor';
    cursor.textContent = '_';
    heroLogo.appendChild(cursor);

    // === Фаза 1: глитч-каша из символов ===
    var chars = [];
    for (var i = 0; i < NAME.length; i++) {
      var span = document.createElement('span');
      span.className = 'px-char px-glitch-phase';
      span.textContent = NAME[i] === ' ' ? '\u00A0' : 
        GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      span.dataset.real = NAME[i];
      span.dataset.idx = i;
      // Случайное смещение для «взрыва»
      var angle = (Math.random() - 0.5) * Math.PI;
      var dist = 40 + Math.random() * 80;
      span.style.setProperty('--x', (Math.cos(angle) * dist).toFixed(0) + 'px');
      span.style.setProperty('--y', (Math.sin(angle) * dist).toFixed(0) + 'px');
      span.style.setProperty('--rot', ((Math.random() - 0.5) * 90).toFixed(0) + 'deg');
      container.appendChild(span);
      chars.push(span);
    }

    // Быстрая смена символов
    var glitchInterval = setInterval(function() {
      chars.forEach(function(ch) {
        if (ch.textContent !== '\u00A0') {
          ch.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
      });
    }, 60);

    // === Фаза 2: через 600 мс буквы слетаются ===
    setTimeout(function() {
      clearInterval(glitchInterval);
      
      chars.forEach(function(ch, i) {
        if (ch.dataset.real === ' ') {
          ch.textContent = '\u00A0';
        } else {
          ch.textContent = ch.dataset.real;
        }
        ch.classList.remove('px-glitch-phase');
        ch.classList.add('px-assemble');
        ch.style.animationDelay = (i * 0.08) + 's';
      });

      // === Фаза 3: лёгкий глик каждые 5 сек ===
      setInterval(function() {
        var el = chars[Math.floor(Math.random() * chars.length)];
        if (!el || el.textContent === '\u00A0') return;
        var orig = el.textContent;
        el.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        setTimeout(function() { el.textContent = orig; }, 100);
      }, 5000);

    }, 600);

    // Клик — повторить
    heroLogo.addEventListener('click', function() {
      location.reload();
    });
  });
})();
