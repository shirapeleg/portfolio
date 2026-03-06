(function() {
  function init() {
    var btn = document.querySelector('.work-page .scroll-to-top-btn');
    if (!btn) return;
    var scrollEl = document.body;
    var threshold = 50;
    function update() {
      if (scrollEl.scrollTop > threshold) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }
    scrollEl.addEventListener('scroll', update, { passive: true });
    update();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
