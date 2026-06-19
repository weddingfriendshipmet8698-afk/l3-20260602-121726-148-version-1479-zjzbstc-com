import { H as Hls } from './video-vendor.js';

const player = document.querySelector('[data-player]');
const video = document.getElementById('movie-video');
const button = document.querySelector('[data-play-button]');
let hls = null;

function loadVideo() {
  if (!video) {
    return Promise.resolve();
  }
  const source = video.dataset.src;
  if (!source) {
    return Promise.resolve();
  }
  if (video.dataset.ready === 'true') {
    return video.play();
  }
  video.dataset.ready = 'true';
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
  } else if (Hls && Hls.isSupported && Hls.isSupported()) {
    hls = new Hls({ enableWorker: true, lowLatencyMode: true });
    hls.loadSource(source);
    hls.attachMedia(video);
  } else {
    video.src = source;
  }
  return video.play();
}

function play() {
  loadVideo()
    .then(() => {
      if (player) {
        player.querySelector('.player-wrap').classList.add('playing');
      }
    })
    .catch(() => {
      if (player) {
        player.querySelector('.player-wrap').classList.remove('playing');
      }
    });
}

if (button) {
  button.addEventListener('click', play);
}

if (video) {
  video.addEventListener('play', () => {
    if (player) {
      player.querySelector('.player-wrap').classList.add('playing');
    }
  });
  video.addEventListener('pause', () => {
    if (video.currentTime === 0 && player) {
      player.querySelector('.player-wrap').classList.remove('playing');
    }
  });
  video.addEventListener('click', () => {
    if (video.paused) {
      play();
    }
  });
}

window.addEventListener('beforeunload', () => {
  if (hls) {
    hls.destroy();
  }
});
