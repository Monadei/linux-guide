(function() {
  try {
    if (sessionStorage.getItem('boot-shown') === '1') return;
  } catch(e) {}

  // Пиксельный Tux (Linux-пингвин) — 32x32
  // 0 = прозрачный, 1 = чёрный (тело), 2 = белый (живот), 3 = оранжевый (клюв/лапы)
  var TUX = [
    '00000000000000000000000000000000',
    '00000000000000111110000000000000',
    '00000000000011111111100000000000',
    '00000000000111111111110000000000',
    '00000000000111111111110000000000',
    '00000000001111111111111000000000',
    '00000000001111112221111000000000',
    '00000000001111122222111000000000',
    '00000000001111112221111000000000',
    '00000000001111111111111000000000',
    '00000000011111111111111100000000',
    '00000001111111111111111110000000',
    '00000011111111111111111111000000',
    '00000111111111111111111111100000',
    '00001111111111111111111111110000',
    '00011111111111111111111111111000',
    '00011111111111222211111111111000',
    '00111111111112222221111111111100',
    '00111111111122222222111111111100',
    '00111111111122222222111111111100',
    '00111111111112222221111111111100',
    '00111111111111222211111111111100',
    '00111111111111111111111111111100',
    '00111111111111111111111111111100',
    '00011111111111111111111111111000',
    '00001111111111111111111111110000',
    '00000111111111111111111111100000',
    '00000011133331111113333111000000',
    '00000001133331111113333110000000',
    '00000000111111111111111100000000',
    '00000000011111111111111000000000',
    '00000000001111111111110000000000'
  ];

  var COLORS = {
    '1': '#000000',   // тело
    '2': '#ffffff',   // живот
    '3': '#ffb000'    // клюв и лапы
  };

  document.addEventListener('DOMContentLoaded', function() {
    var screen = document.createElement('div');
    screen.className = 'boot-screen';
    screen.innerHTML = '<div class="boot-tux-wrap"><div class="boot-tux"></div><div class="boot-text"></div></div>';
    document.body.appendChild(screen);

    document.body.style.overflow = 'hidden';

    var tuxEl = screen.querySelector('.boot-tux');
    var textEl = screen.querySelector('.boot-text');

    // === Фаза 1: Пиксели Tux собираются по одному ===
    var totalPixels = 0;
    for (var r = 0; r < TUX.length; r++) {
      var row = TUX[r];
      for (var c = 0; c < row.length; c++) {
        if (row[c] !== '0') totalPixels++;
      }
    }

    // Создаём все пиксели, но сначала невидимые
    var pixelEls = [];
    for (var r = 0; r < TUX.length; r++) {
      for (var c = 0; c < TUX[r].length; c++) {
        var ch = TUX[r][c];
        var px = document.createElement('div');
        px.className = 'boot-px';
        px.style.gridRow = (r + 1);
        px.style.gridColumn = (c + 1);
        if (ch !== '0') {
          px.style.backgroundColor = COLORS[ch];
          px.dataset.color = COLORS[ch];
          pixelEls.push(px);
        }
        tuxEl.appendChild(px);
      }
    }

    // Показываем пиксели по одному с задержкой
    var i = 0;
    var startTime = Date.now();
    var MAX_TIME = 700; // все пиксели за 700 мс максимум

    function revealPixels() {
      var elapsed = Date.now() - startTime;
      var needed = Math.min(pixelEls.length, Math.ceil(elapsed / MAX_TIME * pixelEls.length));
      
      while (i < needed && i < pixelEls.length) {
        var px = pixelEls[i];
        px.style.opacity = '1';
        px.style.transform = 'scale(1)';
        i++;
      }
      
      if (i < pixelEls.length) {
        requestAnimationFrame(revealPixels);
      } else {
        // Все пиксели показаны — пауза и текст
        onPixelsDone();
      }
    }

    setTimeout(revealPixels, 100);

    function onPixelsDone() {
      // Текст мигает
      textEl.textContent = 'Monade OS';
      textEl.classList.add('boot-text-show');

      setTimeout(function() {
        // Вспышка и исчезновение
        screen.classList.add('boot-flash');
        setTimeout(function() {
          screen.classList.add('boot-fade');
          setTimeout(function() {
            screen.remove();
            document.body.style.overflow = '';
            try { sessionStorage.setItem('boot-shown', '1'); } catch(e) {}
          }, 400);
        }, 200);
      }, 600);
    }

    // Минимальная длительность — 1.2 сек
    setTimeout(function() {
      if (!textEl.classList.contains('boot-text-show')) {
        textEl.textContent = 'Monade OS';
        textEl.classList.add('boot-text-show');
      }
    }, 1200);
  });
})();
