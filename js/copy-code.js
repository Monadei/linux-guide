(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('pre code, code').forEach(function(el){
      if (el.closest('pre') && el.parentElement.querySelector('.copy-btn')) return;
      var btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'копировать';
      btn.onclick = function(){
        var text = (el.closest('pre') || el).textContent;
        navigator.clipboard.writeText(text.trim()).then(function(){
          btn.textContent = 'готово!';
          setTimeout(function(){ btn.textContent = 'копировать'; }, 1500);
        });
      };
      if (el.parentElement.tagName === 'PRE') el.parentElement.appendChild(btn);
      else el.insertAdjacentElement('afterend', btn);
    });
  });
})();
