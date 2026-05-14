// ==============================
// ДАННЫЕ — редактируй здесь
// ==============================

const photos = [
  { src: "photos/photo1.jpg", caption: "подпись к фото 1" },
  { src: "photos/photo2.jpg", caption: "подпись к фото 2" },
  { src: "photos/photo3.jpg", caption: "подпись к фото 3" },
  { src: "photos/photo4.jpg", caption: "подпись к фото 4" },
  { src: "photos/photo5.jpg", caption: "подпись к фото 5" },
  { src: "photos/photo6.jpg", caption: "подпись к фото 6" },
  // добавляй новые строчки сюда:
  // { src: "photos/photo7.jpg", caption: "подпись" },
];

const tracks = [
  { title: "Название песни 1", artist: "Артист", src: "music/track1.mp3", note: "вот это точно ты" },
  { title: "Название песни 2", artist: "Артист", src: "music/track2.mp3", note: "помнишь, мы слушали..." },
  { title: "Название песни 3", artist: "Артист", src: "music/track3.mp3", note: "твой гимн" },
  { title: "Название песни 4", artist: "Артист", src: "music/track4.mp3", note: "🎵" },
  // добавляй новые строчки сюда:
  // { title: "...", artist: "...", src: "music/track5.mp3", note: "..." },
];

// ==============================
// КОД — не нужно трогать
// ==============================

const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const d = new Date();
document.getElementById('letter-date').textContent = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

const grid = document.getElementById('polaroid-grid');
const rots = [-2.5, 1.8, -1.2, 2.2, -0.8, 1.5, -2, 1, -1.8, 2.5];
photos.forEach((p, i) => {
  const card = document.createElement('div');
  card.className = 'polaroid';
  card.style.setProperty('--rot', (rots[i % rots.length]) + 'deg');
  if (p.src) {
    card.innerHTML = `<img class="polaroid-img" src="${p.src}" alt="${p.caption}"><p class="polaroid-caption">${p.caption}</p>`;
  } else {
    card.innerHTML = `<div class="polaroid-placeholder">📷</div><p class="polaroid-caption">${p.caption}</p>`;
  }
  grid.appendChild(card);
});

let currentAudio = null;
let currentTrackEl = null;
const musicList = document.getElementById('music-list');
const audioContainer = document.getElementById('audio-container');

tracks.forEach((t, i) => {
  const audio = document.createElement('audio');
  audio.src = t.src;
  audio.preload = 'none';
  audio.id = `audio-${i}`;
  audioContainer.appendChild(audio);

  const card = document.createElement('div');
  card.className = 'track';
  card.id = `track-${i}`;
  card.innerHTML = `
    <button class="track-play" aria-label="Играть ${t.title}">▶</button>
    <div class="track-info">
      <div class="track-title">${t.title}</div>
      <div class="track-artist">${t.artist}</div>
      <div class="track-progress"><div class="track-progress-bar" id="bar-${i}"></div></div>
    </div>
    <div class="track-note">${t.note}</div>
  `;
  musicList.appendChild(card);

  const btn = card.querySelector('.track-play');
  btn.addEventListener('click', () => {
    const audio = document.getElementById(`audio-${i}`);
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentTrackEl.classList.remove('playing');
      currentTrackEl.querySelector('.track-play').textContent = '▶';
      document.getElementById(`bar-${currentTrackEl.id.replace('track-','bar-')}`).style.width = '0%';
    }
    if (audio.paused) {
      audio.play().catch(() => {});
      card.classList.add('playing');
      btn.textContent = '⏸';
      currentAudio = audio;
      currentTrackEl = card;
    } else {
      audio.pause();
      card.classList.remove('playing');
      btn.textContent = '▶';
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      document.getElementById(`bar-${i}`).style.width = (audio.currentTime / audio.duration * 100) + '%';
    }
  });
  audio.addEventListener('ended', () => {
    card.classList.remove('playing');
    btn.textContent = '▶';
    document.getElementById(`bar-${i}`).style.width = '0%';
  });
});

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelector(`[data-page="${id}"]`).classList.add('active');

  const nav = document.getElementById('main-nav');
  if (id === 'main') {
    nav.style.opacity = '0';
    nav.style.pointerEvents = 'none';
    launchConfetti();
  } else {
    nav.style.opacity = '1';
    nav.style.pointerEvents = 'all';
  }
}

function launchConfetti() {
  const colors = ['#f2d9d0','#e8b4a2','#c98b78','#fdf6f0','#8b5a4a'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 12 + 6}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        transform: rotate(${Math.random() * 360}deg);
        animation-duration: ${Math.random() * 2 + 2}s;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3000);
    }, i * 30);
  }
}

window.addEventListener('load', () => {
  setTimeout(launchConfetti, 400);
});