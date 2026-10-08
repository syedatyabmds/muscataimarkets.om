// Init AOS scroll animations
AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Animated hero background (Vanta WAVES over three.js).
   Skipped entirely under prefers-reduced-motion, and if either CDN script or
   WebGL is missing — in every one of those cases the .aurora gradient behind
   it is already the finished background, so there is nothing to fall back to. */
(() => {
  const el = document.querySelector('#hero-waves');
  if (!el || reduceMotion || !window.VANTA || !window.VANTA.WAVES) return;
  try {
    window.__heroWaves = window.VANTA.WAVES({
      el,
      mouseControls: true,
      touchControls: false,   // don't swallow vertical scroll on phones
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,
      // Deliberately dark: the hero sits on top of this, so the waves read as
      // texture rather than competing with the orange badge and body copy.
      // Vanta's lighting brightens the base colour a lot, so this is set far
      // darker than the violet it should end up looking like.
      color: 0x2a1466,
      shininess: 30,
      waveHeight: 18,
      waveSpeed: 0.7,
      zoom: 0.82
    });
    // Only now dim .aurora and switch the scrim on — without a live canvas
    // those two are tuned against nothing and the hero renders flat and dark.
    el.classList.add('is-on');
  } catch (err) {
    el.remove();              // leave the CSS gradient as the background
  }
})();

/* Fixed page-wide background: the connected-node topology, via VANTA.NET.
   NET rather than VANTA.TOPOLOGY — TOPOLOGY is a p5.js effect, which would add
   ~1 MB (LGPL) on top of the three.js already loaded here, and it renders as
   an almost invisible flow-field texture at these colours. NET draws the
   node-and-edge network the brief was after and reuses three.js.
   Same guards as the hero: skipped under reduced motion or if Vanta didn't
   load, leaving the opaque body::before gradient as the background. */
(() => {
  const el = document.querySelector('#site-topology');
  if (!el || reduceMotion || !window.VANTA || !window.VANTA.NET) return;
  try {
    window.__siteTopology = window.VANTA.NET({
      el,
      mouseControls: false,   // it is behind the whole page; don't trap input
      touchControls: false,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,
      color: 0x7c4dff,        // --violet; body::before adds the magenta/orange
      backgroundColor: 0x060518,
      points: 9,
      maxDistance: 21,
      spacing: 18,
      showDots: true
    });
    // Thins body::before to its translucent variant so the animation shows.
    document.body.classList.add('topology-on');
  } catch (err) {
    el.remove();
  }
})();

/* 3D tilt + glare on the content cards (vanilla-tilt, MIT, vendored locally).
   Pointer-driven only — skipped under reduced motion and on coarse-pointer
   devices, where there is no hover and the transform just costs battery. */
(() => {
  const cards = document.querySelectorAll('.tilt-card');
  if (!cards.length || reduceMotion || !window.VanillaTilt) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  window.VanillaTilt.init(cards, {
    max: 11,                // deeper tilt; card contents translateZ off the surface
    perspective: 900,
    speed: 600,
    scale: 1.03,
    glare: true,
    'max-glare': 0.22,
    gyroscope: false
  });
})();

/* =========================================================================
   PORTFOLIO — category filters + auto-sliding carousel
   Two cards per view on desktop, one on phones (driven by the CSS width of
   .pf-slide, which JS measures rather than duplicates). Each card carries
   its own crossfade through the client's images.
   ========================================================================= */

