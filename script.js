const weddingDate = new Date('2026-06-26T15:00:00+03:00');
const responseEndpoint = 'https://script.google.com/macros/s/AKfycbyCwRMfhZ0jAq3xG5SU0KwuGfTcvnokH2j0t5iRCWiwSQAAuJUkSwIgasUALLQVf1el/exec';

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

document.getElementById('rsvpForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = document.getElementById('submitButton');
  const formData = new FormData(event.currentTarget);
  const data = Object.fromEntries(formData);
  data.alcohol = formData.getAll('alcohol');
  data.submittedAt = new Date().toISOString();

  submitButton.disabled = true;
  submitButton.textContent = 'Отправляем…';

  if (responseEndpoint) {
    try {
      await fetch(responseEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      submitButton.disabled = false;
      submitButton.textContent = 'Попробовать ещё раз';
      document.getElementById('success').textContent = 'Не удалось отправить ответ. Проверьте интернет и попробуйте ещё раз.';
      document.getElementById('success').classList.add('show');
      return;
    }
  }

  localStorage.setItem('wedding-rsvp', JSON.stringify(data));
  form.style.display = 'none';
  const success = document.getElementById('success');
  success.textContent = responseEndpoint
    ? 'Спасибо! Ваш ответ отправлен ♡'
    : 'Спасибо! Ответ сохранён. Подключение таблицы завершается ♡';
  success.classList.add('show');
});
