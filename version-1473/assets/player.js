(function () {
  const video = document.getElementById("moviePlayer");
  const button = document.querySelector(".play-layer");
  const shell = document.querySelector(".player-shell");
  let attached = false;

  function attachStream() {
    if (!video || attached) return;
    const src = video.getAttribute("data-stream");
    if (!src) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      attached = true;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      attached = true;
      return;
    }
    video.src = src;
    attached = true;
  }

  function start() {
    attachStream();
    if (shell) {
      shell.classList.add("playing");
    }
    const promise = video && video.play ? video.play() : null;
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  if (button) {
    button.addEventListener("click", start);
  }

  if (video) {
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener("play", function () {
      if (shell) {
        shell.classList.add("playing");
      }
    });
  }
})();
