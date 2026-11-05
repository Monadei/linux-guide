(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Создаем canvas
    var canvas = document.createElement('canvas');
    canvas.id = 'live-bg-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none'; // Клики проходят сквозь
    canvas.style.opacity = '0.2'; // Прозрачность фона
    document.body.prepend(canvas);

    var ctx = canvas.getContext('2d');
    var width, height;

    // Азиатские символы
    var chars = ['シ', 'ス', 'テ', 'ム', 'コ', 'ー', 'ド', '端', '末', '龍', '力', '未', '来', '知', '恵', '力', '心'];
    var columns = [];
    var fontSize = 20; 
    var drops = [];
    var speeds = [];

    // Массив для волн (ряби)
    var ripples = [];

    // Получаем акцентный цвет из темы
    function getAccentColor() {
      var style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--accent').trim() || '#ffb000';
    }

    var accentColor = getAccentColor();

    // Следим за сменой темы
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'data-site-theme') {
          accentColor = getAccentColor();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Настройка размера
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      var colCount = Math.floor(width / fontSize);
      drops = [];
      speeds = [];
      for (var i = 0; i < colCount; i++) {
        drops[i] = Math.random() * height;
        speeds[i] = 0.5 + Math.random() * 2; 
      }
    }

    window.addEventListener('resize', resize);
    resize();

    // Обработка кликов для создания ряби
    window.addEventListener('click', function(e) {
      // Игнорируем клики по ссылкам и кнопкам, чтобы не мешать
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 150 + Math.random() * 100, // Случайный размер волны
        opacity: 1
      });
    });

    // Анимация
    function draw() {
      // Определяем цвет фона (для шлейфа)
      var style = getComputedStyle(document.documentElement);
      var bg = style.getPropertyValue('--bg').trim();
      var isLight = (bg.indexOf('#f') === 0 || bg.indexOf('#e') === 0 || bg.indexOf('#d') === 0);
      
      if (isLight) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      }
      
      ctx.fillRect(0, 0, width, height);

      ctx.font = fontSize + 'px "Noto Sans JP", sans-serif';
      
      // Отрисовка падающих символов
      for (var i = 0; i < drops.length; i++) {
        var text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = accentColor;
        
        var x = i * fontSize;
        var y = drops[i];

        ctx.fillText(text, x, y);

        drops[i] += speeds[i];

        if (drops[i] > height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = 0.5 + Math.random() * 2;
        }
      }

      // Отрисовка и обновление волн (ряби)
      for (var j = ripples.length - 1; j >= 0; j--) {
        var r = ripples[j];
        
        // Рисуем круг
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = r.opacity;
        ctx.stroke();
        
        // Рисуем второй круг чуть меньше для эффекта двойной волны
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.7, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.globalAlpha = r.opacity * 0.5;
        ctx.stroke();

        ctx.globalAlpha = 1;

        // Увеличиваем радиус и уменьшаем прозрачность
        r.radius += 3; 
        r.opacity -= 0.02;

        // Удаляем волну, если она стала слишком большой или прозрачной
        if (r.opacity <= 0) {
          ripples.splice(j, 1);
        }
      }

      requestAnimationFrame(draw);
    }

    draw();
  });
})();
