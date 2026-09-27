(function() {
  var TRACKS = [
    {
      title: 'Rush E',
      artist: 'Sheet Music Boss',
      src: 'audio/rush-e.mp3'
    },
    {
      title: 'Лунная соната',
      artist: 'Людвиг ван Бетховен',
      src: 'audio/beethoven.mp3'
    }
  ];

  function getBase() {
    // Определяем префикс для подпапок
    if (window.location.pathname.indexOf('/distros/') !== -1 ||
        window.location.pathname.indexOf('/guides/') !== -1 ||
        window.location.pathname.indexOf('/kali/') !== -1 ||
        window.location.pathname.indexOf('/problems/') !== -1 ||
        window.location.pathname.indexOf('/blog/') !== -1) {
      return '../';
    }
    return '';
  }

  var BASE = getBase();
  var current = 0;
  var isPlaying = false;
  var audio = null;
  var btn = null;
  var player = null;

  function buildUI() {
    // Кнопка в шапке
    btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'music-btn';
    btn.setAttribute('aria-label', 'Музыка');
    btn.innerHTML = '🎵';

    var header = document.querySelector('.header-inner');
    if (header) {
      header.appendChild(btn);
    } else {
      document.body.appendChild(btn);
    }

    // Плеер
    player = document.createElement('div');
    player.className = 'music-player';
    player.innerHTML =
      '<div class="mp-head">' +
        '<span class="mp-title">🎵 Музыка</span>' +
        '<button type="button" class="mp-close" aria-label="Закрыть">✕</button>' +
      '</div>' +
      '<div class="mp-tracks"></div>' +
      '<div class="mp-controls">' +
        '<button type="button" class="mp-prev" aria-label="Назад">⏮</button>' +
        '<button type="button" class="mp-play" aria-label="Играть">▶</button>' +
        '<button type="button" class="mp-next" aria-label="Вперёд">⏭</button>' +
      '</div>' +
      '<div class="mp-progress">' +
        '<span class="mp-time-current">0:00</span>' +
        '<input type="range" class="mp-seek" min="0" max="100" value="0" step="0.1">' +
        '<span class="mp-time-total">0:00</span>' +
      '</div>';
    document.body.appendChild(player);

    // Аудио
    audio = new Audio();
    audio.preload = 'metadata';
    audio.addEventListener('ended', nextTrack);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('error', function() {
      var trackEl = player.querySelector('.mp-tracks .mp-track.active');
      if (trackEl) trackEl.classList.add('error');
    });

    // Треки
    var tracksContainer = player.querySelector('.mp-tracks');
    TRACKS.forEach(function(t, i) {
      var el = document.createElement('div');
      el.className = 'mp-track';
      if (i === 0) el.classList.add('active');
      el.innerHTML = '<div class="mp-track-num">' + (i + 1) + '</div>' +
                     '<div class="mp-track-info">' +
                     '<div class="mp-track-title">' + t.title + '</div>' +
                     '<div class="mp-track-artist">' + t.artist + '</div>' +
                     '</div>' +
                     '<div class="mp-track-play">▶</div>';
      el.addEventListener('click', function() {
        if (current === i && isPlaying) {
          pause();
        } else {
          current = i;
          play();
        }
        updateActiveTrack();
      });
      tracksContainer.appendChild(el);
    });

    // Обработчики
    btn.addEventListener('click', togglePlayer);
    player.querySelector('.mp-close').addEventListener('click', closePlayer);
    player.querySelector('.mp-play').addEventListener('click', togglePlay);
    player.querySelector('.mp-prev').addEventListener('click', prevTrack);
    player.querySelector('.mp-next').addEventListener('click', nextTrack);
    player.querySelector('.mp-seek').addEventListener('input', seek);

    updateActiveTrack();
    updatePlayButton();
  }

  function updateActiveTrack() {
    var tracks = player.querySelectorAll('.mp-track');
    tracks.forEach(function(el, i) {
      el.classList.toggle('active', i === current);
    });
  }

  function updatePlayButton() {
    var playBtn = player.querySelector('.mp-play');
    playBtn.textContent = isPlaying ? '⏸' : '▶';
  }

  function updateProgress() {
    if (!audio.duration) return;
    var seek = player.querySelector('.mp-seek');
    seek.value = (audio.currentTime / audio.duration) * 100;
    player.querySelector('.mp-time-current').textContent = formatTime(audio.currentTime);
  }

  function updateDuration() {
    player.querySelector('.mp-time-total').textContent = formatTime(audio.duration);
  }

  function formatTime(s) {
    if (isNaN(s)) return '0:00';
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function play() {
    var src = BASE + TRACKS[current].src;
    if (audio.src !== new URL(src, window.location.href).href) {
      audio.src = src;
    }
    var p = audio.play();
    if (p !== undefined) {
      p.then(function() {
        isPlaying = true;
        updatePlayButton();
      }).catch(function(err) {
        console.log('Ошибка воспроизведения:', err.message);
        isPlaying = false;
        updatePlayButton();
      });
    }
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    updatePlayButton();
  }

  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function nextTrack() {
    current = (current + 1) % TRACKS.length;
    updateActiveTrack();
    if (isPlaying) {
      play();
    }
  }

  function prevTrack() {
    current = (current - 1 + TRACKS.length) % TRACKS.length;
    updateActiveTrack();
    if (isPlaying) {
      play();
    }
  }

  function seek() {
    if (!audio.duration) return;
    var seek = player.querySelector('.mp-seek');
    audio.currentTime = (seek.value / 100) * audio.duration;
  }

  function togglePlayer() {
    player.classList.toggle('open');
    if (player.classList.contains('open') && !isPlaying) {
      // Не запускаем автоматом — только показываем
    }
  }

  function closePlayer() {
    player.classList.remove('open');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
