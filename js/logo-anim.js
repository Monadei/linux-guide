(function() {
  var NAME = 'Monade OS';
  var GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#01';

  document.addEventListener('DOMContentLoaded', function() {
    var logo = document.querySelector('.logo');
    if (!logo) return;

    var played = false;
    try { played = sessionStorage.getItem('logo-played') === '1'; } catch(e) {}

    logo.innerHTML = '';
    logo.classList.add('animated-logo');

    var textWrap = document.createElement('span');
    textWrap.className = 'logo-text';
    logo.appendChild(textWrap);

    var cursor = document.createElement('span');
    cursor.className = 'logo-cursor';
    cursor.textContent = '_';
    logo.appendChild(cursor);

    if (played) {
      textWrap.textContent = NAME;
      startGlitch();
      return;
    }

    var i = 0;
    function typeChar() {
      if (i < NAME.length) {
        var ch = NAME[i];
        var span = document.createElement('span');
        span.className = 'logo-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        textWrap.appendChild(span);
        i++;
        setTimeout(typeChar, 70 + Math.random() * 60);
      } else {
        try { sessionStorage.setItem('logo-played', '1'); } catch(e) {}
        startGlitch();
      }
    }
    setTimeout(typeChar, 300);

    function startGlitch() {
      setInterval(function() {
        var chars = textWrap.querySelectorAll('.logo-char');
        if (chars.length === 0) return;
        var idx = Math.floor(Math.random() * chars.length);
        var el = chars[idx];
        if (!el || el.textContent === '\u00A0') return;
        var original = el.textContent;
        var g = 0;
        var interval = setInterval(function() {
          el.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          g++;
          if (g >= 3) {
            clearInterval(interval);
            el.textContent = original;
          }
        }, 50);
      }, 4000 + Math.random() * 3000);
    }

    logo.addEventListener('click', function() {
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