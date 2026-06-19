(function () {
  function closestHeader(button) {
    return button.closest('.site-header');
  }

  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('[data-mobile-toggle]');
    if (toggle) {
      var header = closestHeader(toggle);
      if (header) {
        header.classList.toggle('is-open');
      }
    }

    var dot = event.target.closest('[data-slide-dot]');
    if (dot) {
      var slider = dot.closest('[data-hero-slider]');
      if (slider) {
        activateSlide(slider, Number(dot.getAttribute('data-slide-dot')) || 0);
      }
    }
  });

  function activateSlide(slider, index) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-slide-dot]'));
    if (!slides.length) {
      return;
    }
    var nextIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, currentIndex) {
      slide.classList.toggle('is-active', currentIndex === nextIndex);
    });
    dots.forEach(function (dot, currentIndex) {
      dot.classList.toggle('is-active', currentIndex === nextIndex);
    });
    slider.setAttribute('data-current-slide', String(nextIndex));
  }

  function setupHeroSliders() {
    var sliders = document.querySelectorAll('[data-hero-slider]');
    sliders.forEach(function (slider) {
      activateSlide(slider, 0);
      if (slider.getAttribute('data-autoplay') === 'true') {
        window.setInterval(function () {
          var current = Number(slider.getAttribute('data-current-slide')) || 0;
          activateSlide(slider, current + 1);
        }, 5200);
      }
    });
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupFilters() {
    var filterRoot = document.querySelector('[data-filter-root]');
    if (!filterRoot) {
      return;
    }

    var input = filterRoot.querySelector('[data-filter-input]');
    var type = filterRoot.querySelector('[data-filter-type]');
    var year = filterRoot.querySelector('[data-filter-year]');
    var region = filterRoot.querySelector('[data-filter-region]');
    var count = filterRoot.querySelector('[data-result-count]');
    var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-card]'));

    function update() {
      var keyword = normalize(input && input.value);
      var selectedType = normalize(type && type.value);
      var selectedYear = normalize(year && year.value);
      var selectedRegion = normalize(region && region.value);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-summary') + ' ' + card.getAttribute('data-genre'));
        var cardType = normalize(card.getAttribute('data-type'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardRegion = normalize(card.getAttribute('data-region'));
        var matched = true;

        if (keyword && haystack.indexOf(keyword) === -1) {
          matched = false;
        }
        if (selectedType && cardType !== selectedType) {
          matched = false;
        }
        if (selectedYear && cardYear !== selectedYear) {
          matched = false;
        }
        if (selectedRegion && cardRegion !== selectedRegion) {
          matched = false;
        }

        card.classList.toggle('hide-card', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = '当前显示 ' + visible + ' 部影片';
      }
    }

    [input, type, year, region].forEach(function (node) {
      if (node) {
        node.addEventListener('input', update);
        node.addEventListener('change', update);
      }
    });

    update();
  }

  function setupHeaderSearch() {
    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        var prefix = form.getAttribute('data-root') || '';
        var url = prefix + 'search.html';
        if (query) {
          url += '?q=' + encodeURIComponent(query);
        }
        window.location.href = url;
      });
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      var searchInput = document.querySelector('[data-filter-input]');
      if (searchInput) {
        searchInput.value = q;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupHeroSliders();
    setupHeaderSearch();
    setupFilters();
  });
})();
