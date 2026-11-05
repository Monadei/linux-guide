(function() {
  // Ждем загрузки страницы
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
    canvas.style.pointerEvents = 'none'; // Чтобы не мешал кликам
    canvas.style.opacity = '0.15'; // Прозрачность фона (не переборщи)
    document.body.prepend(canvas); // Вставляем в начало body

    var ctx = canvas.getContext('2d');
    var width, height;

    // Иероглифы (Система, Код, Терминал, Дракон, Сила, Сеть, Данные)
    var chars = ['シ', 'ス', 'テ', 'ム', 'コ', 'ー', 'ド', '端', '末', '龍', '力', '未', '来', '知', '恵'];
    
    var columns = [];
    var fontSize = 18; 
    var drops = []; // Позиции по Y для каждой колонки
    var speeds = []; // Скорости падения

    // Функция для получения акцентного цвета из CSS переменной
    function getAccentColor() {
      var style = getComputedStyle(document.documentElement);
      var accent = style.getPropertyValue('--accent').trim();
      // Если переменная пустая (на всякий случай), берем янтарный
      return accent || '#ffb000';
    }

    var accentColor = getAccentColor();

    // Обновляем цвет при смене темы
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
        // Начальная позиция: случайно разбрасываем по высоте (чтобы не начинали все с нуля)
        drops[i] = Math.random() * height;
        speeds[i] = 0.5 + Math.random() * 1.5; // Разная скорость для естественности
      }
    }

    window.addEventListener('resize', resize);
    resize();

    // Анимация
    function draw() {
      // Очищаем с легким шлейфом (эффект затухания)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; 
      // ВАЖНО: Если тема светлая, шлейф должен быть белым.
      // Проверяем фон через CSS переменную --bg
      var style = getComputedStyle(document.documentElement);
      var bg = style.getPropertyValue('--bg').trim();
      
      // Простая проверка на светлоту (если bg начинается с #f или #e, или это rgb с большими числами)
      var isLight = (bg.indexOf('#f') === 0 || bg.indexOf('#e') === 0 || bg.indexOf('#d') === 0);
      
      if (isLight) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      }
      
      ctx.fillRect(0, 0, width, height);

      ctx.font = fontSize + 'px "Noto Sans JP", sans-serif';
      
      for (var i = 0; i < drops.length; i++) {
        // Берем случайный иероглиф
        var text = chars[Math.floor(Math.random() * chars.length)];
        
        // Цвет символа — акцентный цвет темы
        ctx.fillStyle = accentColor;
        
        var x = i * fontSize;
        var y = drops[i];

        ctx.fillText(text, x, y);

        // Движение вниз
        drops[i] += speeds[i];

        // Сброс наверх, если упал за экран
        if (drops[i] > height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = 0.5 + Math.random() * 1.5;
        }
      }
      requestAnimationFrame(draw);
    }

    draw();
  });
})();
