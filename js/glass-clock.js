(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var header = document.querySelector('.header-inner');
    if (!header) return;
    if (header.querySelector('.glass-clock')) return;

    var clock = document.createElement('div');
    clock.className = 'glass-clock';
    clock.setAttribute('aria-label', 'Текущее время');
    header.appendChild(clock);

    function update() {
      var now = new Date();
      var hh = String(now.getHours()).padStart(2, '0');
      var mm = String(now.getMinutes()).padStart(2, '0');
      var ss = String(now.getSeconds()).padStart(2, '0');
      clock.textContent = hh + ':' + mm + ':' + ss;
    }

    update();
    setInterval(update, 1000);
  });
})();
