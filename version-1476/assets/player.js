document.addEventListener('DOMContentLoaded', function () {
  var frames = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  frames.forEach(function (frame) {
    var video = frame.querySelector('video');
    var button = frame.querySelector('.play-button');
    var source = frame.getAttribute('data-src');
    var loaded = false;
    var hls = null;

    function attachSource() {
      if (!video || !source || loaded) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }

      loaded = true;
    }

    function play() {
      attachSource();

      if (!video) {
        return;
      }

      video.controls = true;
      frame.classList.add('is-playing');
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          frame.classList.remove('is-playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        play();
      });
    }

    frame.addEventListener('click', function (event) {
      if (event.target === video) {
        return;
      }

      play();
    });

    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
});
