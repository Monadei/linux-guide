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
      '</div>' +
      '<div class="mp-volume">' +
        '<button type="button" class="mp-mute" aria-label="Выключить звук">🔊</button>' +
        '<input type="range" class="mp-vol" min="0" max="100" value="100" step="1" aria-label="Громкость">' +
        '<span class="mp-vol-val">100</span>' +
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

    // === ГРОМКОСТЬ ===
    var volSlider = player.querySelector('.mp-vol');
    var volVal = player.querySelector('.mp-vol-val');
    var muteBtn = player.querySelector('.mp-mute');

    // Загружаем сохранённую громкость
    var savedVol = 1;
    var savedMuted = false;
    try {
      var sv = localStorage.getItem('music-volume');
      if (sv !== null) savedVol = parseFloat(sv);
      var sm = localStorage.getItem('music-muted');
      if (sm === '1') savedMuted = true;
    } catch(e) {}

    audio.volume = savedVol;
    audio.muted = savedMuted;
    volSlider.value = Math.round(savedVol * 100);
    volVal.textContent = Math.round(savedVol * 100);
    updateMuteIcon();

    volSlider.addEventListener('input', function() {
      var v = parseFloat(volSlider.value) / 100;
      audio.volume = v;
      audio.muted = false;
      volVal.textContent = Math.round(v * 100);
      saveVolume();
      updateMuteIcon();
    });

    muteBtn.addEventListener('click', function() {
      audio.muted = !audio.muted;
      // Если включаем звук, а громкость 0 — поднимаем до 50
      if (!audio.muted && audio.volume === 0) {
        audio.volume = 0.5;
        volSlider.value = 50;
        volVal.textContent = 50;
      }
      saveVolume();
      updateMuteIcon();
    });

    function updateMuteIcon() {
      if (audio.muted || audio.volume === 0) {
        muteBtn.textContent = '🔇';
        muteBtn.classList.add('muted');
      } else if (audio.volume < 0.5) {
        muteBtn.textContent = '🔉';
        muteBtn.classList.remove('muted');
      } else {
        muteBtn.textContent = '🔊';
        muteBtn.classList.remove('muted');
      }
    }

    function saveVolume() {
      try {
        localStorage.setItem('music-volume', audio.volume);
        localStorage.setItem('music-muted', audio.muted ? '1' : '0');
      } catch(e) {}
    }

    // === ГОРЯЧИЕ КЛАВИШИ ===
    document.addEventListener('keydown', function(e) {
      // Не перехватываем если фокус в поле ввода
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.key === 'ArrowUp' && player.classList.contains('open')) {
        e.preventDefault();
        audio.volume = Math.min(1, audio.volume + 0.05);
        volSlider.value = Math.round(audio.volume * 100);
        volVal.textContent = Math.round(audio.volume * 100);
        audio.muted = false;
        saveVolume();
        updateMuteIcon();
      } else if (e.key === 'ArrowDown' && player.classList.contains('open')) {
        e.preventDefault();
        audio.volume = Math.max(0, audio.volume - 0.05);
        volSlider.value = Math.round(audio.volume * 100);
        volVal.textContent = Math.round(audio.volume * 100);
        audio.muted = false;
        saveVolume();
        updateMuteIcon();
      } else if ((e.key === 'm' || e.key === 'M' || e.key === 'ь' || e.key === 'Ь') && player.classList.contains('open')) {
        muteBtn.click();
      }
    });

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
