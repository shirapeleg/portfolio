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
    var mqMobile = window.matchMedia && window.matchMedia('(max-width: 768px)');
    if (mqMobile && mqMobile.matches) {
      document.body.classList.toggle('about-open-mobile', !!aboutVisible);
      document.body.classList.toggle('contact-open-mobile', !!contactVisible);
      positionMobileTitle();
      if (!aboutVisible) aboutIntroRan = false;
    } else {
      document.body.classList.remove('about-open-mobile');
      document.body.classList.remove('contact-open-mobile');
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

  /* כותרת "Shira Peleg" – פונט קבוע OTMiniature-Bold בלבד */
  const titleEl = document.querySelector('.site-title-text');
  const titleMobileEl = document.querySelector('.site-title-text-mobile');
  const titleWrap = document.querySelector('.site-title-wrap');

  function positionMobileTitle() {
    if (!titleWrap) return;
    const mq = window.matchMedia && window.matchMedia('(max-width: 768px)');
    if (!mq || !mq.matches) {
      /* דסקטופ – רק משחזרים מיקום כותרת, לא נוגעים ב-aboutWrap */
      titleWrap.style.top = '45px';
      if (aboutWrap) {
        aboutWrap.style.position = '';
        aboutWrap.style.left = '';
        aboutWrap.style.right = '';
        aboutWrap.style.transform = '';
        aboutWrap.style.top = '';
        aboutWrap.style.width = '';
        aboutWrap.style.marginTop = '';
        aboutWrap.style.padding = '';
      }
      return;
    }
    const nav = document.querySelector('.top-nav');
    const firstWorkRow = document.querySelector('.works-rect-1') || document.querySelector('.works-rect');
    if (!nav || !firstWorkRow) return;

    /* מיקום הכותרת נקבע ב-CSS לפי קווי הגריד (--mobile-band-top, גובה 160px) – לא לדרוס */
    titleWrap.style.top = '';
    titleWrap.style.height = '';

    /* מובייל: כש-ABOUT פתוח – הפסקה מתחילה מיד מתחת לשורת הניווט העליונה */
    if (aboutWrap) {
      if (document.body.classList.contains('about-open-mobile')) {
        aboutWrap.style.position = 'absolute';
        aboutWrap.style.left = '0';
        aboutWrap.style.right = 'auto';
        aboutWrap.style.transform = 'none';
        aboutWrap.style.top = '14px';
        aboutWrap.style.width = '100%';
        aboutWrap.style.marginTop = '0';
        aboutWrap.style.padding = '0 12px';
      } else {
        aboutWrap.style.position = '';
        aboutWrap.style.left = '';
        aboutWrap.style.right = '';
        aboutWrap.style.transform = '';
        aboutWrap.style.top = '';
        aboutWrap.style.width = '';
        aboutWrap.style.marginTop = '';
        aboutWrap.style.padding = '';
      }
    }
  }

  function applyTitleFontOTMiniature() {
    var fontName = 'OTMiniature';
    if (titleEl) {
      titleEl.style.fontFamily = "'" + fontName + "', Georgia, serif";
      titleEl.removeAttribute('transform');
    }
    if (titleMobileEl) {
      titleMobileEl.style.fontFamily = "'" + fontName + "', Georgia, serif";
      titleMobileEl.style.fontSize = ''; /* גודל מ-CSS (clamp) כדי שהכותרת תהיה גדולה וממורכזת */
      titleMobileEl.style.lineHeight = '88px';
      titleMobileEl.style.transform = '';
    }
  }

  function restoreTitle() {
    if (titleEl) titleEl.textContent = 'Shira Peleg';
    if (titleMobileEl) titleMobileEl.innerHTML = 'Shira<br>Peleg';
    applyTitleFontOTMiniature();
  }

  if (titleEl || titleMobileEl) {
    restoreTitle();
  }

  // מיקום מדויק של הכותרת במובייל – בדיוק באמצע בין הניווט לשורת העבודה הראשונה
  positionMobileTitle();
  window.addEventListener('resize', positionMobileTitle);

  /* Hover on WILDFLOWERS PROTECTION LAW: show "Broadsheet" in OTMiniature-Bold, same size */
  const wildflowersGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'WILDFLOWERS PROTECTION LAW';
  });
  if (wildflowersGroup && titleEl) {
    wildflowersGroup.addEventListener('mouseenter', function () {
      titleEl.textContent = 'Broadsheet';
      if (titleMobileEl) titleMobileEl.innerHTML = 'Broadsheet';
      applyTitleFontOTMiniature();
    });
    wildflowersGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on STREET: show "Motion" in OTMiniature-Bold, same size */
  const streetGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'STREET';
  });
  if (streetGroup && titleEl) {
    streetGroup.addEventListener('mouseenter', function () {
      titleEl.textContent = 'Motion';
      if (titleMobileEl) titleMobileEl.innerHTML = 'Motion';
      applyTitleFontOTMiniature();
    });
    streetGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on BLOCK: show "Book Covers" in OTMiniature-Bold, same size */
  const blockGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'BLOCK';
  });
  if (blockGroup && titleEl) {
    blockGroup.addEventListener('mouseenter', function () {
      titleEl.textContent = 'Book Covers';
      if (titleMobileEl) titleMobileEl.innerHTML = 'Book Covers';
      applyTitleFontOTMiniature();
    });
    blockGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on THE PRINCESS WILL COME AT FOUR: show "Illustrated Book" in OTMiniature-Bold, same size */
  const princessGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'THE PRINCESS WILL COME AT FOUR';
  });
  if (princessGroup && titleEl) {
    princessGroup.addEventListener('mouseenter', function () {
      titleEl.textContent = 'Illustrated Book';
      if (titleMobileEl) titleMobileEl.innerHTML = 'Illustrated Book';
      applyTitleFontOTMiniature();
    });
    princessGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on CANAANISM: show "Motion Posters" in OTMiniature-Bold, same size */
  const canaanismGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'CANAANISM';
  });
  if (canaanismGroup && titleEl) {
    canaanismGroup.addEventListener('mouseenter', function () {
      titleEl.textContent = 'Motion Posters';
      if (titleMobileEl) titleMobileEl.innerHTML = 'Motion Posters';
      applyTitleFontOTMiniature();
    });
    canaanismGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on LUCID DREAMS: show "Website" in OTMiniature-Bold, same size */
  const lucidDreamsGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'LUCID DREAMS';
  });
  if (lucidDreamsGroup && titleEl) {
    lucidDreamsGroup.addEventListener('mouseenter', function () {
      titleEl.textContent = 'Website';
      if (titleMobileEl) titleMobileEl.innerHTML = 'Website';
      applyTitleFontOTMiniature();
    });
    lucidDreamsGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on SOUTH INTERNATIONAL FILM FESTIVAL: show "Branding" in OTMiniature-Bold, same size */
  const southFestivalGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'SOUTH INTERNATIONAL FILM FESTIVAL';
  });
  if (southFestivalGroup && titleEl) {
    southFestivalGroup.addEventListener('mouseenter', function () {
      titleEl.textContent = 'Branding';
      if (titleMobileEl) titleMobileEl.innerHTML = 'Branding';
      applyTitleFontOTMiniature();
    });
    southFestivalGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on LISSITZKY: show "Posters" in OTMiniature-Bold, same size */
  const lissitzkyGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'LISSITZKY';
  });
  if (lissitzkyGroup && titleEl) {
    lissitzkyGroup.addEventListener('mouseenter', function () {
      titleEl.textContent = 'Posters';
      if (titleMobileEl) titleMobileEl.innerHTML = 'Posters';
      applyTitleFontOTMiniature();
    });
    lissitzkyGroup.addEventListener('mouseleave', restoreTitle);
  }

  /* Hover on DAILY: show "Illustrations" in OTMiniature-Bold, same size */
  const dailyGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'DAILY';
  });
  if (dailyGroup && titleEl) {
    dailyGroup.addEventListener('mouseenter', function () {
      titleEl.textContent = 'Illustrations';
      if (titleMobileEl) titleMobileEl.innerHTML = 'Illustrations';
      applyTitleFontOTMiniature();
    });
    dailyGroup.addEventListener('mouseleave', restoreTitle);
  }

  const gridEl = document.getElementById('bottom-grid');
  if (!gridEl) return;

  const isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;

  let introRan = false;

  function runGridIntro() {
    gridEl.classList.add('intro-animation');
    const cells = gridEl.querySelectorAll('.grid-cell');
    const stepMs = 18;
    const fadeMs = 250;
    var overlapCount = 34; /* אחרי כמה תאים מתחילה ההיעלמות – שתי הפעולות במקביל */
    cells.forEach(function (cell, i) {
      setTimeout(function () {
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

  /* Hover images: from folder "hover", named 1.jpg, 2.jpg, ... 69; start index random */
  const HOVER_IMAGE_COUNT = 69;
  const HOVER_IMAGE_EXT = 'png';
  const HOVER_BASE = 'hover/';

  /** מחזיר את עמוד העבודה לפי מספר תמונה (1–69) */
  function getPageForImageNum(num) {
    if (num >= 1 && num <= 8) return 'block';
    if (num >= 9 && num <= 16) return 'wildflowers';
    if (num >= 17 && num <= 24) return 'princess';
    if (num >= 25 && num <= 34) return 'south-film-festival';
    if (num >= 35 && num <= 42) return 'lissitzky';
    if (num >= 43 && num <= 49) return 'canaanism';
    if (num >= 50 && num <= 57) return 'lucid-dreams';
    if (num >= 58 && num <= 62) return 'daily';
    if (num >= 63 && num <= 69) return 'street';
    return null;
  }

  /* מובייל: אנימציית פתיחת העמוד – אותה נקודת התחלה כמו about (מקצה עליון), עם תמונות hover */
  function runOpeningOverlayIntro() {
    var overlay = document.getElementById('about-intro-overlay');
    if (!overlay) return;
    var width = window.innerWidth || document.documentElement.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight;
    var cols = Math.max(8, Math.floor(width / 70));
    var rows = Math.max(4, Math.floor(height / 70));
    var cellWidth = width / cols;
    var cellHeight = height / rows;
    var stepMs = 18;
    var fadeMs = 250;
    var overlapCount = 34;
    var startIndex = 1 + Math.floor(Math.random() * HOVER_IMAGE_COUNT);

    overlay.innerHTML = '';
    var cellsContainer = document.createElement('div');
    cellsContainer.className = 'about-intro-overlay-cells';
    var cellIndex = 0;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var imageNum = ((startIndex - 1 + cellIndex) % HOVER_IMAGE_COUNT) + 1;
        var cell = document.createElement('div');
        cell.className = 'about-intro-overlay-cell';
        cell.style.left = (c * cellWidth) + 'px';
        cell.style.top = (r * cellHeight) + 'px';
        cell.style.width = cellWidth + 'px';
        cell.style.height = cellHeight + 'px';
        var bg = document.createElement('div');
        bg.className = 'about-intro-overlay-cell-img';
        bg.style.backgroundImage = "url('" + HOVER_BASE + imageNum + '.' + HOVER_IMAGE_EXT + "')";
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

  function layoutGrid() {
    const topOffset = isMobile ? 0 : 305;
    const width = document.body.offsetWidth;
    const totalHeight = isMobile ? window.innerHeight : document.body.offsetHeight;
    const height = totalHeight - topOffset;
    if (height <= 0 || width <= 0) return;

    /* חלוקה למלבנים שווים: N עמודות, M שורות – כל תא באותו גודל */
    const cols = Math.max(8, Math.floor(width / 70));
    const rows = Math.max(4, Math.floor(height / 70));
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    const gridWidth = width;
    const gridHeight = height;

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

    /* שכבת תאים ל-hover: כל תא מציג תמונה לפי סדר המספרים (התחלה אקראית) */
    const startIndex = 1 + Math.floor(Math.random() * HOVER_IMAGE_COUNT);
    const cellsContainer = document.createElement('div');
    cellsContainer.className = 'grid-cells';
    cellsContainer.setAttribute('aria-hidden', 'true');
    let cellIndex = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const imageNum = ((startIndex - 1 + cellIndex) % HOVER_IMAGE_COUNT) + 1;
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.imageNum = String(imageNum);
        cell.style.left = (c * cellWidth) + 'px';
        cell.style.top = (r * cellHeight) + 'px';
        cell.style.width = cellWidth + 'px';
        cell.style.height = cellHeight + 'px';
        const bg = document.createElement('div');
        bg.className = 'grid-cell-img';
        bg.style.backgroundImage = (aboutVisible && !preferHoverGrid)
          ? "url('me.png')"
          : "url('" + HOVER_BASE + imageNum + '.' + HOVER_IMAGE_EXT + "')";
        cell.appendChild(bg);
        if (!isMobile) {
          (function (cellEl, imgEl) {
            var hideTimeout = null;
            cellEl.addEventListener('mouseenter', function () {
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
        }
        cellsContainer.appendChild(cell);
        cellIndex++;
      }
    }
    gridEl.appendChild(cellsContainer);

    var isHome = !window.location.pathname || window.location.pathname === '/' ||
      window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    var navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    var isReload = navEntry && navEntry.type === 'reload';
    var fromOutside = !document.referrer || document.referrer.indexOf(window.location.origin) !== 0;
    var showIntro = isReload || fromOutside;
    if (!introRan && isHome && showIntro) {
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
  }

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
  });
});
