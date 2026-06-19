(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function showSlide(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('active', position === index);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle('active', position === index);
      });
    }

    dots.forEach(function (dot, position) {
      dot.addEventListener('click', function () {
        showSlide(position);
      });
    });

    showSlide(0);
    setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-search-input]');
  var regionFilter = document.querySelector('[data-region-filter]');
  var genreFilter = document.querySelector('[data-genre-filter]');
  var typeFilter = document.querySelector('[data-type-filter]');
  var searchCards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
  var emptyState = document.querySelector('[data-empty-state]');

  function applyFilter() {
    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var region = regionFilter ? regionFilter.value : '';
    var genre = genreFilter ? genreFilter.value : '';
    var type = typeFilter ? typeFilter.value : '';
    var visible = 0;

    searchCards.forEach(function (card) {
      var text = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-genre') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-type') || ''
      ].join(' ').toLowerCase();
      var ok = true;

      if (keyword && text.indexOf(keyword) === -1) {
        ok = false;
      }
      if (region && (card.getAttribute('data-region') || '').indexOf(region) === -1) {
        ok = false;
      }
      if (genre && (card.getAttribute('data-genre') || '').indexOf(genre) === -1) {
        ok = false;
      }
      if (type && (card.getAttribute('data-type') || '') !== type) {
        ok = false;
      }

      card.style.display = ok ? '' : 'none';
      if (ok) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.style.display = visible ? 'none' : '';
    }
  }

  [searchInput, regionFilter, genreFilter, typeFilter].forEach(function (item) {
    if (item) {
      item.addEventListener('input', applyFilter);
      item.addEventListener('change', applyFilter);
    }
  });

  if (searchInput && window.location.search) {
    var params = new URLSearchParams(window.location.search);
    var keywordParam = params.get('keyword');
    if (keywordParam) {
      searchInput.value = keywordParam;
    }
  }
  applyFilter();

  var playerBox = document.querySelector('[data-player-box]');
  if (playerBox) {
    var video = playerBox.querySelector('video');
    var button = playerBox.querySelector('[data-play-button]');
    var source = video ? video.querySelector('source') : null;
    var streamUrl = source ? source.getAttribute('src') : '';
    var ready = false;

    function setupPlayer() {
      if (!video || ready || !streamUrl) {
        return;
      }
      ready = true;
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      }
    }

    function togglePlayback() {
      setupPlayer();
      if (!video) {
        return;
      }
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        togglePlayback();
      });
    }
    if (video) {
      video.addEventListener('click', togglePlayback);
      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('hidden');
        }
      });
      video.addEventListener('pause', function () {
        if (button) {
          button.classList.remove('hidden');
        }
      });
      setupPlayer();
    }
  }
})();
