document.addEventListener('DOMContentLoaded', function () {
  /* About / Contact: click toggles paragraph in same place, same typography */
  const aboutLink = Array.from(document.querySelectorAll('.top-nav .nav-link')).find(function (a) {
    return a.textContent.trim() === 'ABOUT';
  });
  const contactLink = Array.from(document.querySelectorAll('.top-nav .nav-link')).find(function (a) {
    return a.textContent.trim() === 'CONTACT';
  });
  const aboutWrap = document.getElementById('about-paragraph-wrap');
  const aboutText = document.getElementById('about-paragraph-text');
  const contactText = document.getElementById('contact-paragraph-text');
  let aboutVisible = false;
  let contactVisible = false;
  /* כשנכנסים עם #about או #contact (חזרה מעמודי עבודה) – להציג את גריד ה-hover הרגיל */
  let preferHoverGrid = false;
  /* מובייל: האם כבר רצה אנימציית הפתיחה של about (me.png) – מאפסים כשסוגרים את about */
  let aboutIntroRan = false;

  function isDesktopAboutOpen() {
    return aboutVisible && window.matchMedia && window.matchMedia('(min-width: 1101px)').matches;
  }

  function updatePanelVisibility() {
    if (!aboutWrap) return;
    var anyVisible = aboutVisible || contactVisible;
    aboutWrap.classList.toggle('is-visible', anyVisible);
    aboutWrap.classList.toggle('is-contact', contactVisible);
    aboutWrap.hidden = !anyVisible;
    aboutWrap.setAttribute('aria-hidden', anyVisible ? 'false' : 'true');
    if (aboutLink) aboutLink.classList.toggle('active', aboutVisible);
    if (contactLink) contactLink.classList.toggle('active', contactVisible);
    if (aboutText) aboutText.hidden = !aboutVisible;
    if (contactText) contactText.hidden = !contactVisible;
    /* מובייל בלבד: ABOUT פתוח = מחליפים כותרת בפסקה; CONTACT פתוח = מסתירים כותרת */
    var mqMobile = window.matchMedia && window.matchMedia('(max-width: 1100px)');
    if (mqMobile && mqMobile.matches) {
      document.body.classList.toggle('about-open-mobile', !!aboutVisible);
      document.body.classList.toggle('contact-open-mobile', !!contactVisible);
      document.body.classList.remove('about-open-desktop');
      positionMobileTitle();
      if (!aboutVisible) aboutIntroRan = false;
    } else {
      document.body.classList.remove('about-open-mobile');
      document.body.classList.remove('contact-open-mobile');
      document.body.classList.toggle('about-open-desktop', !!aboutVisible);
      if (aboutVisible) restoreTitle();
    }
    if (typeof layoutGrid === 'function') layoutGrid();
  }

  if (aboutLink && aboutWrap && aboutText) {
    aboutLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (contactVisible) contactVisible = false;
      aboutVisible = !aboutVisible;
      updatePanelVisibility();
    });
    if (window.location.hash === '#about') {
      aboutVisible = true;
      /* ב-About בלבד: הגריד יציג את תמונת ה-hover של העמוד (me.png), לא את מגוון התמונות */
      /* לא קוראים ל-updatePanelVisibility() כאן – layoutGrid עדיין לא מוגדר; הפאנל יעודכן בסוף הטעינה */
    }
  }

  if (contactLink && aboutWrap && contactText) {
    contactLink.addEventListener('click', function (e) {
      /* אם אנחנו בעמוד אחר (עמוד עבודה) – הקישור index.html#contact ינווט; לא למנוע */
      var isHome = !window.location.pathname || window.location.pathname === '/' ||
        window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
      if (!isHome) return;
      e.preventDefault();
      if (aboutVisible) aboutVisible = false;
      contactVisible = !contactVisible;
      updatePanelVisibility();
    });
    /* הגעה מהעמוד הראשי עם #contact – לפתוח אוטומטית את פאנל ה-Contact */
    if (window.location.hash === '#contact') {
      aboutVisible = false;
      contactVisible = true;
      preferHoverGrid = true;
      /* לא קוראים ל-updatePanelVisibility() כאן – layoutGrid עדיין לא מוגדר; הפאנל יעודכן בסוף הטעינה */
    }
  }

  /* כותרת "Shira Peleg" – Heebo ExtraBold */
  const titleEl = document.querySelector('.site-title-text');
  const titleMobileEl = document.querySelector('.site-title-text-mobile');
  const titleWrap = document.querySelector('.site-title-wrap');
  const TITLE_WORD_GAP = '0.14em';

  function titleToSvgHtml(text) {
    var words = String(text).trim().split(/\s+/);
    if (words.length < 2) return words[0] || '';
    var html = '<tspan>' + words[0] + '</tspan>';
    for (var i = 1; i < words.length; i++) {
      html += '<tspan class="site-title-name-gap" dx="' + TITLE_WORD_GAP + '">' + words[i] + '</tspan>';
    }
    return html;
  }

  function wrapTitleMarkerHtml(inner) {
    return '<span class="title-marker-fill">' + inner + '</span>';
  }

  function titleToMobileHtml(text) {
    var words = String(text).trim().split(/\s+/);
    if (words.length < 2) return wrapTitleMarkerHtml(words[0] || '');
    var html = words[0];
    for (var i = 1; i < words.length; i++) {
      html += '<span class="title-word-gap">' + words[i] + '</span>';
    }
    return wrapTitleMarkerHtml(html);
  }

  function setSiteTitle(text) {
    if (isDesktopAboutOpen()) return;
    if (titleEl) titleEl.innerHTML = titleToSvgHtml(text);
    if (titleMobileEl) titleMobileEl.innerHTML = titleToMobileHtml(text);
    applyTitleFontMiriamLibre();
  }

  function fitMobileTitle() {
    if (!titleMobileEl || !titleWrap) return;
    var mq = window.matchMedia && window.matchMedia('(max-width: 1100px)');
    if (!mq || !mq.matches) return;
    titleMobileEl.style.fontSize = '';
    var wrapStyle = window.getComputedStyle(titleWrap);
    var padT = parseFloat(wrapStyle.paddingTop) || 0;
    var padB = parseFloat(wrapStyle.paddingBottom) || 0;
    var padL = parseFloat(wrapStyle.paddingLeft) || 0;
    var padR = parseFloat(wrapStyle.paddingRight) || 0;
    var availH = titleWrap.clientHeight - padT - padB;
    var availW = titleWrap.clientWidth - padL - padR;
    if (availH <= 0 || availW <= 0) return;

    var safeH = Math.max(0, availH - 4);
    var safeW = Math.max(0, availW - 4);
    var fontSize = safeH / 2;
    titleMobileEl.style.fontSize = fontSize + 'px';

    for (var i = 0; i < 80; i++) {
      var rect = titleMobileEl.getBoundingClientRect();
      if (rect.width <= safeW + 0.5 && rect.height <= safeH + 0.5) break;
      fontSize *= 0.95;
      titleMobileEl.style.fontSize = fontSize + 'px';
    }
    syncMobileWorkListToTitle();
  }

  function syncMobileWorkListToTitle() {
    var root = document.documentElement;
    var mq = window.matchMedia && window.matchMedia('(max-width: 1100px)');
    if (!mq || !mq.matches || !titleMobileEl) {
      root.style.removeProperty('--mobile-work-inset-left');
      root.style.removeProperty('--mobile-work-inset-right');
      return;
    }
    var bodyRect = document.body.getBoundingClientRect();
    var titleRect = titleMobileEl.getBoundingClientRect();
    if (titleRect.width < 1) return;
    var insetLeft = Math.max(0, titleRect.left - bodyRect.left);
    var insetRight = Math.max(0, bodyRect.right - titleRect.right);
    root.style.setProperty('--mobile-work-inset-left', insetLeft + 'px');
    root.style.setProperty('--mobile-work-inset-right', insetRight + 'px');
  }

  function positionMobileTitle() {
    if (!titleWrap) return;
    const mq = window.matchMedia && window.matchMedia('(max-width: 1100px)');
    if (!mq || !mq.matches) {
      /* דסקטופ – רק משחזרים מיקום כותרת, לא נוגעים ב-aboutWrap */
      titleWrap.style.top = '45px';
      titleWrap.style.height = '';
      titleWrap.style.left = '';
      titleWrap.style.width = '';
      titleWrap.style.transform = '';
      if (titleMobileEl) titleMobileEl.style.fontSize = '';
      document.documentElement.style.removeProperty('--mobile-work-inset-left');
      document.documentElement.style.removeProperty('--mobile-work-inset-right');
      if (aboutWrap) {
        aboutWrap.style.position = '';
        aboutWrap.style.left = '';
        aboutWrap.style.right = '';
        aboutWrap.style.transform = '';
        aboutWrap.style.top = '';
        aboutWrap.style.width = '';
        aboutWrap.style.marginTop = '';
        aboutWrap.style.padding = '';
        aboutWrap.style.height = '';
        aboutWrap.style.minHeight = '';
        aboutWrap.style.display = '';
        aboutWrap.style.alignItems = '';
      }
      return;
    }
    const topLine = document.querySelector('.top-line');
    const firstWorkRow = document.querySelector('.works-rect-1 .work-group') || document.querySelector('.works-rect-1') || document.querySelector('.work-group');
    if (!firstWorkRow) return;

    var navBottom = topLine
      ? topLine.getBoundingClientRect().bottom
      : 52;
    var worksTop = firstWorkRow.getBoundingClientRect().top;
    var bandHeight = worksTop - navBottom;
    if (bandHeight <= 0) return;

    var bodyRect = document.body.getBoundingClientRect();
    var bandTop = navBottom - bodyRect.top;

    document.documentElement.style.setProperty('--mobile-nav-bottom', navBottom + 'px');
    document.documentElement.style.setProperty('--mobile-works-start', worksTop + 'px');
    document.documentElement.style.setProperty('--mobile-title-band-height', bandHeight + 'px');

    titleWrap.style.top = bandTop + 'px';
    titleWrap.style.height = bandHeight + 'px';
    titleWrap.style.left = '0';
    titleWrap.style.width = '100%';
    titleWrap.style.transform = 'none';

    /* מובייל: כש-ABOUT/CONTACT פתוח – הפסקה מתחילה מיד מתחת לשורת הניווט העליונה */
    if (aboutWrap) {
      if (
        document.body.classList.contains('about-open-mobile') ||
        document.body.classList.contains('contact-open-mobile')
      ) {
        aboutWrap.style.position = 'absolute';
        aboutWrap.style.left = '0';
        aboutWrap.style.right = 'auto';
        aboutWrap.style.transform = 'none';
        aboutWrap.style.top = '14px';
        aboutWrap.style.width = '100%';
        aboutWrap.style.marginTop = '0';
        aboutWrap.style.padding = '0 12px';
        aboutWrap.style.height = 'auto';
        aboutWrap.style.minHeight = '0';
        aboutWrap.style.display = 'block';
        aboutWrap.style.alignItems = '';
      } else {
        aboutWrap.style.position = '';
        aboutWrap.style.left = '';
        aboutWrap.style.right = '';
        aboutWrap.style.transform = '';
        aboutWrap.style.top = '';
        aboutWrap.style.width = '';
        aboutWrap.style.marginTop = '';
        aboutWrap.style.padding = '';
        aboutWrap.style.height = '';
        aboutWrap.style.minHeight = '';
        aboutWrap.style.display = '';
        aboutWrap.style.alignItems = '';
      }
    }
    fitMobileTitle();
  }

  function updateSiteTitleHighlight() {
    var highlight = document.querySelector('.site-title-highlight');
    var svg = document.querySelector('.site-title-svg');
    if (!titleEl || !highlight || !svg) return;
    requestAnimationFrame(function () {
      try {
        var screenRect = titleEl.getBoundingClientRect();
        var inv = svg.getScreenCTM() && svg.getScreenCTM().inverse();
        if (inv && screenRect.width >= 1 && screenRect.height >= 1) {
          var pt = svg.createSVGPoint();
          function toSvg(cx, cy) {
            pt.x = cx;
            pt.y = cy;
            return pt.matrixTransform(inv);
          }
          var corners = [
            toSvg(screenRect.left, screenRect.top),
            toSvg(screenRect.right, screenRect.top),
            toSvg(screenRect.right, screenRect.bottom),
            toSvg(screenRect.left, screenRect.bottom)
          ];
          var xs = corners.map(function (p) { return p.x; });
          var ys = corners.map(function (p) { return p.y; });
          var x1 = Math.min.apply(null, xs);
          var x2 = Math.max.apply(null, xs);
          var y1 = Math.min.apply(null, ys);
          var y2 = Math.max.apply(null, ys);
          highlight.setAttribute('x', x1);
          highlight.setAttribute('y', y1);
          highlight.setAttribute('width', x2 - x1);
          highlight.setAttribute('height', y2 - y1);
          return;
        }
        var x1 = Infinity;
        var y1 = Infinity;
        var x2 = -Infinity;
        var y2 = -Infinity;
        var n = titleEl.getNumberOfChars();
        for (var i = 0; i < n; i++) {
          var ext = titleEl.getExtentOfChar(i);
          if (!ext || !ext.width) continue;
          x1 = Math.min(x1, ext.x);
          y1 = Math.min(y1, ext.y);
          x2 = Math.max(x2, ext.x + ext.width);
          y2 = Math.max(y2, ext.y + ext.height);
        }
        if (x1 === Infinity) return;
        highlight.setAttribute('x', x1);
        highlight.setAttribute('y', y1);
        highlight.setAttribute('width', x2 - x1);
        highlight.setAttribute('height', y2 - y1);
      } catch (e) { /* layout not ready */ }
    });
  }

  function applyTitleFontMiriamLibre() {
    if (titleEl) {
      titleEl.style.fontFamily = "'Heebo', sans-serif";
      titleEl.style.fontWeight = '800';
      titleEl.removeAttribute('transform');
    }
    if (titleMobileEl) {
      titleMobileEl.style.fontFamily = "'Heebo', sans-serif";
      titleMobileEl.style.fontWeight = '800';
      titleMobileEl.style.fontSize = ''; /* גודל מ-CSS (clamp) כדי שהכותרת תהיה גדולה וממורכזת */
      titleMobileEl.style.lineHeight = ''; /* line-height מ-CSS */
      titleMobileEl.style.transform = '';
    }
    updateSiteTitleHighlight();
  }

  function restoreTitle() {
    if (titleEl) titleEl.innerHTML = titleToSvgHtml('Shira Peleg');
    if (titleMobileEl) titleMobileEl.innerHTML = wrapTitleMarkerHtml('Shira<br>Peleg');
    applyTitleFontMiriamLibre();
    fitMobileTitle();
  }

  if (titleEl || titleMobileEl) {
    restoreTitle();
  }

  // מיקום מדויק של הכותרת במובייל – בדיוק באמצע בין הניווט לשורת העבודה הראשונה
  positionMobileTitle();
  window.addEventListener('resize', function () {
    positionMobileTitle();
    applyTitleFontMiriamLibre();
    updateSiteTitleHighlight();
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      fitMobileTitle();
      updateSiteTitleHighlight();
    });
  }

  /* דסקטופ בלבד: hover על עבודה מחליף את כותרת Shira Peleg */
  const isMobileForTitle = window.matchMedia && window.matchMedia('(max-width: 1100px)').matches;

  /* Hover on WILDFLOWERS PROTECTION LAW: show "Broadsheet" in DingDong Irregular, same size */
  const wildflowersGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'WILDFLOWERS PROTECTION LAW';
  });
  if (wildflowersGroup && titleEl && !isMobileForTitle) {
    wildflowersGroup.addEventListener('mouseenter', function () {
      setSiteTitle('Broadsheet');
    });
    wildflowersGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on STREET: show "Motion Series" in DingDong Irregular, same size */
  const streetGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'STREET';
  });
  if (streetGroup && titleEl && !isMobileForTitle) {
    streetGroup.addEventListener('mouseenter', function () {
      setSiteTitle('Motion Series');
    });
    streetGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on BLOCK: show "Book Covers" in DingDong Irregular, same size */
  const blockGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'BLOCK';
  });
  if (blockGroup && titleEl && !isMobileForTitle) {
    blockGroup.addEventListener('mouseenter', function () {
      setSiteTitle('Book Covers');
    });
    blockGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on THE PRINCESS WILL COME AT FOUR: show "Illustrated Book" in DingDong Irregular, same size */
  const princessGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'THE PRINCESS WILL COME AT FOUR';
  });
  if (princessGroup && titleEl && !isMobileForTitle) {
    princessGroup.addEventListener('mouseenter', function () {
      setSiteTitle('Illustrated Book');
    });
    princessGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on CANAANISM: show "Motion Posters" in DingDong Irregular, same size */
  const canaanismGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'CANAANISM';
  });
  if (canaanismGroup && titleEl && !isMobileForTitle) {
    canaanismGroup.addEventListener('mouseenter', function () {
      setSiteTitle('Motion Posters');
    });
    canaanismGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on LUCID DREAMS: show "Web Design" in DingDong Irregular, same size */
  const lucidDreamsGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'LUCID DREAMS';
  });
  if (lucidDreamsGroup && titleEl && !isMobileForTitle) {
    lucidDreamsGroup.addEventListener('mouseenter', function () {
      setSiteTitle('Web Design');
    });
    lucidDreamsGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on SOUTH INTERNATIONAL FILM FESTIVAL: show "Branding" in DingDong Irregular, same size */
  const southFestivalGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'SOUTH INTERNATIONAL FILM FESTIVAL';
  });
  if (southFestivalGroup && titleEl && !isMobileForTitle) {
    southFestivalGroup.addEventListener('mouseenter', function () {
      setSiteTitle('Branding');
    });
    southFestivalGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on I THINK HE'S LISTENING TO US: show "Illustrated Book" in DingDong Irregular, same size */
  const listeningGroup = document.querySelector('a.work-group[href="i-think-hes-listening-to-us.html"]');
  if (listeningGroup && titleEl && !isMobileForTitle) {
    listeningGroup.addEventListener('mouseenter', function () {
      setSiteTitle('Illustrated Book');
    });
    listeningGroup.addEventListener('mouseleave', restoreTitle);
  }

  const gridEl = document.getElementById('bottom-grid');
  if (!gridEl) return;

  const isMobile = window.matchMedia && window.matchMedia('(max-width: 1100px)').matches;

  let introRan = false;

  function runGridIntro() {
    gridEl.classList.add('intro-animation');
    const cells = gridEl.querySelectorAll('.grid-cell');
    const stepMs = 18;
    const fadeMs = 250;
    var overlapCount = 34; /* אחרי כמה תאים מתחילה ההיעלמות – שתי הפעולות במקביל */
    cells.forEach(function (cell, i) {
      setTimeout(function () {
        var img = cell.querySelector('.grid-cell-img');
        ensureHoverBgLoaded(img);
        cell.classList.add('intro-show');
      }, i * stepMs);
    });
    cells.forEach(function (cell, i) {
      setTimeout(function () {
        cell.classList.remove('intro-show');
      }, overlapCount * stepMs + i * stepMs);
    });
    var lastDisappearMs = overlapCount * stepMs + (cells.length - 1) * stepMs;
    setTimeout(function () {
      gridEl.classList.remove('intro-animation');
      cells.forEach(function (cell) { cell.classList.remove('intro-show'); });
    }, lastDisappearMs + fadeMs);
  }

  /* מובייל: אנימציה זהה לאנימציית הפתיחה עם me.png – על גבי התוכן (overlay) */
  function runAboutIntroOverlay() {
    var overlay = document.getElementById('about-intro-overlay');
    if (!overlay) return;
    // If CSS hides the overlay tiles, don't build the heavy grid (saves DOM/network).
    if (typeof aboutIntroTilesAreHidden === 'function' && aboutIntroTilesAreHidden()) return;
    var width = window.innerWidth || document.documentElement.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight;
    var cols = Math.max(8, Math.floor(width / 70));
    var rows = Math.max(4, Math.floor(height / 70));
    var cellWidth = width / cols;
    var cellHeight = height / rows;
    var stepMs = 18;
    var fadeMs = 250;
    var overlapCount = 34;

    overlay.innerHTML = '';
    var cellsContainer = document.createElement('div');
    cellsContainer.className = 'about-intro-overlay-cells';
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var cell = document.createElement('div');
        cell.className = 'about-intro-overlay-cell';
        cell.style.left = (c * cellWidth) + 'px';
        cell.style.top = (r * cellHeight) + 'px';
        cell.style.width = cellWidth + 'px';
        cell.style.height = cellHeight + 'px';
        var bg = document.createElement('div');
        bg.className = 'about-intro-overlay-cell-img';
        cell.appendChild(bg);
        cellsContainer.appendChild(cell);
      }
    }
    overlay.appendChild(cellsContainer);
    var cells = overlay.querySelectorAll('.about-intro-overlay-cell');
    overlay.classList.add('intro-animation', 'is-active');

    for (var i = 0; i < cells.length; i++) {
      (function (idx) {
        setTimeout(function () { cells[idx].classList.add('intro-show'); }, idx * stepMs);
      })(i);
    }
    for (var i = 0; i < cells.length; i++) {
      (function (idx) {
        setTimeout(function () { cells[idx].classList.remove('intro-show'); }, overlapCount * stepMs + idx * stepMs);
      })(i);
    }
    var lastDisappearMs = overlapCount * stepMs + (cells.length - 1) * stepMs;
    setTimeout(function () {
      overlay.classList.remove('intro-animation', 'is-active');
      overlay.innerHTML = '';
    }, lastDisappearMs + fadeMs);
  }

  /* Hover images: from folder "hover", named 1.png ... 86; 58–62 (ex-daily) and 77 skipped */
  const HOVER_IMAGE_EXT = 'png';
  const HOVER_BASE = 'hover/';
  const ACTIVE_HOVER_IMAGES = [];
  for (var hi = 1; hi <= 86; hi++) {
    if (hi >= 35 && hi <= 42) continue;
    if (hi >= 58 && hi <= 62) continue;
    if (hi === 77) continue;
    ACTIVE_HOVER_IMAGES.push(hi);
  }
  const HOVER_IMAGE_COUNT = ACTIVE_HOVER_IMAGES.length;

  function hoverBgUrl(imageNum) {
    if (imageNum === 'me') return "url('me.png')";
    return "url('" + HOVER_BASE + imageNum + '.' + HOVER_IMAGE_EXT + "')";
  }

  function ensureHoverBgLoaded(imgEl) {
    if (!imgEl || imgEl.dataset.bgLoaded === '1') return;
    var pending = imgEl.dataset.hoverBg;
    if (!pending) return;
    imgEl.style.backgroundImage = pending;
    imgEl.dataset.bgLoaded = '1';
  }

  function getHoverImageNum(startOffset, cellIndex) {
    return ACTIVE_HOVER_IMAGES[(startOffset + cellIndex) % HOVER_IMAGE_COUNT];
  }

  function aboutIntroTilesAreHidden() {
    // Measure against CSS by creating a temporary element off-screen.
    if (!window.getComputedStyle) return false;
    var temp = document.createElement('div');
    temp.className = 'about-intro-overlay-cell-img';
    temp.style.position = 'absolute';
    temp.style.left = '-99999px';
    temp.style.top = '-99999px';
    temp.style.width = '1px';
    temp.style.height = '1px';
    // Ensure the selector `.about-intro-overlay .about-intro-overlay-cell-img` matches.
    var wrapper = document.createElement('div');
    // Use `is-active` so the parent isn't `display:none` (keeps the measurement accurate).
    wrapper.className = 'about-intro-overlay is-active';
    wrapper.appendChild(temp);
    document.body.appendChild(wrapper);
    var hidden = window.getComputedStyle(temp).display === 'none';
    wrapper.remove();
    return hidden;
  }

  /** מחזיר את עמוד העבודה לפי מספר תמונה (1–86) */
  function getPageForImageNum(num) {
    if (num >= 1 && num <= 8) return 'block';
    if (num >= 9 && num <= 16) return 'wildflowers';
    if (num >= 17 && num <= 24) return 'princess';
    if (num >= 25 && num <= 34) return 'south-film-festival';
    if (num >= 43 && num <= 49) return 'canaanism';
    if (num >= 50 && num <= 57) return 'lucid-dreams';
    if (num >= 63 && num <= 69) return 'street';
    if (num >= 70 && num <= 86) return 'i-think-hes-listening-to-us';
    return null;
  }

  function getPageFromWorkHref(href) {
    if (!href) return null;
    var file = href.split('/').pop() || '';
    return file.replace(/\.html(\?.*)?(#.*)?$/, '') || null;
  }

  function getImageNumsForPage(page) {
    return ACTIVE_HOVER_IMAGES.filter(function (num) {
      return getPageForImageNum(num) === page;
    });
  }

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  var workScatterState = {
    affectedCells: []
  };

  function clearWorkScatter() {
    workScatterState.affectedCells.forEach(function (entry) {
      if (entry.originalBg) {
        entry.img.style.backgroundImage = entry.originalBg;
      } else {
        entry.img.style.backgroundImage = '';
        delete entry.img.dataset.bgLoaded;
      }
      entry.img.classList.remove('is-visible');
    });
    workScatterState.affectedCells = [];
    gridEl.classList.remove('work-scatter-active');
  }

  function pickRandomCellIndices(count, totalCells) {
    var indices = [];
    for (var i = 0; i < totalCells; i++) indices.push(i);
    shuffleArray(indices);
    return indices.slice(0, Math.min(count, totalCells));
  }

  function showWorkScatter(page) {
    if (isDesktopAboutOpen()) return;
    if (!window.matchMedia || !window.matchMedia('(min-width: 1101px)').matches) return;
    if (gridEl.classList.contains('intro-animation')) return;

    var imageNums = getImageNumsForPage(page);
    if (!imageNums.length) return;

    var cells = gridEl.querySelectorAll('.grid-cell');
    if (!cells.length) return;

    clearWorkScatter();
    gridEl.classList.add('work-scatter-active');

    shuffleArray(imageNums);
    var cellIndices = pickRandomCellIndices(imageNums.length, cells.length);

    cellIndices.forEach(function (cellIndex, i) {
      var cell = cells[cellIndex];
      var img = cell && cell.querySelector('.grid-cell-img');
      if (!img) return;

      var imageNum = imageNums[i];
      workScatterState.affectedCells.push({
        img: img,
        originalBg: img.style.backgroundImage || ''
      });
      img.dataset.hoverBg = hoverBgUrl(imageNum);
      ensureHoverBgLoaded(img);
      img.classList.add('is-visible');
    });
  }

  function setupWorkScatterHover() {
    document.querySelectorAll('.work-group').forEach(function (group) {
      var page = getPageFromWorkHref(group.getAttribute('href'));
      if (!page) return;
      group.addEventListener('mouseenter', function () {
        showWorkScatter(page);
      });
      group.addEventListener('mouseleave', clearWorkScatter);
    });
  }

  /* מובייל: אנימציית פתיחת העמוד – אותה נקודת התחלה כמו about (מקצה עליון), עם תמונות hover */
  function runOpeningOverlayIntro() {
    var overlay = document.getElementById('about-intro-overlay');
    if (!overlay) return;
    // If CSS hides the overlay tiles, don't build the heavy grid (saves DOM/network).
    if (typeof aboutIntroTilesAreHidden === 'function' && aboutIntroTilesAreHidden()) return;
    var width = window.innerWidth || document.documentElement.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight;
    var cols = Math.max(8, Math.floor(width / 70));
    var rows = Math.max(4, Math.floor(height / 70));
    var cellWidth = width / cols;
    var cellHeight = height / rows;
    var stepMs = 18;
    var fadeMs = 250;
    var overlapCount = 34;
    var startOffset = Math.floor(Math.random() * HOVER_IMAGE_COUNT);

    overlay.innerHTML = '';
    var cellsContainer = document.createElement('div');
    cellsContainer.className = 'about-intro-overlay-cells';
    var cellIndex = 0;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var imageNum = getHoverImageNum(startOffset, cellIndex);
        var cell = document.createElement('div');
        cell.className = 'about-intro-overlay-cell';
        cell.style.left = (c * cellWidth) + 'px';
        cell.style.top = (r * cellHeight) + 'px';
        cell.style.width = cellWidth + 'px';
        cell.style.height = cellHeight + 'px';
        var bg = document.createElement('div');
        bg.className = 'about-intro-overlay-cell-img';
        bg.dataset.hoverBg = hoverBgUrl(imageNum);
        cell.appendChild(bg);
        cellsContainer.appendChild(cell);
        cellIndex++;
      }
    }
    overlay.appendChild(cellsContainer);
    var cells = overlay.querySelectorAll('.about-intro-overlay-cell');
    overlay.classList.add('intro-animation', 'is-active');

    for (var i = 0; i < cells.length; i++) {
      (function (idx) {
        setTimeout(function () {
          var bg = cells[idx].querySelector('.about-intro-overlay-cell-img');
          ensureHoverBgLoaded(bg);
          cells[idx].classList.add('intro-show');
        }, idx * stepMs);
      })(i);
    }
    for (var i = 0; i < cells.length; i++) {
      (function (idx) {
        setTimeout(function () { cells[idx].classList.remove('intro-show'); }, overlapCount * stepMs + idx * stepMs);
      })(i);
    }
    var lastDisappearMs = overlapCount * stepMs + (cells.length - 1) * stepMs;
    setTimeout(function () {
      overlay.classList.remove('intro-animation', 'is-active');
      overlay.innerHTML = '';
    }, lastDisappearMs + fadeMs);
  }

  function layoutGrid() {
    clearWorkScatter();
    const width = gridEl.clientWidth;
    const height = gridEl.clientHeight;
    if (height <= 0 || width <= 0) return;

    /* חלוקה למלבנים שווים: N עמודות, M שורות – כל תא באותו גודל */
    const cols = Math.max(8, Math.floor(width / 70));
    const rows = Math.max(4, Math.floor(height / 70));
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    const gridWidth = width;
    const gridHeight = height;

    gridEl.dataset.gridCols = String(cols);
    gridEl.dataset.gridRows = String(rows);

    const verticalLines = [];
    for (let c = 1; c < cols; c++) {
      const x = c * cellWidth;
      verticalLines.push('M ' + x + ' 0 L ' + x + ' ' + gridHeight);
    }
    const horizontalLines = [];
    for (let r = 1; r < rows; r++) {
      const y = r * cellHeight;
      horizontalLines.push('M 0 ' + y + ' L ' + gridWidth + ' ' + y);
    }

    const pathD = verticalLines.join(' ') + ' ' + horizontalLines.join(' ');
    /* viewBox מורחב ב-0.5 מכל צד כדי שה-stroke (1px ממורכז) לא ייחתך ויגיע לקצות המסגרת */
    const vbX = -0.5, vbY = -0.5, vbW = gridWidth + 1, vbH = gridHeight + 1;

    gridEl.innerHTML =
      '<svg width="' +
      gridWidth +
      '" height="' +
      gridHeight +
      '" viewBox="' + vbX + ' ' + vbY + ' ' + vbW + ' ' + vbH + '" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="' +
      pathD +
      '" fill="none" stroke="black" stroke-width="1"/>' +
      '</svg>';

    /*
     * שכבת תאים ל-hover: כבדה מאוד (הרבה תאים + backgroundImages).
     * ב־CSS במובייל (עד ~1100px) התמונות מוסתרות, ובפועל אין hover שמפעיל החלפת כותרת.
     * לכן בדילוג על בניית התאים אנחנו חוסכים עבודה/בקשות בלי לשנות מראה או אינטראקציה.
     */
    if (!isMobile) {
      const startOffset = Math.floor(Math.random() * HOVER_IMAGE_COUNT);
      const cellsContainer = document.createElement('div');
      cellsContainer.className = 'grid-cells';
      cellsContainer.setAttribute('aria-hidden', 'true');
      let cellIndex = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const left = c * cellWidth;
          const top = r * cellHeight;
          const w = c === cols - 1 ? gridWidth - left : cellWidth;
          const h = r === rows - 1 ? gridHeight - top : cellHeight;
          const imageNum = getHoverImageNum(startOffset, cellIndex);
          const cell = document.createElement('div');
          cell.className = 'grid-cell';
          cell.dataset.imageNum = String(imageNum);
          cell.dataset.gridCol = String(c);
          cell.dataset.gridRow = String(r);
          cell.style.left = left + 'px';
          cell.style.top = top + 'px';
          cell.style.width = w + 'px';
          cell.style.height = h + 'px';

          const bg = document.createElement('div');
          bg.className = 'grid-cell-img';
          bg.dataset.hoverBg = (aboutVisible && !preferHoverGrid)
            ? hoverBgUrl('me')
            : hoverBgUrl(imageNum);
          cell.appendChild(bg);

          (function (cellEl, imgEl) {
            var hideTimeout = null;
            cellEl.addEventListener('mouseenter', function () {
              ensureHoverBgLoaded(imgEl);
              if (hideTimeout) clearTimeout(hideTimeout);
              imgEl.classList.add('is-visible');
            });
            cellEl.addEventListener('mouseleave', function () {
              hideTimeout = setTimeout(function () {
                imgEl.classList.remove('is-visible');
                hideTimeout = null;
              }, 500);
            });
          })(cell, bg);

          cell.addEventListener('click', function () {
            var num = parseInt(cell.dataset.imageNum, 10);
            if (aboutVisible && !preferHoverGrid) return;
            var page = getPageForImageNum(num);
            if (page) window.location.href = page + '.html';
          });

          cellsContainer.appendChild(cell);
          cellIndex++;
        }
      }

      gridEl.appendChild(cellsContainer);
    }

    var isHome = !window.location.pathname || window.location.pathname === '/' ||
      window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    var navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    var isReload = navEntry && navEntry.type === 'reload';
    var fromOutside = !document.referrer || document.referrer.indexOf(window.location.origin) !== 0;
    var showIntro = isHome && !introRan && (isReload || fromOutside);
    if (showIntro) {
      introRan = true;
      if (isMobile) {
        setTimeout(runOpeningOverlayIntro, 80);
      } else {
        setTimeout(runGridIntro, 80);
      }
    }
    /* מובייל: כשפאנל about נפתח – אנימציה זהה לאנימציית הפתיחה עם me.png מעל התוכן */
    if (isMobile && aboutVisible && !preferHoverGrid && !aboutIntroRan) {
      aboutIntroRan = true;
      setTimeout(runAboutIntroOverlay, 80);
    }
    if (isMobile && typeof positionMobileTitle === 'function') {
      positionMobileTitle();
    }
  }

  setupWorkScatterHover();

  /* כשנכנסים עם #about או #contact (חזרה מעמוד עבודה) – לבנות גריד ולפתוח את הפאנל; אחרת רק לבנות גריד */
  if (window.location.hash === '#about' || window.location.hash === '#contact') {
    updatePanelVisibility();
  } else {
    layoutGrid();
  }
  window.addEventListener('resize', layoutGrid);
  /* כניסה ראשונה: אם הממדים לא היו מוכנים ב-DOMContentLoaded, בונים גריד ב-load ואז האנימציה תרוץ */
  window.addEventListener('load', function () {
    if (!gridEl.querySelector('.grid-cells') || !gridEl.querySelectorAll('.grid-cell').length) {
      layoutGrid();
    }
    positionMobileTitle();
  });
});
