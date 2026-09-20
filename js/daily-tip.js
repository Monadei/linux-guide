(function(){
  var TIPS = [
    'Нажми <code>/</code> — фокус на поиске. <code>T</code> — следующая тема. <code>Esc</code> — закрыть.',
    'Введи в поиске <code>sudo make me a sandwich</code> — увидишь ответ.',
    'Konami code ↑↑↓↓←→←→BA включает Matrix на 10 секунд.',
    'В подвале есть мини-терминал. Введи <code>help</code>.',
    'Клик по логотипу в шапке — переход на главную.',
    '<code>Ctrl+R</code> в терминале — поиск по истории команд.',
    '<code>!!</code> — повторить последнюю команду.',
    '<code>cd -</code> — вернуться в предыдущую папку.',
    '<code>man команда</code> — инструкция. <code>q</code> — выйти.',
    'Timeshift сохраняет снапшоты системы. Ставь перед обновлениями.',
    '<code>rsync -avh источник/ назначение/</code> — правильный бэкап.',
    'Смена темы работает на всех страницах и сохраняется.',
    'Кнопка <code>◐</code> в шапке — контрастная тема для слабовидящих.',
    'Открой <a href="distros/index.html">каталог</a> — 130+ дистрибутивов.',
    'Пройди <a href="quiz.html">викторину</a> — узнаешь свой дистрибутив.',
    'Открой <a href="test.html">тест</a> — 20 вопросов о Linux.',
    'В <a href="guess-distro.html">игре</a> угадай дистрибутив по цвету.',
    '<a href="swap-calc.html">Калькулятор swap</a> — сколько выделить места.',
    '<a href="hardware-picker.html">Подбор по железу</a> — рекомендация дистрибутива.',
    'F5 на любой странице — тема останется.',
    '<code>ip a</code> — узнать свой IP. <code>df -h</code> — место на диске.',
    '<code>htop</code> показывает процессы в реальном времени.',
    '<code>journalctl -xe</code> — логи системы. Всё, что сломалось.',
    'Btrfs и ZFS — файловые системы со снапшотами.',
    'X11 — старый протокол графики, Wayland — новый.'
  ];
  document.addEventListener('DOMContentLoaded', function(){
    var main = document.querySelector('main');
    if (!main || window.location.pathname.indexOf('index.html') === -1 && window.location.pathname !== '/' && !window.location.pathname.endsWith('/')) return;
    var h1 = main.querySelector('h1, .hero h1');
    if (!h1) return;
    var idx = new Date().getDate() % TIPS.length;
    var tip = document.createElement('div');
    tip.className = 'daily-tip';
    tip.innerHTML = '<span class="label">💡 Совет дня:</span>' + TIPS[idx] +
      ' <button class="copy-btn" onclick="var t=this.previousSibling; location.href=\'distros/\'+randomDistro()+\'.html\'">🎲 случайный дистрибутив</button>';
    var hero = main.querySelector('.hero');
    if (hero) hero.appendChild(tip);
    else h1.parentNode.insertBefore(tip, h1.nextSibling);
  });
})();
