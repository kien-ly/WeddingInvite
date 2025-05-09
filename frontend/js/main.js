// Constants
const API_BASE_URL = '/api';
const WEDDING_DATE = '2025-07-20T18:00:00';

// Utility Functions
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const distance = new Date(WEDDING_DATE).getTime() - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
            document.getElementById(id).textContent = '00';
        });
        const heroIntro = document.querySelector('.hero-intro');
        if (heroIntro) heroIntro.textContent = 'Chúc Mừng Hạnh Phúc!';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Wishes Management
async function loadWishes() {
    const wishesListDiv = document.getElementById('wishesList');
    if (!wishesListDiv) return;

    try {
        const response = await fetch(`${API_BASE_URL}/wishes/?limit=20`);
        if (!response.ok) throw new Error('Failed to load wishes');

        const wishes = await response.json();
        wishesListDiv.innerHTML = wishes.length === 0 
            ? '<p>Chưa có lời chúc nào.</p>'
            : wishes.map(wish => `
                <div class="wish-item">
                    <p><strong>${escapeHtml(wish.name || 'Ẩn danh')}:</strong></p>
                    <p>${escapeHtml(wish.wish_text || '')}</p>
                    <small>Gửi lúc: ${new Date(wish.created_at).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</small>
                </div>
            `).join('');
    } catch (error) {
        wishesListDiv.innerHTML = '<p>Lỗi kết nối khi tải lời chúc.</p>';
        console.error('Load Wishes Error:', error);
    }
}

// Form Handlers
async function handleRSVPSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const status = document.getElementById('rsvpStatus');
    if (!status) return;

    status.textContent = 'Đang gửi...';
    status.style.color = '#8B4513';

    try {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            attending: formData.get('attending') === 'true',
            guests_count: parseInt(formData.get('guests_count'), 10) || 0,
            message: formData.get('message')
        };

        const response = await fetch(`${API_BASE_URL}/confirmations/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            status.textContent = 'Cảm ơn bạn đã xác nhận!';
            status.style.color = 'green';
            form.reset();
        } else {
            const errorData = await response.json().catch(() => ({ detail: response.statusText }));
            throw new Error(errorData.detail || response.statusText);
        }
    } catch (error) {
        status.textContent = `Lỗi: ${error.message}`;
        status.style.color = 'red';
        console.error('RSVP Error:', error);
    }
}

async function handleWishSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const status = document.getElementById('wishStatus');
    if (!status) return;

    status.textContent = 'Đang gửi...';
    status.style.color = '#8B4513';

    try {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            wish_text: formData.get('wish_text')
        };

        const response = await fetch(`${API_BASE_URL}/wishes/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            status.textContent = 'Cảm ơn lời chúc của bạn!';
            status.style.color = 'green';
            form.reset();
            await loadWishes();
        } else {
            const errorData = await response.json().catch(() => ({ detail: response.statusText }));
            throw new Error(errorData.detail || response.statusText);
        }
    } catch (error) {
        status.textContent = `Lỗi: ${error.message}`;
        status.style.color = 'red';
        console.error('Wish Error:', error);
    }
}

// Audio Player Control
function initAudioPlayer() {
    const audio = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    if (!audio || !musicToggle) return;

    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            audio.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start countdown
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Initialize forms
    const rsvpForm = document.getElementById('rsvpForm');
    const wishForm = document.getElementById('wishForm');
    if (rsvpForm) rsvpForm.addEventListener('submit', handleRSVPSubmit);
    if (wishForm) wishForm.addEventListener('submit', handleWishSubmit);

    // Load initial wishes
    loadWishes();

    // Initialize audio player
    initAudioPlayer();
}); 