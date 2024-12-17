const songs = [
    {
        title: "Ishq Tera",
        artist: "Guru Randhawa",
        src: "./songs/ishq_tera.mp3",
        cover: "./assets/card1img.jpeg"
    },
    {
        title: "Aalas Ka Ped",
        artist: "Prateek Kuhad",
        src: "./songs/Aalas_Ka_ped.mp3",
        cover: "./assets/card2img.jpeg"
    },
    {
        title: "Meri Banogi Kya",
        artist: "Pawandeep Rajan",
        src: "./songs/Meri_banogi_kya.mp3",
        cover: "./assets/card3img.jpeg"
    },
    {
        title: "Dil Mera Tod Diya",
        artist: "Guru Randhawa",
        src: "./songs/DIl-mera-tod-diya.mp3",
        cover: "./assets/card4img.jpeg"
    },
    {
        title: "Bahu Kale Ki",
        artist: "Ajay Hooda",
        src: "./songs/bahu_kale_ki.mp3",
        cover: "./assets/card5img.jpeg"
    },
    {
        title: "Chaand Baliya",
        artist: "Aditya A",
        src: "./songs/chnaad_baliya.mp3",
        cover: "./assets/card6img.jpeg"
    },
    {
        title: "Hamrah",
        artist: "Akhil Sachdeva",
        src: "./songs/hamrah.mp3",
        cover: "./assets/card1img.jpeg"
    },
    {
        title: "Illahi",
        artist: "Arijit Singh",
        src: "./songs/illahi.mp3",
        cover: "./assets/card2img.jpeg"
    },
    {
        title: "Khawab",
        artist: "Siddharth Bhavsar",
        src: "./songs/khawab.mp3",
        cover: "./assets/card3img.jpeg"
    },
    {
        title: "Saibo",
        artist: "Shreya Ghoshal",
        src: "./songs/saibo.mp3",
        cover: "./assets/card4img.jpeg"
    }
];

let currentSongIndex = 0;
const audio = new Audio();
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Initialize audio player
function initPlayer() {
    loadSong(currentSongIndex);
    updatePlayerUI();
    
    // Add event listeners for progress and volume bars
    const progressContainer = document.querySelector('.progress-container');
    const volumeContainer = document.querySelector('.volume-container');
    
    // Progress bar click and drag
    progressContainer.addEventListener('mousedown', function(e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
        updateProgress();

        // Add mousemove event listener
        const handleMouseMove = function(e) {
            const rect = progressContainer.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            if (percent >= 0 && percent <= 1) {
                audio.currentTime = percent * audio.duration;
                updateProgress();
            }
        };

        // Add mouseup event listener
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', handleMouseMove);
        }, { once: true });
    });

    // Volume control click and drag
    volumeContainer.addEventListener('mousedown', function(e) {
        const updateVolume = function(e) {
            const rect = volumeContainer.getBoundingClientRect();
            let percent = (e.clientX - rect.left) / rect.width;
            percent = Math.max(0, Math.min(1, percent));
            audio.volume = percent;
            updateVolumeUI();
        };

        updateVolume(e);

        // Add mousemove event listener
        const handleMouseMove = function(e) {
            updateVolume(e);
        };

        // Add mouseup event listener
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', handleMouseMove);
        }, { once: true });
    });

    // Add keyboard controls
    document.addEventListener('keydown', handleKeyboardControls);
}

// Toggle shuffle mode
function toggleShuffle() {
    isShuffle = !isShuffle;
    document.getElementById('shuffle-btn').classList.toggle('active');
}

// Toggle repeat mode
function toggleRepeat() {
    isRepeat = !isRepeat;
    document.getElementById('repeat-btn').classList.toggle('active');
}

// Play/Pause
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        document.getElementById('play-btn').classList.replace('fa-pause-circle', 'fa-play-circle');
    } else {
        audio.play();
        isPlaying = true;
        document.getElementById('play-btn').classList.replace('fa-play-circle', 'fa-pause-circle');
    }
}

// Next song
function nextSong() {
    if (isShuffle) {
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * songs.length);
        } while (nextIndex === currentSongIndex && songs.length > 1);
        currentSongIndex = nextIndex;
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(currentSongIndex);
    if (isPlaying) audio.play();
}

// Previous song
function prevSong() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        if (isPlaying) audio.play();
    }
}

// Load song
function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    document.querySelector('.alb-image').src = song.cover;
    document.querySelector('#song-title').textContent = song.title;
    document.querySelector('#song-artist').textContent = song.artist;
    
    // Set initial volume
    if (typeof audio.volume === 'undefined') {
        audio.volume = 1.0;
    }
    updateVolumeUI();
}

// Update progress bar
function updateProgress() {
    if (!audio.duration) return;
    
    const progress = document.querySelector('.progress');
    const handle = document.querySelector('.progress-handle');
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    
    progress.style.width = progressPercent + '%';
    handle.style.left = progressPercent + '%';
    
    document.querySelector('.curr-time').textContent = formatTime(audio.currentTime);
    document.querySelector('.tot-time').textContent = formatTime(audio.duration);
}

// Update volume UI
function updateVolumeUI() {
    const volumeProgress = document.querySelector('.volume-progress');
    const volumeHandle = document.querySelector('.volume-handle');
    const volumeIcon = document.getElementById('volume-icon');
    const volumePercent = audio.volume * 100;
    
    volumeProgress.style.width = volumePercent + '%';
    volumeHandle.style.left = volumePercent + '%';
    
    // Update volume icon based on level
    if (audio.volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (audio.volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Format time in MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Handle keyboard controls
function handleKeyboardControls(e) {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowRight':
            nextSong();
            break;
        case 'ArrowLeft':
            prevSong();
            break;
        case 'KeyR':
            toggleRepeat();
            break;
        case 'KeyS':
            toggleShuffle();
            break;
    }
}

// Event listeners
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextSong();
    }
});

// Initialize player when page loads
window.addEventListener('load', initPlayer);

// Play specific song from the list
function playSong(index) {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    audio.play();
    isPlaying = true;
    document.getElementById('play-btn').classList.replace('fa-play-circle', 'fa-pause-circle');
}
