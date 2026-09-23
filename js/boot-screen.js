(function() {
  // Показывать только раз за сессию
  try {
    if (sessionStorage.getItem('boot-shown') === '1') return;
  } catch(e) {}

  // Пиксельный пингвин Tux — 24×24 (компактнее)
  // 0 = пусто, 1 = чёрное тело, 2 = белый живот, 3 = оранжевый клюв/лапы
  var TUX = [
    '000000011111000000000000',
    '000000111111100000000000',
    '000001111111110000000000',
    '000011111111111000000000',
    '000011111122110000000000',
    '000011112222210000000000',
    '000011111221110000000000',
    '000011111111110000000000',
    '000111111111111000000000',
    '001111111111111100000000',
    '011111111111111110000000',
    '111111111111111111000000',
    '111111111111111111100000',
    '111111111222211111100000',
    '111111112222221111100000',
    '111111111222211111100000',
    '111111111111111111100000',
    '011111111111111111000000',
    '001111111111111100000000',
    '000113331111333110000000',
    '000011111111111110000000',
    '000001111111111100000000',
    '000000111111110000000000',
    '000000001111100000000000'
  ];

  var COLORS = {
    '1': '#000000',
    '2': '#ffffff',
    '3': '#ffb000'
  };

  document.addEventListener('DOMContentLoaded', function() {
    var screen = document.createElement('div');
    screen.className = 'boot-screen';
    screen.innerHTML = '<div class="boot-tux"></div>';
    document.body.appendChild(screen);
    document.body.style.overflow = 'hidden';

    var tux = screen.querySelector('.boot-tux');

    // Собираем пиксели
    var pixels = [];
    for (var r = 0; r < TUX.length; r++) {
      for (var c = 0; c < TUX[r].length; c++) {
        var ch = TUX[r][c];
        var px = document.createElement('div');
        px.className = 'boot-px';
        px.style.gridRow = (r + 1);
        px.style.gridColumn = (c + 1);
        if (ch !== '0') {
          px.style.backgroundColor = COLORS[ch];
          pixels.push(px);
        }
        tux.appendChild(px);
      }
    }

    // Показываем пиксели по одному — всего 600 мс
    var i = 0;
    var startTime = Date.now();
    var TOTAL_TIME = 600;

    function reveal() {
      var elapsed = Date.now() - startTime;
      var needed = Math.min(pixels.length, Math.ceil(elapsed / TOTAL_TIME * pixels.length));

      while (i < needed && i < pixels.length) {
        pixels[i].style.opacity = '1';
        pixels[i].style.transform = 'scale(1)';
        i++;
      }

      if (i < pixels.length) {
        requestAnimationFrame(reveal);
      } else {
        // Всё собрано — пауза 200 мс и исчезновение
        setTimeout(function() {
          screen.classList.add('boot-fade');
          setTimeout(function() {
            screen.remove();
            document.body.style.overflow = '';
            try { sessionStorage.setItem('boot-shown', '1'); } catch(e) {}
          }, 300);
        }, 200);
      }
    }

    setTimeout(reveal, 50);
  });
})();
