const weddingDate = new Date('2026-06-26T15:00:00+03:00');

function updateCountdown() {
  const distance = Math.max(0, weddingDate - new Date());
  const values = {
    days: Math.floor(distance / 86400000),
    hours: Math.floor((distance / 3600000) % 24),
    minutes: Math.floor((distance / 60000) % 60),
    seconds: Math.floor((distance / 1000) % 60)
  };

  Object.entries(values).forEach(([id, value]) => {
    document.getElementById(id).textContent = String(value).padStart(2, '0');
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

const music = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = musicToggle.querySelector('.music-label');
const musicStartTime = 16;
music.volume = 0.18;

music.addEventListener('loadedmetadata', () => {
  music.currentTime = musicStartTime;
});

music.addEventListener('ended', () => {
  music.currentTime = musicStartTime;
  music.play();
});

async function startBackgroundMusic() {
  if (!music.paused) return;
  if (music.currentTime < musicStartTime) music.currentTime = musicStartTime;
  try {
    await music.play();
    musicToggle.classList.add('is-playing');
    musicToggle.setAttribute('aria-pressed', 'true');
    musicToggle.setAttribute('aria-label', 'Выключить музыку');
    musicLabel.textContent = 'Выключить музыку';
  } catch (error) {
    // Если браузер блокирует автозапуск, музыка включится после первого касания.
  }
}

window.addEventListener('load', startBackgroundMusic, { once: true });
music.addEventListener('canplay', startBackgroundMusic, { once: true });
document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('#musicToggle')) startBackgroundMusic();
}, { once: true });

musicToggle.addEventListener('click', async () => {
  if (music.paused) {
    if (music.currentTime < musicStartTime) music.currentTime = musicStartTime;
    try {
      await music.play();
      musicToggle.classList.add('is-playing');
      musicToggle.setAttribute('aria-pressed', 'true');
      musicToggle.setAttribute('aria-label', 'Выключить музыку');
      musicLabel.textContent = 'Выключить музыку';
    } catch (error) {
      musicLabel.textContent = 'Нажмите ещё раз';
    }
  } else {
    music.pause();
    musicToggle.classList.remove('is-playing');
    musicToggle.setAttribute('aria-pressed', 'false');
    musicToggle.setAttribute('aria-label', 'Включить музыку');
    musicLabel.textContent = 'Включить музыку';
  }
});

document.getElementById('rsvpForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const data = Object.fromEntries(formData);
  data.alcohol = formData.getAll('alcohol');
  localStorage.setItem('wedding-rsvp', JSON.stringify(data));
  event.currentTarget.style.display = 'none';
  document.getElementById('success').classList.add('show');
});
