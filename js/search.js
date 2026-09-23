(function() {
  var isSub = window.location.pathname.indexOf('/distros/') !== -1 || window.location.pathname.indexOf('/kali/') !== -1;
  var BASE = isSub ? '../' : '';
  var INDEX_URL = BASE + 'js/search-index.json';
  var index = [];
  var loaded = false;

  function loadIndex(cb) {
    if (loaded) return cb();
    fetch(INDEX_URL).then(function(r) { return r.json(); }).then(function(d) {
      index = d;
      loaded = true;
      cb();
    }).catch(function(err) {
      console.error('Индекс не загружен:', err);
      loaded = true;
      cb();
    });
  }

  function highlight(text, query) {
    if (!query) return text;
    var regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  function search(query) {
    if (!query || query.length < 2) return [];
    var q = query.toLowerCase();
    var results = [];
    
    index.forEach(function(item) {
      var score = 0;
      var title = (item.title || '').toLowerCase();
      var desc = (item.desc || '').toLowerCase();
      var keywords = (item.keywords || '').toLowerCase();
      
      if (title === q) score += 100;
      else if (title.indexOf(q) === 0) score += 50;
      else if (title.indexOf(q) !== -1) score += 30;
      
      if (desc.indexOf(q) !== -1) score += 15;
      if (keywords.indexOf(q) !== -1) score += 10;
      
      var words = q.split(/\s+/);
      if (words.length > 1) {
        var allFound = words.every(function(w) {
          return title.indexOf(w) !== -1 || desc.indexOf(w) !== -1 || keywords.indexOf(w) !== -1;
        });
        if (allFound) score += 20;
      }
      
      if (score > 0) results.push({ item: item, score: score });
    });
    
    results.sort(function(a, b) { return b.score - a.score; });
    return results.slice(0, 15).map(function(r) { return r.item; });
  }

  document.addEventListener('DOMContentLoaded', function() {
    var header = document.querySelector('.header-inner');
    if (!header) return;

    var box = document.createElement('div');
    box.className = 'search-box';
    
    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '🔍 Поиск...';
    input.setAttribute('aria-label', 'Поиск по сайту');
    input.setAttribute('autocomplete', 'off');
    
    var results = document.createElement('div');
    results.className = 'search-results';
    
    box.appendChild(input);
    box.appendChild(results);
    
    var switcher = header.querySelector('.theme-switcher');
    if (switcher) header.insertBefore(box, switcher);
    else header.appendChild(box);

    input.addEventListener('focus', function() { loadIndex(function() {}); });

    input.addEventListener('input', function() {
      var q = this.value.trim();
      if (q.length < 2) {
        results.classList.remove('active');
        return;
      }
      
      loadIndex(function() {
        var found = search(q);
        
        if (found.length === 0) {
          results.innerHTML = '<div class="empty">Ничего не найдено: «' + q + '»</div>';
        } else {
          var html = '';
          var byCat = {};
          found.forEach(function(item) {
            var cat = item.cat || 'другое';
            if (!byCat[cat]) byCat[cat] = [];
            byCat[cat].push(item);
          });
          
          Object.keys(byCat).forEach(function(cat) {
            html += '<div class="search-category">' + cat + '</div>';
            byCat[cat].forEach(function(item) {
              var title = highlight(item.title, q);
              var desc = highlight((item.desc || '').substring(0, 80), q);
              html += '<a href="' + BASE + item.url + '">';
              html += '<div class="sr-title">' + title + '</div>';
              if (desc) html += '<div class="sr-desc">' + desc + '</div>';
              html += '</a>';
            });
          });
          
          results.innerHTML = html;
        }
        results.classList.add('active');
      });
    });

    document.addEventListener('click', function(e) {
      if (!box.contains(e.target)) results.classList.remove('active');
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        results.classList.remove('active');
        input.blur();
      }
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        input.focus();
      }
    });

    input.addEventListener('keydown', function(e) {
      var links = results.querySelectorAll('a');
      if (links.length === 0) return;
      
      var current = results.querySelector('a.focused');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (current) current.classList.remove('focused');
        var next = current ? current.nextElementSibling : links[0];
        if (!next || next.tagName !== 'A') next = links[0];
        next.classList.add('focused');
        next.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (current) current.classList.remove('focused');
        var prev = current ? current.previousElementSibling : links[links.length - 1];
        if (!prev || prev.tagName !== 'A') prev = links[links.length - 1];
        prev.classList.add('focused');
        prev.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (current) current.click();
        else if (links.length > 0) links[0].click();
      }
    });
  });
})();
