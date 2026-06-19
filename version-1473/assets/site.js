(function () {
  const toggle = document.querySelector(".menu-toggle");
  const mobilePanel = document.querySelector(".mobile-panel");

  if (toggle && mobilePanel) {
    toggle.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  const prev = document.querySelector(".hero-prev");
  const next = document.querySelector(".hero-next");
  let active = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) return;
    active = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("active", i === active);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === active);
    });
  }

  function startHero() {
    if (timer) window.clearInterval(timer);
    if (slides.length > 1) {
      timer = window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  if (slides.length) {
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
        startHero();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        showSlide(active - 1);
        startHero();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        showSlide(active + 1);
        startHero();
      });
    }
    startHero();
  }

  const list = document.querySelector(".searchable-list");
  const input = document.querySelector(".page-filter");
  const yearFilter = document.querySelector(".year-filter");
  const cards = list ? Array.from(list.querySelectorAll(".movie-card")) : [];
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";

  if (input && initialQuery) {
    input.value = initialQuery;
  }

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .trim();
  }

  function filterCards() {
    if (!cards.length) return;
    const keyword = normalize(input ? input.value : "");
    const year = yearFilter ? yearFilter.value : "";
    let visible = 0;
    cards.forEach(function (card) {
      const haystack = normalize(
        [
          card.dataset.title,
          card.dataset.year,
          card.dataset.region,
          card.dataset.tags,
        ].join(" "),
      );
      const matchText = !keyword || haystack.indexOf(keyword) !== -1;
      const matchYear = !year || card.dataset.year === year;
      const show = matchText && matchYear;
      card.classList.toggle("hidden-card", !show);
      if (show) visible += 1;
    });
    document.body.classList.toggle("search-empty", visible === 0);
  }

  if (cards.length) {
    if (input) {
      input.addEventListener("input", filterCards);
    }
    if (yearFilter) {
      yearFilter.addEventListener("change", filterCards);
    }
    filterCards();
  }
})();
