(function() {
  try {
    localStorage.removeItem('font-size');
    document.body.style.fontSize = '';
  } catch(e) {}
})();