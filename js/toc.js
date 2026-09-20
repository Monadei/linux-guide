(function(){
  document.addEventListener('DOMContentLoaded', function(){
    var main = document.querySelector('main.page, main .page');
    if (!main) return;
    var heads = main.querySelectorAll('h2');
    if (heads.length < 3) return;
    var toc = document.createElement('aside');
    toc.className = 'page-toc';
    toc.innerHTML = '<div style="color:var(--accent);margin-bottom:0.5rem;font-weight:600;">Оглавление</div>';
    heads.forEach(function(h, i){
      var id = 'h-' + i;
      h.id = id;
      var a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = h.textContent.replace(/^##\s*/, '');
      toc.appendChild(a);
    });
    document.body.appendChild(toc);
    window.addEventListener('scroll', function(){
      var current = null;
      heads.forEach(function(h){ if (h.getBoundingClientRect().top < 150) current = h.id; });
      toc.querySelectorAll('a').forEach(function(a){
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    });
  });
})();