(() => {
  const root = document.querySelector('#portfolio-carousel');
  if (!root || !window.PORTFOLIO) return;

  const chipRow  = document.querySelector('#portfolio-filters');
  const track    = root.querySelector('.pf-track');
  const viewport = root.querySelector('.pf-viewport');
  const prevBtn  = root.querySelector('.pf-prev');
  const nextBtn  = root.querySelector('.pf-next');
  const dotRow   = root.querySelector('.pf-dots');
  const empty    = root.querySelector('.pf-empty');

  const SLIDE_MS = 5500;   // outer carousel: card to card
  const IMAGE_MS = 3400;   // inner crossfade: image to image

  let index = 0;
  let perView = 1;
  let slides = [];
  let autoTimer = null;
  let paused = false;

  // ---------------------------------------------------------------- markup

  const escape = (s) => String(s).replace(/[<>]/g, (c) => (c === '<' ? '&lt;' : '&gt;'));

  const imgSrc = (item, i) => `assets/portfolio/${item.slug}/${String(i + 1).padStart(2, '0')}.jpg`;

  /* Logos are sized to a constant visual area, not a constant height: capping
     height alone left the square Haddaya mark at 52x52 while the 5.3:1 blumen
     mark ran to 221x41. The area is the one the OMAN summit lockup already
     used (92x52), so that one is unchanged and the others match it. */
  const LOGO_AREA = 92 * 52;
  const logoHeight = (ar) => Math.round(Math.sqrt(LOGO_AREA / (ar || 1)));

  const brandMarkup = (item) => (item.logo
    ? `<img class="pf-logo${item.logoInvert ? ' invert' : ''}" src="${item.logo}" alt="${escape(item.brand)} logo" style="--logo-h:${logoHeight(item.logoAr)}px" loading="lazy">`
    : `<span class="pf-wordmark">${escape(item.brand)}</span>`);

  const buildCard = (item) => {
    const count = item.ar.length;
    const slide = document.createElement('div');
    slide.className = 'pf-slide';

    const imgs = item.ar.map((_, i) =>
      `<img src="${imgSrc(item, i)}" alt="${escape(item.brand)} — image ${i + 1} of ${count}"${i === 0 ? ' class="is-active"' : ' loading="lazy"'}>`
    ).join('');

    const dots = item.ar.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('');

    slide.innerHTML = `
      <article class="pf-card">
        <div class="pf-card-top">
          <p class="pf-desc">${item.desc}</p>
          <div class="pf-brand">${brandMarkup(item)}<span class="pf-sub">${escape(item.sub)}</span></div>
        </div>
        <div class="pf-tags">${item.tags.map((t) => `<span class="pf-tag">${escape(t)}</span>`).join('')}</div>
        <div class="pf-media">
          <span class="pf-count">${count} visuals</span>
          ${imgs}
          <div class="pf-media-dots">${dots}</div>
          <button class="pf-open" type="button" aria-label="View all ${count} visuals from ${escape(item.brand)}">
            <span class="pf-open-cue"><i class="fa-solid fa-up-right-and-down-left-from-center"></i> View all ${count}</span>
          </button>
        </div>
      </article>`;

    slide.querySelector('.pf-open').addEventListener('click', () => openGallery(item));
    return slide;
  };

  /* ------------------------------------------------------------- lightbox
     Mosaic laid out the way the source PDFs arrange their visuals: wide
     shots take the full row, portraits and squares pair up beside each
     other. `dense` backfills so there are no holes. */

  const lb       = document.querySelector('#pf-lightbox');
  const lbBrand  = lb.querySelector('.pf-lb-brand');
  const lbDesc   = lb.querySelector('.pf-lb-desc');
  const lbTags   = lb.querySelector('.pf-lb-tags');
  const lbGrid   = lb.querySelector('.pf-lb-grid');
  const zoom     = document.querySelector('#pf-zoom');
  const zoomImg  = zoom.querySelector('img');
  const zoomCnt  = zoom.querySelector('.pf-zoom-count');

  let current = null;      // item currently shown in the gallery
  let zoomIdx = 0;
  let lastFocus = null;

  /* Open/closed state is tracked in these flags rather than read back off
     `.hidden`, which lags by the length of the exit animation. Reading
     `.hidden` made a second Escape re-close the zoom instead of the gallery,
     and let the focus trap steal focus back during the close. */
  let galleryOpen = false;
  let zoomOpen = false;

  const lockScroll = (on) => { document.body.style.overflow = on ? 'hidden' : ''; };

  const openGallery = (item) => {
    current = item;
    galleryOpen = true;
    lastFocus = document.activeElement;

    lbBrand.innerHTML = `${brandMarkup(item)}<span class="pf-sub">${escape(item.sub)}</span>`;
    lbDesc.innerHTML = item.desc;
    lbTags.innerHTML = item.tags.map((t) => `<span class="pf-tag">${escape(t)}</span>`).join('');

    /* Each tile keeps the image's own proportions and wide shots take the full
       row, so the set reads the way the source PDF lays it out. Where a short
       image shares a row with a taller one it stretches to the row height
       rather than leaving a gap: the image itself is `contain`ed (never
       cropped or stretched) and a blurred copy of it fills the difference. */
    lbGrid.innerHTML = item.ar.map((ar, i) => {
      const src = imgSrc(item, i);
      return `
      <button class="pf-tile${ar >= 1.5 ? ' wide' : ''}" type="button" data-i="${i}">
        <span class="pf-tile-sizer" style="aspect-ratio:${ar}"></span>
        <img class="pf-tile-bg" src="${src}" alt="" aria-hidden="true" loading="lazy">
        <img class="pf-tile-img" src="${src}" alt="${escape(item.brand)} — image ${i + 1} of ${item.ar.length}" loading="lazy">
      </button>`;
    }).join('');

    lb.hidden = false;
    paused = true;
    lockScroll(true);
    requestAnimationFrame(() => lb.classList.add('open'));
    lb.querySelector('.pf-lb-close').focus();
  };

  const closeGallery = () => {
    if (!galleryOpen) return;
    galleryOpen = false;
    closeZoom();
    lb.classList.remove('open');
    const done = () => {
      if (galleryOpen) return;          // reopened inside the exit animation
      lb.hidden = true;
      lockScroll(false);
    };
    reduceMotion ? done() : setTimeout(done, 200);
    paused = false;
    current = null;

    // Never leave focus sitting on an element we just hid.
    if (lastFocus && lastFocus.isConnected && lastFocus !== document.body) {
      lastFocus.focus();
    } else {
      const active = document.activeElement;
      if (active && (lb.contains(active) || zoom.contains(active))) active.blur();
    }
  };

  const showZoom = (i) => {
    if (!current) return;
    const n = current.ar.length;
    zoomIdx = (i + n) % n;
    zoomImg.src = imgSrc(current, zoomIdx);
    zoomImg.alt = `${current.brand} — image ${zoomIdx + 1} of ${n}`;
    zoomCnt.textContent = `${zoomIdx + 1} / ${n}`;
    zoom.querySelectorAll('.pf-zoom-nav').forEach((b) => { b.hidden = n < 2; });
  };

  const openZoom = (i) => {
    zoomOpen = true;
    zoom.hidden = false;
    showZoom(i);
    requestAnimationFrame(() => zoom.classList.add('open'));
    zoom.querySelector('.pf-zoom-close').focus();
  };

  const closeZoom = () => {
    if (!zoomOpen) return;
    zoomOpen = false;
    zoom.classList.remove('open');
    const done = () => {
      if (zoomOpen) return;
      zoom.hidden = true;
      zoomImg.removeAttribute('src');
    };
    reduceMotion ? done() : setTimeout(done, 200);
  };

  lbGrid.addEventListener('click', (e) => {
    const tile = e.target.closest('.pf-tile');
    if (tile) openZoom(Number(tile.dataset.i));
  });

  lb.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeGallery));
  zoom.querySelectorAll('[data-zclose]').forEach((el) => el.addEventListener('click', closeZoom));
  zoom.querySelector('.pf-zoom-prev').addEventListener('click', () => showZoom(zoomIdx - 1));
  zoom.querySelector('.pf-zoom-next').addEventListener('click', () => showZoom(zoomIdx + 1));

  document.addEventListener('keydown', (e) => {
    if (!galleryOpen) return;
    if (e.key === 'Escape') { zoomOpen ? closeZoom() : closeGallery(); return; }
    if (!zoomOpen) return;
    if (e.key === 'ArrowLeft')  showZoom(zoomIdx - 1);
    if (e.key === 'ArrowRight') showZoom(zoomIdx + 1);
  });

  // Keep Tab inside whichever layer is on top.
  document.addEventListener('focusin', (e) => {
    if (!galleryOpen) return;
    const scope = zoomOpen ? zoom : lb;
    if (!scope.contains(e.target)) scope.querySelector('button').focus();
  });

  // ------------------------------------------------- inner image crossfade

  const startMediaLoop = (slide, offset) => {
    const media = slide.querySelector('.pf-media');
    const imgs = [...media.querySelectorAll('img')];
    const dots = [...media.querySelectorAll('.pf-media-dots i')];
    if (imgs.length < 2 || reduceMotion) return;

    let i = 0;
    const tick = () => {
      imgs[i].classList.remove('is-active');
      dots[i].classList.remove('on');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('is-active');
      dots[i].classList.add('on');
    };
    // Stagger the cards so they don't all flip on the same frame.
    setTimeout(() => {
      media._timer = setInterval(() => { if (!paused) tick(); }, IMAGE_MS);
    }, offset);
  };

  // -------------------------------------------------------- outer carousel

  const measure = () => {
    if (!slides.length) return;
    const vw = viewport.clientWidth;
    const sw = slides[0].getBoundingClientRect().width;
    perView = Math.max(1, Math.round(vw / sw));
  };

  const maxIndex = () => Math.max(0, slides.length - perView);

  const apply = (animate = true) => {
    if (!slides.length) return;
    index = Math.min(index, maxIndex());
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap) || 0;
    const step = slides[0].getBoundingClientRect().width + gap;
    track.classList.toggle('no-anim', !animate);
    track.style.transform = `translateX(${-index * step}px)`;
    if (!animate) requestAnimationFrame(() => track.classList.remove('no-anim'));

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= maxIndex();
    [...dotRow.children].forEach((d, i) => d.classList.toggle('on', i === index));
  };

  const go = (i) => { index = Math.max(0, Math.min(i, maxIndex())); apply(); };
  const next = () => go(index >= maxIndex() ? 0 : index + 1);
  const prev = () => go(index <= 0 ? maxIndex() : index - 1);

  const buildDots = () => {
    dotRow.innerHTML = '';
    const pages = maxIndex() + 1;
    if (pages <= 1 || !slides.length) return;
    for (let i = 0; i < pages; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.addEventListener('click', () => { go(i); restart(); });
      dotRow.appendChild(b);
    }
  };

  const restart = () => {
    clearInterval(autoTimer);
    if (reduceMotion || slides.length <= perView) return;
    autoTimer = setInterval(() => { if (!paused) next(); }, SLIDE_MS);
  };

  // ------------------------------------------------------------- rendering

  const render = (cat) => {
    track.querySelectorAll('.pf-media').forEach((m) => clearInterval(m._timer));
    track.innerHTML = '';

    const items = window.PORTFOLIO.filter((p) => cat === 'all' || p.cats.includes(cat));
    empty.hidden = items.length > 0;

    items.forEach((item, i) => {
      const slide = buildCard(item);
      track.appendChild(slide);
      startMediaLoop(slide, (i % 4) * 700);
    });

    slides = [...track.children];
    index = 0;
    measure();
    buildDots();
    apply(false);
    restart();
    if (window.AOS) AOS.refresh();
  };

  // --------------------------------------------------------------- filters

  window.PORTFOLIO_FILTERS.forEach((f, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (i === 0 ? ' chip-active' : '');
    b.textContent = f.label;
    b.dataset.cat = f.id;
    b.addEventListener('click', () => {
      chipRow.querySelectorAll('.chip').forEach((c) => c.classList.remove('chip-active'));
      b.classList.add('chip-active');
      render(f.id);
    });
    chipRow.appendChild(b);
  });

  // ------------------------------------------------------------ interaction

  nextBtn.addEventListener('click', () => { next(); restart(); });
  prevBtn.addEventListener('click', () => { prev(); restart(); });

  root.addEventListener('mouseenter', () => { paused = true; });
  root.addEventListener('mouseleave', () => { paused = false; });
  root.addEventListener('focusin', () => { paused = true; });
  root.addEventListener('focusout', () => { paused = false; });
  document.addEventListener('visibilitychange', () => { paused = document.hidden; });

  // Swipe / drag
  let startX = null;
  viewport.addEventListener('pointerdown', (e) => { startX = e.clientX; paused = true; });
  viewport.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 45) { dx < 0 ? next() : prev(); restart(); }
    startX = null;
    paused = false;
  });
  viewport.addEventListener('pointercancel', () => { startX = null; paused = false; });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { measure(); buildDots(); apply(false); restart(); }, 150);
  });

  render('all');
})();

