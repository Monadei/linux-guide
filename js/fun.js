(function(){
  // Tux
  document.addEventListener('DOMContentLoaded', function(){
    var tux = document.createElement('div');
    tux.className = 'tux';
    tux.textContent = '   .--.\n  |o_o |\n  |:_/ |\n //   \\ \\\n(|     | )\n/\'\\_   _/`\\\n\\___)=(___/';
    document.body.appendChild(tux);

    // Ачивки
    var ACH = {
      first_visit: { icon:'👋', name:'Первый шаг', desc:'Зашёл на сайт' },
      theme_changed: { icon:'🎨', name:'Художник', desc:'Сменил тему' },
      konami: { icon:'🕶️', name:'Neo', desc:'Нашёл Konami code' },
      sandwich: { icon:'🥪', name:'Сэндвич', desc:'sudo make me a sandwich' },
      all_themes: { icon:'🌈', name:'Радуга', desc:'Попробовал 10 тем' },
      quiz_done: { icon:'🎯', name:'Ориентир', desc:'Прошёл викторину' },
      test_done: { icon:'📝', name:'Студент', desc:'Прошёл тест' }
    };
    try {
      var unlocked = JSON.parse(localStorage.getItem('ach-unlocked') || '{}');
      var themesTried = JSON.parse(localStorage.getItem('ach-themes') || '[]');
      
      function unlock(id) {
        if (unlocked[id]) return;
        unlocked[id] = Date.now();
        localStorage.setItem('ach-unlocked', JSON.stringify(unlocked));
      }
      unlock('first_visit');

      // Следим за сменой темы
      var origApply = window.__applyTheme;
      if (origApply) {
        window.__applyTheme = function(v) {
          origApply(v);
          unlock('theme_changed');
          if (themesTried.indexOf(v) === -1) themesTried.push(v);
          localStorage.setItem('ach-themes', JSON.stringify(themesTried));
          if (themesTried.length >= 10) unlock('all_themes');
        };
      }

      // Konami
      var k = [38,38,40,40,37,39,37,39,66,65], kp = 0;
      document.addEventListener('keydown', function(e){
        if (e.keyCode === k[kp]) { kp++; if (kp === k.length) { unlock('konami'); kp = 0; } }
        else kp = 0;
      });

      // Sandwich
      var si = document.querySelector('.search-box input');
      if (si) si.addEventListener('input', function(){
        if (this.value.toLowerCase() === 'sudo make me a sandwich') unlock('sandwich');
      });
    } catch(e){}
  });
})();
