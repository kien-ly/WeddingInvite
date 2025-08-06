// Constants
const API_BASE_URL = '/api';

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
function setupCountdown(targetDateString, daysId, hoursId, minutesId, secondsId) {
    const targetDate = new Date(targetDateString).getTime();
    console.log(`Setting up countdown for: ${targetDateString}`);
    console.log(`Target Date (milliseconds): ${targetDate}`);

    const update = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        console.log(`Current time (milliseconds): ${now}`);
        console.log(`Distance: ${distance}`);

        if (distance < 0) {
            document.getElementById(daysId).textContent = '00';
            document.getElementById(hoursId).textContent = '00';
            document.getElementById(minutesId).textContent = '00';
            document.getElementById(secondsId).textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById(daysId).textContent = String(days).padStart(2, '0');
        document.getElementById(hoursId).textContent = String(hours).padStart(2, '0');
        document.getElementById(minutesId).textContent = String(minutes).padStart(2, '0');
        document.getElementById(secondsId).textContent = String(seconds).padStart(2, '0');
    };

    update(); // Initial call
    setInterval(update, 1000);
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

// Gallery Carousel Logic (3 ảnh, hiệu ứng slide mượt)
(function() {
    const images = [
        'images/t1-min.jpg',
        'images/t2-min.jpg',
        'images/t3-min.jpg',
        'images/t4-min.jpg',
        'images/t5-min.jpg',
        'images/t6-min.jpg',
        'images/t7-min.jpg',
        'images/t8-min.jpg',
        'images/t9-min.jpg'
    ];
    let current = 0;
    const leftEl = document.getElementById('galleryLeft');
    const centerEl = document.getElementById('galleryCenter');
    const rightEl = document.getElementById('galleryRight');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const track = document.querySelector('.gallery-track');
    function updateImages(idx) {
        const leftIdx = (idx - 1 + images.length) % images.length;
        const rightIdx = (idx + 1) % images.length;
        leftEl.src = images[leftIdx];
        leftEl.alt = `Khoảnh khắc đẹp ${leftIdx+1}`;
        centerEl.src = images[idx];
        centerEl.alt = `Khoảnh khắc đẹp ${idx+1}`;
        rightEl.src = images[rightIdx];
        rightEl.alt = `Khoảnh khắc đẹp ${rightIdx+1}`;
    }
    function slideTo(idx, dir) {
        if (!track) return;
        // Thêm class slide
        track.classList.add('slide-' + dir);
        setTimeout(() => {
            track.classList.remove('slide-' + dir);
            current = (idx + images.length) % images.length;
            updateImages(current);
        }, 450); // khớp với transition CSS
    }
    if (leftEl && centerEl && rightEl && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            slideTo(current - 1, 'right');
        });
        nextBtn.addEventListener('click', function() {
            slideTo(current + 1, 'left');
        });
    }
    // Swipe support for mobile
    if (track) {
        let startX = 0;
        let isTouch = false;
        track.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                startX = e.touches[0].clientX;
                isTouch = true;
            }
        });
        track.addEventListener('touchmove', function(e) {
            if (isTouch) e.preventDefault();
        }, { passive: false });
        track.addEventListener('touchend', function(e) {
            if (!isTouch) return;
            const endX = e.changedTouches[0].clientX;
            const dx = endX - startX;
            if (Math.abs(dx) > 40) {
                if (dx < 0) {
                    slideTo(current + 1, 'left'); // swipe left
                } else {
                    slideTo(current - 1, 'right'); // swipe right
                }
            }
            isTouch = false;
        });
    }
    updateImages(current);
})();

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Setup countdowns
    setupCountdown('2025-07-19T18:00:00', 'days-vuquy', 'hours-vuquy', 'minutes-vuquy', 'seconds-vuquy');
    setupCountdown('2025-07-20T18:00:00', 'days-tanhon', 'hours-tanhon', 'minutes-tanhon', 'seconds-tanhon');

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