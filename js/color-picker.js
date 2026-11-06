(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var headerIcons = document.getElementById('headerIcons');
    if (!headerIcons) return;

    // Создаем кнопку палитры
    var btn = document.createElement('button');
    btn.className = 'color-btn';
    btn.innerHTML = '🎨';
    btn.setAttribute('aria-label', 'Настройка цвета');
    btn.style.cssText = 'background:transparent; border:2px solid var(--accent-dim); color:var(--accent); width:38px; height:38px; border-radius:6px; cursor:pointer; font-size:1rem; display:flex; align-items:center; justify-content:center; margin-left:0.5rem;';
    
    // Создаем панель
    var panel = document.createElement('div');
    panel.className = 'color-panel';
    panel.style.cssText = 'position:fixed; bottom:2rem; left:2rem; background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:1.2rem; box-shadow:0 10px 30px rgba(0,0,0,0.5); z-index:99999; display:none; width:280px; font-family:"JetBrains Mono",monospace;';
    
    panel.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px dashed var(--border); padding-bottom:0.5rem;">
        <span style="color:var(--accent); font-weight:bold; font-size:0.9rem;">🎨 Цвет сайта</span>
        <button class="color-close" style="background:transparent; border:none; color:var(--muted); font-size:1.2rem; cursor:pointer;">✕</button>
      </div>
      <div style="margin-bottom:1rem;">
        <label style="display:block; color:var(--text); font-size:0.8rem; margin-bottom:0.3rem;">Оттенок</label>
        <input type="range" id="hue-slider" min="0" max="360" value="40" style="width:100%; cursor:pointer;">
      </div>
      <div style="margin-bottom:1rem;">
        <label style="display:block; color:var(--text); font-size:0.8rem; margin-bottom:0.3rem;">Насыщенность</label>
        <input type="range" id="sat-slider" min="20" max="100" value="100" style="width:100%; cursor:pointer;">
      </div>
      <button id="reset-color" style="width:100%; padding:0.5rem; background:var(--accent); color:var(--bg); border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Сбросить</button>
    `;

    // Добавляем все в DOM
    headerIcons.appendChild(btn);
    document.body.appendChild(panel);

    var hueSlider = panel.querySelector('#hue-slider');
    var satSlider = panel.querySelector('#sat-slider');
    var resetBtn = panel.querySelector('#reset-color');
    var closeBtn = panel.querySelector('.color-close');

    // Функция обновления акцента
    function updateAccent() {
      var h = hueSlider.value;
      var s = satSlider.value;
      var l = 55; // Базовая яркость
      
      var accent = `hsl(${h}, ${s}%, ${l}%)`;
      var accentDim = `hsl(${h}, ${s}%, 35%)`;
      
      document.documentElement.style.setProperty('--accent', accent);
      document.documentElement.style.setProperty('--accent-dim', accentDim);
      
      // Сохраняем в localStorage
      localStorage.setItem('custom-hue', h);
      localStorage.setItem('custom-sat', s);
    }

    // Загрузка сохраненных настроек
    var savedHue = localStorage.getItem('custom-hue');
    var savedSat = localStorage.getItem('custom-sat');
    if (savedHue !== null) {
      hueSlider.value = savedHue;
      satSlider.value = savedSat;
      updateAccent();
    }

    // Слушатели
    hueSlider.addEventListener('input', updateAccent);
    satSlider.addEventListener('input', updateAccent);
    
    resetBtn.addEventListener('click', function() {
      hueSlider.value = 40; // Янтарный по умолчанию
      satSlider.value = 100;
      updateAccent();
      localStorage.removeItem('custom-hue');
      localStorage.removeItem('custom-sat');
      // Удаляем инлайн стили, чтобы вернулось из темы
      document.documentElement.style.removeProperty('--accent');
      document.documentElement.style.removeProperty('--accent-dim');
    });

    btn.addEventListener('click', function() {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    closeBtn.addEventListener('click', function() {
      panel.style.display = 'none';
    });
  });
})();
