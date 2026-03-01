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

  function updatePanelVisibility() {
    var anyVisible = aboutVisible || contactVisible;
    aboutWrap.classList.toggle('is-visible', anyVisible);
    aboutWrap.classList.toggle('is-contact', contactVisible);
    aboutWrap.hidden = !anyVisible;
    aboutWrap.setAttribute('aria-hidden', anyVisible ? 'false' : 'true');
    if (aboutLink) aboutLink.classList.toggle('active', aboutVisible);
    if (contactLink) contactLink.classList.toggle('active', contactVisible);
    if (aboutText) aboutText.hidden = !aboutVisible;
    if (contactText) contactText.hidden = !contactVisible;
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
      updatePanelVisibility();
    }
  }

  if (contactLink && aboutWrap && contactText) {
    contactLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (aboutVisible) aboutVisible = false;
      contactVisible = !contactVisible;
      updatePanelVisibility();
    });
  }

  /* Title font rotation: cycle through all fonts from "shira peleg/new fonts" every 2 seconds */
  const titleFonts = [
    'Acte',
    'DingDongIrregular',
    'Ductus',
    'Feroniapi',
    'Marion',
    'OTMiniature',
    'SuperNotoriousDot',
    'TypefesseClaireObscure',
    'Velvelyne',
    'Infini',
    'Revival'
  ];
  const titleEl = document.querySelector('.site-title-text');
  let titleRotationInterval = null;

  var titleBaselineY = 160; /* כמו y ב-SVG של הכותרת */
  /* פונטים שמוקטנים עם scale מהבסיס – נשארים על אותו קו */
  var titleBaselineScale = { 'Revival': 0.78, 'DingDongIrregular': 0.88, 'Ductus': 0.78, 'Acte': 0.8, 'SuperNotoriousDot': 1.1, 'TypefesseClaireObscure': 1.1, 'Velvelyne': 1.1 };
  /* התאמת קו אנכי (ב-SVG: שלילי = למעלה) – Revival יושב נמוך מהשורה */
  var titleBaselineOffsetY = { 'Revival': -18 };

  function applyTitleFont(fontName) {
    titleEl.style.fontFamily = "'" + fontName + "', Georgia, serif";
    var scale = titleBaselineScale[fontName];
    var offsetY = titleBaselineOffsetY[fontName];
    if (scale != null || offsetY != null) {
      var t = 'translate(0,' + titleBaselineY + ') scale(' + (scale || 1) + ') translate(0,' + (-titleBaselineY) + ')';
      if (offsetY != null) t += ' translate(0,' + offsetY + ')';
      titleEl.setAttribute('transform', t);
    } else {
      titleEl.removeAttribute('transform');
    }
  }

  function startTitleRotation() {
    if (titleRotationInterval) return;
    var currentFont = titleEl.style.fontFamily.split(',')[0].replace(/^'|'$/g, '').trim();
    let fontIndex = titleFonts.indexOf(currentFont);
    if (fontIndex < 0) fontIndex = 0;
    titleEl.textContent = 'Shira Peleg';
    applyTitleFont(titleFonts[fontIndex]);
    titleRotationInterval = setInterval(function () {
      fontIndex = (fontIndex + 1) % titleFonts.length;
      applyTitleFont(titleFonts[fontIndex]);
    }, 2000);
  }

  function stopTitleRotation() {
    if (titleRotationInterval) {
      clearInterval(titleRotationInterval);
      titleRotationInterval = null;
    }
  }

  if (titleEl) {
    startTitleRotation();
  }

  /* Hover on WILDFLOWERS PROTECTION LAW: show "Broadsheet" in OTMiniature-Bold, same size */
  const wildflowersGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'WILDFLOWERS PROTECTION LAW';
  });
  if (wildflowersGroup && titleEl) {
    wildflowersGroup.addEventListener('mouseenter', function () {
      stopTitleRotation();
      titleEl.textContent = 'Broadsheet';
      applyTitleFont('OTMiniature');
    });
    wildflowersGroup.addEventListener('mouseleave', function () {
      startTitleRotation();
    });
  }

  /* Hover on STREET: show "Motion" in OTMiniature-Bold, same size */
  const streetGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'STREET';
  });
  if (streetGroup && titleEl) {
    streetGroup.addEventListener('mouseenter', function () {
      stopTitleRotation();
      titleEl.textContent = 'Motion';
      applyTitleFont('OTMiniature');
    });
    streetGroup.addEventListener('mouseleave', function () {
      startTitleRotation();
    });
  }

  /* Hover on BLOCK: show "Book Covers" in OTMiniature-Bold, same size */
  const blockGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'BLOCK';
  });
  if (blockGroup && titleEl) {
    blockGroup.addEventListener('mouseenter', function () {
      stopTitleRotation();
      titleEl.textContent = 'Book Covers';
      applyTitleFont('OTMiniature');
    });
    blockGroup.addEventListener('mouseleave', function () {
      startTitleRotation();
    });
  }

  /* Hover on THE PRINCESS WILL COME AT FOUR: show "Illustrated Book" in OTMiniature-Bold, same size */
  const princessGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'THE PRINCESS WILL COME AT FOUR';
  });
  if (princessGroup && titleEl) {
    princessGroup.addEventListener('mouseenter', function () {
      stopTitleRotation();
      titleEl.textContent = 'Illustrated Book';
      applyTitleFont('OTMiniature');
    });
    princessGroup.addEventListener('mouseleave', function () {
      startTitleRotation();
    });
  }

  /* Hover on CANAANISM: show "Motion Posters" in OTMiniature-Bold, same size */
  const canaanismGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'CANAANISM';
  });
  if (canaanismGroup && titleEl) {
    canaanismGroup.addEventListener('mouseenter', function () {
      stopTitleRotation();
      titleEl.textContent = 'Motion Posters';
      applyTitleFont('OTMiniature');
    });
    canaanismGroup.addEventListener('mouseleave', function () {
      startTitleRotation();
    });
  }

  /* Hover on LUCID DREAMS: show "Website" in OTMiniature-Bold, same size */
  const lucidDreamsGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'LUCID DREAMS';
  });
  if (lucidDreamsGroup && titleEl) {
    lucidDreamsGroup.addEventListener('mouseenter', function () {
      stopTitleRotation();
      titleEl.textContent = 'Website';
      applyTitleFont('OTMiniature');
    });
    lucidDreamsGroup.addEventListener('mouseleave', function () {
      startTitleRotation();
    });
  }

  /* Hover on SOUTH INTERNATIONAL FILM FESTIVAL: show "Branding" in OTMiniature-Bold, same size */
  const southFestivalGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'SOUTH INTERNATIONAL FILM FESTIVAL';
  });
  if (southFestivalGroup && titleEl) {
    southFestivalGroup.addEventListener('mouseenter', function () {
      stopTitleRotation();
      titleEl.textContent = 'Branding';
      applyTitleFont('OTMiniature');
    });
    southFestivalGroup.addEventListener('mouseleave', function () {
      startTitleRotation();
    });
  }

  /* Hover on LISSITZKY: show "Posters" in OTMiniature-Bold, same size */
  const lissitzkyGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'LISSITZKY';
  });
  if (lissitzkyGroup && titleEl) {
    lissitzkyGroup.addEventListener('mouseenter', function () {
      stopTitleRotation();
      titleEl.textContent = 'Posters';
      applyTitleFont('OTMiniature');
    });
    lissitzkyGroup.addEventListener('mouseleave', function () {
      startTitleRotation();
    });
  }

  /* Hover on DAILY: show "Illustrations" in OTMiniature-Bold, same size */
  const dailyGroup = Array.from(document.querySelectorAll('.work-group')).find(function (a) {
    const span = a.querySelector('.work-item');
    return span && span.textContent.trim() === 'DAILY';
  });
  if (dailyGroup && titleEl) {
    dailyGroup.addEventListener('mouseenter', function () {
      stopTitleRotation();
      titleEl.textContent = 'Illustrations';
      applyTitleFont('OTMiniature');
    });
    dailyGroup.addEventListener('mouseleave', function () {
      startTitleRotation();
    });
  }

  const gridEl = document.getElementById('bottom-grid');
  if (!gridEl) return;

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

  function layoutGrid() {
    const topOffset = 305;
    const width = document.body.offsetWidth;
    const height = document.body.offsetHeight - topOffset;
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
        bg.style.backgroundImage = aboutVisible
          ? "url('me.png')"
          : "url('" + HOVER_BASE + imageNum + '.' + HOVER_IMAGE_EXT + "')";
        cell.appendChild(bg);
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
          if (aboutVisible) return;
          var page = getPageForImageNum(num);
          if (page) window.location.href = page + '.html';
        });
        cellsContainer.appendChild(cell);
        cellIndex++;
      }
    }
    gridEl.appendChild(cellsContainer);

    var isHome = !window.location.pathname || window.location.pathname === '/' ||
      window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    if (!introRan && isHome) {
      introRan = true;
      setTimeout(runGridIntro, 80);
    }
  }

  layoutGrid();
  window.addEventListener('resize', layoutGrid);
  /* כניסה ראשונה: אם הממדים לא היו מוכנים ב-DOMContentLoaded, בונים גריד ב-load ואז האנימציה תרוץ */
  window.addEventListener('load', function () {
    if (!gridEl.querySelector('.grid-cells') || !gridEl.querySelectorAll('.grid-cell').length) {
      layoutGrid();
    }
  });
});
