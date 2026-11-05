(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Определяем текущую страницу, чтобы задать уникальные символы
    var path = window.location.pathname;
    var pageName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    
    // Базовый набор иероглифов (универсальные)
    var defaultChars = ['シ', 'ス', 'テ', 'ム', 'コ', 'ー', 'ド', '龍', '力', '未', '来', '知', '恵'];
    
    // Уникальные наборы под каждую страницу
    var pageChars = {
      'index.html': ['開', '始', '導', '入', '門', 'ル', 'ー', 'ト'], // Начало, Введение, Корень
      'download.html': ['落', '下', 'ロ', 'ー', 'ド', 'ダ', 'ウ', 'ン'], // Скачивание
      'install.html': ['設', '置', 'イ', 'ン', 'ス', 'ト', 'ー', 'ル'], // Установка
      'history.html': ['歴', '史', '時', '間', '過', '去', '未', '来'], // История
      'faq.html': ['質', '問', '答', 'え', 'ヘ', 'ル', 'プ'], // Вопрос-ответ
      'about.html': ['自', '己', '紹', '介', '私', 'は', '作', '者'], // Обо мне
      'sitemap.html': ['地', '図', '全', 'ペ', 'ー', 'ジ', '案', '内'], // Карта сайта
      'kali/index.html': ['ハ', 'ッ', 'カ', 'ー', 'セ', 'キ', 'ュ', 'リ', 'テ', 'ィ'], // Хакер, Безопасность
      'distros/index.html': ['配', '布', 'リ', 'ナ', 'ッ', 'ク', 'ス'], // Дистрибутивы Linux
    };

    // Если зашли на страницу дистрибутива (в папке distros)
    if (path.indexOf('/distros/') !== -1) {
      var distroName = pageName.replace('.html', '').toUpperCase();
      // Берем первые 5 букв названия дистрибутива и переводим в азиатский стиль
      var asciiChars = distroName.substring(0, 6).split('');
      pageChars[pageName] = asciiChars.map(function(c) { 
        return c + ' '; // Добавляем пробел для читаемости
      });
      // Плюс добавляем пару иероглифов
      pageChars[pageName] = pageChars[pageName].concat(['シ', 'ス', 'テ', 'ム', '龍']);
    }

    // Если зашли на страницу гайда
    if (path.indexOf('/guides/') !== -1) {
      pageChars[pageName] = ['学', '習', '教', '本', 'ガ', 'イ', 'ド', 'ス', 'テ', 'ッ', 'プ'];
    }

    var chars = pageChars[pageName] || defaultChars;

    // Создаем canvas
    var canvas = document.createElement('canvas');
    canvas.id = 'live-bg-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.15'; // Фон должен быть ненавязчивым
    document.body.prepend(canvas);

    var ctx = canvas.getContext('2d');
    var width, height;
    var fontSize = 20; 
    var drops = [];
    var speeds = [];
    var ripples = []; // Массив для ряби

    // Получаем акцентный цвет темы
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
      // Игнорируем клики по ссылкам и кнопкам, чтобы не мешать навигации
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 150 + Math.random() * 100,
        opacity: 1
      });
    });

    // Анимация
    function draw() {
      // Определяем цвет фона для шлейфа
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
      
      // Падающие символы (уникальные для страницы)
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

      // Волны (рябь)
      for (var j = ripples.length - 1; j >= 0; j--) {
        var r = ripples[j];
        
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.globalAlpha = r.opacity;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.7, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.globalAlpha = r.opacity * 0.5;
        ctx.stroke();

        ctx.globalAlpha = 1;
        r.radius += 3; 
        r.opacity -= 0.02;

        if (r.opacity <= 0) {
          ripples.splice(j, 1);
        }
      }

      requestAnimationFrame(draw);
    }

    draw();
  });
})();
