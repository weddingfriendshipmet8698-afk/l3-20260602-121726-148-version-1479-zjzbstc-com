const menuButton = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
}

const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
let heroIndex = 0;
let heroTimer = null;

function showHero(index) {
  if (!slides.length) {
    return;
  }
  heroIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === heroIndex));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === heroIndex));
}

function startHero() {
  if (slides.length <= 1) {
    return;
  }
  heroTimer = window.setInterval(() => showHero(heroIndex + 1), 5200);
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    if (heroTimer) {
      window.clearInterval(heroTimer);
    }
    showHero(index);
    startHero();
  });
});

showHero(0);
startHero();

const filterInput = document.querySelector('[data-filter-input]');
const filterList = document.querySelector('[data-filter-list]');

if (filterInput && filterList) {
  filterInput.addEventListener('input', () => {
    const keyword = filterInput.value.trim().toLowerCase();
    const cards = Array.from(filterList.querySelectorAll('.movie-card'));
    cards.forEach(card => {
      const text = card.textContent.toLowerCase() + ' ' + (card.dataset.title || '').toLowerCase() + ' ' + (card.dataset.genre || '').toLowerCase();
      card.style.display = text.includes(keyword) ? '' : 'none';
    });
  });
}

function cardTemplate(item) {
  return `
    <a class="movie-card compact" href="./${item.file}" data-title="${item.title}" data-year="${item.year}" data-genre="${item.genre}">
      <figure>
        <img src="${item.cover}" alt="${item.title}" loading="lazy">
        <figcaption><span>${item.type}</span><span>${item.year}</span></figcaption>
      </figure>
      <div class="movie-card-body">
        <h3>${item.title}</h3>
        <p>${item.one_line}</p>
        <div class="meta-line"><span>${item.region}</span><span>${item.genre}</span></div>
      </div>
    </a>
  `;
}

const searchForm = document.querySelector('[data-search-page-form]');
const searchInput = document.querySelector('[data-search-page-input]');
const searchResults = document.querySelector('[data-search-results]');
const searchTitle = document.querySelector('[data-search-title]');

function runSearch(query) {
  if (!searchResults || !window.SEARCH_INDEX) {
    return;
  }
  const keyword = (query || '').trim().toLowerCase();
  if (!keyword) {
    return;
  }
  const result = window.SEARCH_INDEX.filter(item => {
    const text = [item.title, item.region, item.type, item.year, item.genre, item.tags, item.one_line].join(' ').toLowerCase();
    return text.includes(keyword);
  }).slice(0, 80);
  searchTitle.textContent = `“${query}”相关影片`;
  searchResults.innerHTML = result.length ? result.map(cardTemplate).join('') : '<p class="empty-state">没有找到相关影片，可以更换关键词继续搜索。</p>';
}

if (searchForm && searchInput) {
  const params = new URLSearchParams(window.location.search);
  const initial = params.get('q') || '';
  searchInput.value = initial;
  runSearch(initial);
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const query = searchInput.value.trim();
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    window.history.replaceState({}, '', url.toString());
    runSearch(query);
  });
}