/* ========================================================================= */

// Close other FAQ items when one opens (accordion behavior)
document.querySelectorAll('details.faq').forEach((el) => {
  el.addEventListener('toggle', () => {
    if (el.open) {
      document.querySelectorAll('details.faq').forEach((other) => {
        if (other !== el) other.open = false;
      });
    }
  });
});

// Animate stat numbers on view
const animateNum = (el) => {
  const text = el.textContent.trim();
  const match = text.match(/([\d.]+)/);
  if (!match) return;
  const end = parseFloat(match[1]);
  const prefix = text.slice(0, match.index);
  const suffix = text.slice(match.index + match[0].length);
  let start = 0;
  const duration = 1400;
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = (start + (end - start) * eased);
    const display = end >= 10 ? Math.round(val) : val.toFixed(1);
    el.textContent = prefix + display + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateNum(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-num').forEach((el) => observer.observe(el));

// Smooth header background on scroll
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) header.classList.add('bg-black/70');
  else header.classList.remove('bg-black/70');
});

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('header nav');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });
  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
  });
}

// Contact form submission
const contactForm = document.querySelector('#contact form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('[type="text"]').value.trim();
    const email = contactForm.querySelector('[type="email"]').value.trim();
    if (!name || !email) {
      alert('Please fill in your name and email.');
      return;
    }
    alert('Thank you for your message! We will get back to you within 24 hours.');
    contactForm.reset();
  });
}
