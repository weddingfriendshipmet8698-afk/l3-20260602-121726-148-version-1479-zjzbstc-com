import { H as Hls } from './hls-dru42stk.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setupMenu() {
  const toggle = $('[data-menu-toggle]');
  const nav = $('[data-site-nav]');
  const search = $('.header-search');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    if (search) {
      search.classList.toggle('is-open');
    }
  });
}

function setupHero() {
  const hero = $('[data-hero]');
  if (!hero) {
    return;
  }

  const slides = $$('[data-hero-slide]', hero);
  const dots = $$('[data-hero-dot]', hero);
  let current = 0;

  function activate(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      activate(Number(dot.dataset.heroDot || 0));
    });
  });

  if (slides.length > 1) {
    setInterval(() => activate(current + 1), 5200);
  }
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function setupFilters() {
  const panel = $('[data-filter-panel]');
  const grid = $('[data-card-grid]');
  if (!panel || !grid) {
    return;
  }

  const input = $('[data-filter-input]', panel);
  const yearFilter = $('[data-year-filter]', panel);
  const cards = $$('[data-card]', grid);
  const empty = $('[data-empty-state]');
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');

  if (query && input) {
    input.value = query;
  }

  function apply() {
    const keyword = normalize(input ? input.value : '');
    const year = yearFilter ? yearFilter.value : '';
    let visible = 0;

    cards.forEach((card) => {
      const text = normalize(card.textContent + ' ' + Object.values(card.dataset).join(' '));
      const matchedKeyword = !keyword || text.includes(keyword);
      const matchedYear = !year || String(card.dataset.year || '') === year;
      const show = matchedKeyword && matchedYear;

      card.hidden = !show;
      if (show) {
        visible += 1;
      }
    });

    if (empty) {
      empty.hidden = visible > 0;
    }
  }

  if (input) {
    input.addEventListener('input', apply);
  }

  if (yearFilter) {
    yearFilter.addEventListener('change', apply);
  }

  apply();
}

function setupImageFallbacks() {
  $$('img').forEach((img) => {
    img.addEventListener('error', () => {
      const wrap = img.closest('.poster-wrap, .hero-poster, .detail-poster');
      if (wrap) {
        wrap.classList.add('poster-missing');
      }
      img.style.opacity = '0';
    }, { once: true });
  });
}

function setupPlayer() {
  const buttons = $$('[data-player-button]');

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const shell = button.closest('[data-video-shell]');
      const video = shell ? $('[data-player-video]', shell) : null;
      const src = button.dataset.playerSrc;

      if (!video || !src) {
        return;
      }

      button.classList.add('is-hidden');

      if (Hls && Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });

        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          console.warn('HLS playback warning:', data);
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(() => {});
        }, { once: true });
      } else {
        video.src = src;
        video.play().catch(() => {});
      }
    });
  });
}

function setupSearchForms() {
  $$('[data-search-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      const input = form.querySelector('input[name="q"]');
      if (!input || input.value.trim()) {
        return;
      }
      event.preventDefault();
      window.location.href = form.getAttribute('action') || 'search.html';
    });
  });
}

setupMenu();
setupHero();
setupFilters();
setupImageFallbacks();
setupPlayer();
setupSearchForms();
