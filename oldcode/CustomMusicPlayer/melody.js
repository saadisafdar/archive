const musicContainer = document.querySelector('.music-container');
const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const title = document.getElementById("title");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");
const durationEl = document.getElementById("duration");
const currentTimeEl = document.getElementById("current-time");
const volumeSlider = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");

const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const repeatIcon = document.getElementById("repeat-icon");
const repeatOneIcon = document.getElementById("repeat-one-icon");

// Songs array - can be expanded
const songs = ["song1", "song2", "song3"];

// State
let songIndex = parseInt(localStorage.getItem('lastPlayedSong')) || 0;
let isShuffle = false;
let repeatMode = 0; // 0: off, 1: all, 2: one

// Initialization
function init() {
  if (songIndex >= songs.length || songIndex < 0) songIndex = 0;
  loadSong(songs[songIndex]);
  renderPlaylist();
  
  // Set volume from previous session if desired, defaulting to 1
  const savedVol = localStorage.getItem('playerVolume');
  if (savedVol !== null) {
    audio.volume = savedVol;
    volumeSlider.value = savedVol;
  }
}

// Load song details
function loadSong(song) {
  title.textContent = song;
  audio.src = `songs/${song}.mp3`;
  localStorage.setItem('lastPlayedSong', songIndex);
  updatePlaylistUI();
}

// Play & Pause
function playSong() {
  musicContainer.classList.add('play');
  playIcon.style.display = "none";
  pauseIcon.style.display = "block";
  audio.play().catch(e => console.log("Audio play failed:", e));
}

function pauseSong() {
  musicContainer.classList.remove('play');
  playIcon.style.display = "block";
  pauseIcon.style.display = "none";
  audio.pause();
}

// Next & Prev
function nextSong() {
  if (isShuffle) {
    let newIndex = songIndex;
    while (newIndex === songIndex && songs.length > 1) {
      newIndex = Math.floor(Math.random() * songs.length);
    }
    songIndex = newIndex;
  } else {
    songIndex = (songIndex + 1) % songs.length;
  }
  loadSong(songs[songIndex]);
  playSong();
}

function prevSong() {
  if (audio.currentTime > 3) {
    // If playing for more than 3s, restart current song
    audio.currentTime = 0;
  } else {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songs[songIndex]);
  }
  playSong();
}

// Playlist rendering
function renderPlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = song;
    li.addEventListener('click', () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    });
    playlistEl.appendChild(li);
  });
  updatePlaylistUI();
}

function updatePlaylistUI() {
  const items = playlistEl.querySelectorAll('li');
  items.forEach((item, index) => {
    if (index === songIndex) {
      item.classList.add('playing');
    } else {
      item.classList.remove('playing');
    }
  });
}

// Time Formatting
function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

// Event Listeners
playBtn.addEventListener("click", () => {
  const isPlaying = musicContainer.classList.contains('play');
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

audio.addEventListener("timeupdate", () => {
  const { duration, currentTime } = audio;
  if (!isNaN(duration)) {
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    durationEl.textContent = formatTime(duration);
  }
  currentTimeEl.textContent = formatTime(currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  if (repeatMode === 2) {
    audio.currentTime = 0;
    playSong();
  } else if (repeatMode === 1) {
    nextSong();
  } else {
    // If repeat is off, stop at the end of playlist or just go next if we want continuous play
    if (songIndex === songs.length - 1 && !isShuffle) {
      pauseSong();
      audio.currentTime = 0;
    } else {
      nextSong();
    }
  }
});

progressBar.addEventListener("click", (e) => {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (!isNaN(duration)) {
    audio.currentTime = (clickX / width) * duration;
  }
});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
  localStorage.setItem('playerVolume', audio.volume);
});

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn.addEventListener('click', () => {
  repeatMode = (repeatMode + 1) % 3;
  
  if (repeatMode === 0) {
    repeatBtn.classList.remove('active');
    repeatIcon.style.display = "block";
    repeatOneIcon.style.display = "none";
  } else if (repeatMode === 1) {
    repeatBtn.classList.add('active');
    repeatIcon.style.display = "block";
    repeatOneIcon.style.display = "none";
  } else {
    repeatBtn.classList.add('active');
    repeatIcon.style.display = "none";
    repeatOneIcon.style.display = "block";
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Prevent default scrolling for space and arrows when not in an input
  if(e.target.tagName !== 'INPUT') {
    if (e.code === 'Space') {
      e.preventDefault();
      const isPlaying = musicContainer.classList.contains('play');
      if (isPlaying) pauseSong();
      else playSong();
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      audio.currentTime += 5;
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      audio.currentTime -= 5;
    }
  }
});

// Start
init();
