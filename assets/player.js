import { H as Hls } from './video-vendor-dru42stk.js';

function setMessage(element, message) {
  if (element) {
    element.textContent = message || '';
  }
}

function attachHls(video, source, message) {
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    setMessage(message, '播放器已载入，正在使用浏览器原生 HLS 播放能力。');
    return Promise.resolve();
  }

  if (Hls && Hls.isSupported()) {
    var hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 60
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    setMessage(message, '播放器已载入 HLS 流媒体，点击播放后会根据网络自动切换清晰度。');
    return Promise.resolve(hls);
  }

  setMessage(message, '当前浏览器暂不支持 HLS 播放，请更换新版 Chrome、Safari、Edge 或 Firefox。');
  return Promise.reject(new Error('HLS is not supported in this browser.'));
}

function setupPlayer(root) {
  var video = root.querySelector('video');
  var overlay = root.querySelector('[data-play-overlay]');
  var message = root.querySelector('[data-player-message]');
  var source = root.getAttribute('data-video-src');
  var initialized = false;

  if (!video || !source) {
    setMessage(message, '未找到播放源。');
    return;
  }

  function start() {
    if (!initialized) {
      initialized = true;
      attachHls(video, source, message).catch(function () {});
    }

    if (overlay) {
      overlay.hidden = true;
    }

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        setMessage(message, '播放已准备好，如果浏览器阻止自动播放，请再次点击视频控件。');
      });
    }
  }

  if (overlay) {
    overlay.addEventListener('click', start);
  }

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.hidden = true;
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-static-player]').forEach(setupPlayer);
});
