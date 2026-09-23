(function() {
  // Не показывать при повторном заходе в ту же сессию
  try {
    if (sessionStorage.getItem('boot-shown') === '1') return;
  } catch(e) {}

  var LINES = [
    { text: '> Инициализация Monade OS...', delay: 300 },
    { text: '> Проверка ядра...', delay: 200 },
    { text: '  [OK] Linux 7.0.0', delay: 150 },
    { text: '> Загрузка дистрибутивов...', delay: 250 },
    { text: '  [OK] 235 страниц', delay: 150 },
    { text: '> Подключение к базе знаний...', delay: 200 },
    { text: '  [OK] 200+ дистрибутивов', delay: 150 },
    { text: '> Проверка тем оформления...', delay: 200 },
    { text: '  [OK] 30 тем', delay: 150 },
    { text: '> Запуск интерфейса...', delay: 300 },
    { text: '', delay: 200 },
    { text: 'Welcome, user.', delay: 400, accent: true }
  ];

  document.addEventListener('DOMContentLoaded', function() {
    var screen = document.createElement('div');
    screen.className = 'boot-screen';
    screen.innerHTML = '<div class="boot-content"><pre class="boot-output"></pre><span class="boot-cursor">_</span></div>';
    document.body.appendChild(screen);

    // Блокируем скролл
    document.body.style.overflow = 'hidden';

    var out = screen.querySelector('.boot-output');
    var i = 0;

    function typeLine() {
      if (i >= LINES.length) {
        // Все строки напечатаны — пауза и исчезновение
        setTimeout(function() {
          screen.classList.add('boot-fade');
          setTimeout(function() {
            screen.remove();
            document.body.style.overflow = '';
            try { sessionStorage.setItem('boot-shown', '1'); } catch(e) {}
          }, 700);
        }, 500);
        return;
      }

      var line = LINES[i];
      var text = line.text;
      var j = 0;
      var lineEl = document.createElement('div');
      if (line.accent) lineEl.className = 'boot-accent';
      out.appendChild(lineEl);

      function typeChar() {
        if (j < text.length) {
          lineEl.textContent += text[j];
          j++;
          setTimeout(typeChar, 15 + Math.random() * 20);
        } else {
          i++;
          setTimeout(typeLine, line.delay);
        }
      }

      if (text === '') {
        lineEl.innerHTML = '&nbsp;';
        i++;
        setTimeout(typeLine, line.delay);
      } else {
        typeChar();
      }
    }

    setTimeout(typeLine, 200);
  });
})();
