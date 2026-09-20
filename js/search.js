(function() {
  var INDEX_URL = (window.location.pathname.indexOf('/distros/') !== -1 ? '../' : '') + 'js/search-index.json';
  var index = [];
  var loaded = false;

  function loadIndex(cb) {
    if (loaded) return cb();
    fetch(INDEX_URL).then(function(r){ return r.json(); }).then(function(d){
      index = d; loaded = true; cb();
    }).catch(function(){ loaded = true; cb(); });
  }

  document.addEventListener('DOMContentLoaded', function() {
    var header = document.querySelector('.header-inner');
    if (!header) return;

    var box = document.createElement('div');
    box.className = 'search-box';
    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '/ поиск...';
    input.setAttribute('aria-label','Поиск по сайту');
    var results = document.createElement('div');
    results.className = 'search-results';
    box.appendChild(input); box.appendChild(results);

    var switcher = header.querySelector('.theme-switcher');
    if (switcher) header.insertBefore(box, switcher);
    else header.appendChild(box);

    input.addEventListener('focus', function(){ loadIndex(function(){}); });
    input.addEventListener('input', function() {
      var q = this.value.trim().toLowerCase();
      if (q.length < 2) { results.classList.remove('active'); return; }
      loadIndex(function() {
        var found = index.filter(function(p){
          return p.title.toLowerCase().indexOf(q) !== -1 ||
                 (p.desc && p.desc.toLowerCase().indexOf(q) !== -1);
        }).slice(0, 10);
        if (found.length === 0) {
          results.innerHTML = '<div class="empty">Ничего не найдено</div>';
        } else {
          var base = window.location.pathname.indexOf('/distros/') !== -1 ? '' : 'distros/';
          results.innerHTML = found.map(function(p){
            var href = p.url.indexOf('distros/') === 0 && base === '' ? p.url.replace('distros/','') : (base && p.url.indexOf('distros/') !== 0 ? p.url : base + p.url.replace('distros/',''));
            if (window.location.pathname.indexOf('/distros/') !== -1 && p.url.indexOf('distros/') === 0) href = p.url.replace('distros/','');
            if (window.location.pathname.indexOf('/distros/') === -1 && p.url.indexOf('distros/') !== 0) href = p.url;
            return '<a href="' + href + '">' + p.title + '</a>';
          }).join('');
        }
        results.classList.add('active');
      });
    });
    document.addEventListener('click', function(e) {
      if (!box.contains(e.target)) results.classList.remove('active');
    });
  });
})();
