(function() {
  // ===== Появление блоков при скролле =====
  function initReveal() {
    var elements = document.querySelectorAll('.card, .distro-tile, section, .kali-section, .rec-card');
    if (elements.length === 0) return;

    // Если браузер не поддерживает IntersectionObserver — показываем сразу
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function(el) { el.classList.add('revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    elements.forEach(function(el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  // ===== Анимированные числа =====
  function initAnimatedNumbers() {
    var numbers = document.querySelectorAll('.hist-stat .num, .impact .num');
    if (numbers.length === 0 || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    numbers.forEach(function(el) { observer.observe(el); });
  }

  function animateNumber(el) {
    var text = el.textContent.trim();
    var match = text.match(/(\d+)/);
    if (!match) return;
    var final = parseInt(match[1], 10);
    if (final === 0) return;

    var prefix = text.substring(0, match.index);
    var suffix = text.substring(match.index + match[0].length);
    var duration = 1000;
    var start = Date.now();

    function step() {
      var elapsed = Date.now() - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * final);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = text;
      }
    }
    step();
  }

  // ===== Пингвин в футере =====
  function initTuxWalk() {
    if (window.innerWidth < 768) return;
    if (document.querySelector('.tux-walk')) return;
    var tux = document.createElement('div');
    tux.className = 'tux-walk';
    tux.textContent = '🐧';
    document.body.appendChild(tux);
  }

  // ===== Инициализация =====
  document.addEventListener('DOMContentLoaded', function() {
    initReveal();
    initAnimatedNumbers();
    initTuxWalk();
  });
})();
