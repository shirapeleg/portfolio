(function () {
  var MOBILE_MQ = '(max-width: 1100px)';

  function isMobile() {
    return window.matchMedia && window.matchMedia(MOBILE_MQ).matches;
  }

  /* ── Defer non-hero videos before the browser fetches them ── */
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

  var parseObserver = new MutationObserver(function () {
    document.querySelectorAll('main video[src]:not([data-lazy-media])').forEach(deferVideo);
  });
  parseObserver.observe(document.documentElement, { childList: true, subtree: true });

  function prepareVideoForAutoplay(video) {
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.removeAttribute('controls');
  }

  function requestVideoPlay(video) {
    if (!video) return;
    var src = video.getAttribute('src') || video.currentSrc;
    if (!src) return;

    prepareVideoForAutoplay(video);
    if (!video.paused && !video.ended) return;

    function attempt() {
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    }

    attempt();
    if (video.readyState < 2) {
      video.addEventListener('loadeddata', attempt, { once: true });
      video.addEventListener('canplay', attempt, { once: true });
    }
  }

  function ensureVideoSource(video) {
    if (!video.dataset.src || video.getAttribute('src')) return;
    video.setAttribute('src', video.dataset.src);
    video.setAttribute('autoplay', '');
    try { video.load(); } catch (e) {}
  }

  function bindMobilePlayUnlock(main) {
    if (!isMobile()) return;
    var done = false;
    function unlock() {
      if (done) return;
      done = true;
      main.querySelectorAll('video').forEach(function (v) {
        if (!v.paused || (!v.getAttribute('src') && !v.currentSrc)) return;
        requestVideoPlay(v);
      });
    }
    document.addEventListener('touchstart', unlock, { passive: true, once: true });
    document.addEventListener('pointerdown', unlock, { passive: true, once: true });
    document.addEventListener('scroll', unlock, { passive: true, once: true });
  }

  function optimizeImagesForMain(main) {
    var imgs = Array.from(main.querySelectorAll('img'));
    if (!imgs.length) return;

    var eagerAboveFold = isMobile() ? 1 : 3;
    var highKept = false;

    imgs.forEach(function (img, index) {
      img.decoding = 'async';

      if (img.getAttribute('fetchpriority') === 'high') {
        if (!highKept) {
          highKept = true;
          img.setAttribute('loading', 'eager');
          return;
        }
        img.removeAttribute('fetchpriority');
      }

      if (img.hasAttribute('loading')) return;

      if (index < eagerAboveFold) {
        img.setAttribute('loading', 'eager');
      } else {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  function setupVideoObserver(main) {
    var videos = Array.from(main.querySelectorAll('video'));
    if (!videos.length) return;

    videos.forEach(prepareVideoForAutoplay);

    if (!('IntersectionObserver' in window)) {
      videos.forEach(function (v) {
        ensureVideoSource(v);
        requestVideoPlay(v);
      });
      bindMobilePlayUnlock(main);
      return;
    }

    var rootMargin = isMobile() ? '300px 0px' : '200px 0px';
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          ensureVideoSource(v);
          requestVideoPlay(v);
        } else {
          try { v.pause(); } catch (e) {}
        }
      });
    }, { root: null, rootMargin: rootMargin, threshold: 0.01 });

    videos.forEach(function (video) {
      io.observe(video);
    });
    bindMobilePlayUnlock(main);
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

  function mediaAspectRatio(el) {
    if (!el) return null;
    if (el.tagName === 'IMG' && el.naturalWidth > 0) {
      return el.naturalWidth / el.naturalHeight;
    }
    if (el.tagName === 'VIDEO' && el.videoWidth > 0) {
      return el.videoWidth / el.videoHeight;
    }
    return null;
  }

  function layoutSouthGalleryRows() {
    var gallery = document.querySelector('.south-gallery');
    if (!gallery) return;

    gallery.querySelectorAll('.south-row').forEach(function (row) {
      var cells = row.querySelectorAll('.south-cell');
      var media = Array.prototype.map.call(cells, function (cell) {
        return cell.querySelector('img, video');
      }).filter(Boolean);

      if (row.classList.contains('south-row-full') && media.length === 1) {
        var singleAr = mediaAspectRatio(media[0]);
        if (singleAr) {
          row.style.setProperty('--south-ar1', String(singleAr));
        }
        return;
      }

      if (media.length === 2) {
        var ar1 = mediaAspectRatio(media[0]);
        var ar2 = mediaAspectRatio(media[1]);
        if (ar1 && ar2) {
          row.style.setProperty('--south-ar1', String(ar1));
          row.style.setProperty('--south-ar2', String(ar2));
        }
      }
    });
  }

  function initSouthGalleryLayout() {
    var gallery = document.querySelector('.south-gallery');
    if (!gallery) return;

    var layout = layoutSouthGalleryRows;
    gallery.querySelectorAll('img, video').forEach(function (el) {
      if (el.tagName === 'IMG') {
        if (el.complete) return;
        el.addEventListener('load', layout);
      } else {
        el.addEventListener('loadedmetadata', layout);
        if (el.readyState >= 1) layout();
      }
    });
    layout();
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
    if (main) {
      document.querySelectorAll('main video[src]:not([data-lazy-media])').forEach(deferVideo);
      optimizeImagesForMain(main);
      setupVideoObserver(main);
      prefetchAdjacentPage();
    }
    initScrollToTop();
    initSouthGalleryLayout();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
