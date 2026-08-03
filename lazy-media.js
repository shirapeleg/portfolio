(function () {
  var MOBILE_MQ = '(max-width: 1100px)';

  function isMobile() {
    return window.matchMedia && window.matchMedia(MOBILE_MQ).matches;
  }

  /* ── Mobile: defer non-hero videos before the browser fetches them ── */
  var heroVideoAssigned = false;

  function deferVideo(video) {
    if (!video || video.dataset.lazyMedia) return;
    if (!video.closest('main')) return;

    var src = video.getAttribute('src');
    if (!src) return;

    if (!heroVideoAssigned) {
      heroVideoAssigned = true;
      video.dataset.lazyMedia = 'hero';
      try { video.preload = 'metadata'; } catch (e) {}
      return;
    }

    video.dataset.lazyMedia = 'deferred';
    video.dataset.src = src;
    video.removeAttribute('src');
    video.removeAttribute('autoplay');
    try { video.preload = 'none'; } catch (e2) {}
    try { video.pause(); } catch (e3) {}
  }

  if (isMobile()) {
    var parseObserver = new MutationObserver(function () {
      document.querySelectorAll('main video[src]:not([data-lazy-media])').forEach(deferVideo);
    });
    parseObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  function optimizeImagesForMobile(main) {
    var imgs = Array.from(main.querySelectorAll('img'));
    if (!imgs.length) return;

    imgs.forEach(function (img) {
      img.decoding = 'async';
      if (img.getAttribute('fetchpriority') === 'high') {
        img.setAttribute('loading', 'eager');
        return;
      }
      img.setAttribute('loading', 'lazy');
      img.removeAttribute('fetchpriority');
    });
  }

  function setupVideoObserver(main) {
    var videos = Array.from(main.querySelectorAll('video'));
    if (!videos.length) return;

    videos.forEach(function (video) {
      if (!video.hasAttribute('muted')) video.setAttribute('muted', '');
      if (!video.hasAttribute('playsinline')) video.setAttribute('playsinline', '');
    });

    var heroVideo = videos.find(function (v) { return v.dataset.lazyMedia === 'hero'; }) || videos[0];

    if (!('IntersectionObserver' in window)) {
      videos.forEach(function (v) {
        if (v.dataset.src && !v.getAttribute('src')) v.src = v.dataset.src;
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          if (v.dataset.src && !v.getAttribute('src')) {
            v.src = v.dataset.src;
            v.load();
          }
          v.play().catch(function () {});
        } else {
          try { v.pause(); } catch (e) {}
        }
      });
    }, { root: null, rootMargin: '300px 0px', threshold: 0.01 });

    videos.forEach(function (video) {
      if (heroVideo && video === heroVideo) {
        if (video.hasAttribute('autoplay')) {
          video.play().catch(function () {});
        }
        return;
      }
      io.observe(video);
    });
  }

  function prefetchAdjacentPage() {
    if (!isMobile()) return;
    var nextLink = document.querySelector('.bottom-nav-next[href], .nav-rect-next[href]');
    if (!nextLink || !nextLink.href) return;

    var run = function () {
      var link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = nextLink.href;
      document.head.appendChild(link);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 3000 });
    } else {
      setTimeout(run, 2000);
    }
  }

  function initScrollToTop() {
    var btn = document.querySelector('.work-page .scroll-to-top-btn');
    if (!btn) return;
    var scrollEl = document.body;
    var threshold = 50;

    function update() {
      btn.classList.toggle('is-visible', scrollEl.scrollTop > threshold);
    }

    scrollEl.addEventListener('scroll', update, { passive: true });
    update();
  }

  function init() {
    var main = document.querySelector('main');
    if (main && isMobile()) {
      document.querySelectorAll('main video[src]:not([data-lazy-media])').forEach(deferVideo);
      optimizeImagesForMobile(main);
      setupVideoObserver(main);
      prefetchAdjacentPage();
    }
    initScrollToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
