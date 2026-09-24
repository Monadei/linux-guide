(function() {
  var NAME = 'Monade OS';
  var GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#01';

  document.addEventListener('DOMContentLoaded', function() {
    var logo = document.querySelector('.logo');
    if (!logo) return;

    // Убираем ::before и ::after через CSS-класс
    logo.classList.add('animated-logo');
    logo.innerHTML = '';

    var textWrap = document.createElement('span');
    textWrap.className = 'logo-text';
    logo.appendChild(textWrap);

    var cursor = document.createElement('span');
    cursor.className = 'logo-cursor';
    cursor.textContent = '_';
    logo.appendChild(cursor);

    // ===== ПРОВЕРКА: видел ли уже в этой сессии =====
    var played = false;
    try { played = sessionStorage.getItem('logo-played') === '1'; } catch(e) {}

    if (played) {
      // Просто показать текст
      textWrap.textContent = NAME;
      startGlitch();
      return;
    }

    // ===== АНИМАЦИЯ ПЕЧАТИ =====
    var i = 0;
    function typeChar() {
      if (i < NAME.length) {
        var ch = NAME[i];
        var span = document.createElement('span');
        span.className = 'logo-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        textWrap.appendChild(span);
        i++;
        setTimeout(typeChar, 80 + Math.random() * 60);
      } else {
        try { sessionStorage.setItem('logo-played', '1'); } catch(e) {}
        startGlitch();
      }
    }

    setTimeout(typeChar, 300);

    // ===== ГЛЮК-ЭФФЕКТ КАЖДЫЕ 4-7 СЕК =====
    function startGlitch() {
      setInterval(function() {
        var chars = textWrap.querySelectorAll('.logo-char');
        if (chars.length === 0) return;
        var idx = Math.floor(Math.random() * chars.length);
        var el = chars[idx];
        if (!el || el.textContent === '\u00A0') return;

        var original = el.textContent;
        var glitchCount = 2 + Math.floor(Math.random() * 2);
        var g = 0;
        var interval = setInterval(function() {
          el.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          g++;
          if (g >= glitchCount) {
            clearInterval(interval);
            el.textContent = original;
          }
        }, 50);
      }, 4000 + Math.random() * 3000);
    }

    // ===== КЛИК — РУЧНОЙ ГЛЮК =====
    logo.addEventListener('click', function(e) {
      // Только если клик по логотипу, не по ссылке перехода
      if (e.target.tagName === 'A') return;
      var chars = textWrap.querySelectorAll('.logo-char');
      chars.forEach(function(el, idx) {
        setTimeout(function() {
          var original = el.textContent;
          if (original === '\u00A0') return;
          el.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          setTimeout(function() { el.textContent = original; }, 100);
        }, idx * 30);
      });
    });
  });
})();
