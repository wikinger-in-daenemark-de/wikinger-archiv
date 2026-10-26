// Hamburger-Menue umschalten (Mobil)
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Scroll-Buttons: Seite nach oben / nach unten scrollen
(function () {
  function makeBtn(label, dir) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'scroll-btn scroll-' + dir;
    b.setAttribute('aria-label', label);
    b.textContent = dir === 'up' ? '▲' : '▼';
    b.addEventListener('click', function () {
      var top = dir === 'up' ? 0 : document.documentElement.scrollHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
    return b;
  }
  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(makeBtn('Nach oben', 'up'));
    document.body.appendChild(makeBtn('Nach unten', 'down'));
  });
})();

// Lightbox: Thumbnails (xthumbnail-orig-image) + Bild-Links in Overlay mit Vor/Zurueck
(function () {
  function isImage(h) { return /\.(jpg|jpeg|png|gif|webp)$/i.test(h); }
  var items = [];
  var idx = -1;
  var overlay = null;

  function build() {
    var list = [];
    var seen = {};
    document.querySelectorAll('img[xthumbnail-orig-image]').forEach(function (img) {
      var full = img.getAttribute('xthumbnail-orig-image');
      if (full && !seen[full]) { seen[full] = 1; var _pa = img.closest('a'); list.push({ src: full, el: img, caption: img.getAttribute('alt') || (_pa && _pa.getAttribute('title')) || '' }); }
    });
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (isImage(h)) {
        if (a.querySelector('img[xthumbnail-orig-image]')) return;
        if (!seen[h]) { seen[h] = 1; var _im = a.querySelector('img'); list.push({ src: h, el: a, caption: a.getAttribute('title') || (_im && _im.getAttribute('alt')) || '' }); }
      }
    });
    return list;
  }

  function show(i) {
    if (i < 0) i = list_len() - 1;
    if (i >= list_len()) i = 0;
    idx = i;
    overlay.querySelector('.lightbox-img').src = items[i].src;
    overlay.querySelector('.lightbox-caption').textContent = items[i].caption || '';
    overlay.querySelector('.lightbox-count').textContent = (i + 1) + ' / ' + items.length;
  }
  function list_len() { return items.length; }

  function open(i) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'lightbox';
      overlay.innerHTML = '<div class="lightbox-img-wrap"><img class="lightbox-img" alt=""></div>' +
        '<div class="lightbox-caption"></div>' +
        '<button class="lightbox-close" aria-label="Schließen">×</button>' +
        '<button class="lightbox-prev" aria-label="Zurück">‹</button>' +
        '<button class="lightbox-next" aria-label="Vorwärts">›</button>' +
        '<div class="lightbox-count"></div>';
      overlay.querySelector('.lightbox-close').addEventListener('click', close);
      overlay.querySelector('.lightbox-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
      overlay.querySelector('.lightbox-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
      overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(overlay);
    }
    show(i);
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (overlay) { overlay.style.display = 'none'; document.body.style.overflow = ''; }
  }
  function onKey(e) {
    if (!overlay || overlay.style.display === 'none') return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  }

  document.addEventListener('DOMContentLoaded', function () {
    items = build();
    if (!items.length) return;
    items.forEach(function (it, i) {
      it.el.addEventListener('click', function (e) { e.preventDefault(); open(i); });
    });
  });
})();
