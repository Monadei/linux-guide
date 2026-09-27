(function() {
  function animateNumber(el, target) {
    var duration = 1500;
    var start = performance.now();
    var from = 0;
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      // easeOutQuart
      var eased = 1 - Math.pow(1 - p, 4);
      var value = Math.floor(from + (target - from) * eased);
      el.textContent = value;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  function init() {
    var nums = document.querySelectorAll('.stat-num[data-target]');
    if (!nums.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            if (el.dataset.done === '1') return;
            el.dataset.done = '1';
            var target = parseInt(el.dataset.target, 10) || 0;
            animateNumber(el, target);
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.3 });

      nums.forEach(function(n) { observer.observe(n); });
    } else {
      nums.forEach(function(n) {
        n.textContent = n.dataset.target;
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
