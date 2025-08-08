// Utility Functions
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return '';
    return unsafe
        .replace(/&/g, \"&amp;\")
        .replace(/</g, \"&lt;\")
        .replace(/>/g, \"&gt;\")
        .replace(/\"/g, \"&quot;\")
        .replace(/'/g, \"&#039;\");
}

// Countdown Timer
function setupCountdown(targetDateString, daysId, hoursId, minutesId, secondsId) {
    const targetDate = new Date(targetDateString).getTime();
    const update = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;
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
    update();
    setInterval(update, 1000);
}

// Load wishes from static JSON
async function loadWishes() {
    const wishesListDiv = document.getElementById('wishesList');
    if (!wishesListDiv) return;
    try {
        const response = await fetch('/data/wishes.json');
        if (!response.ok) throw new Error('Failed to load wishes');
        const wishes = await response.json();
        wishesListDiv.innerHTML = wishes.length === 0 \n            ? '<p>Chưa có lời chúc nào.</p>'\n            : wishes.map(wish => `\n                <div class=\"wish-item\">\n                    <p><strong>${escapeHtml(wish.name || 'Ẩn danh')}:</strong></p>\n                    <p>${escapeHtml(wish.wish_text || '')}</p>\n                    <small>Gửi lúc: ${new Date(wish.created_at).toLocaleString('vi-VN', {\n                        day: '2-digit',\n                        month: '2-digit',\n                        year: 'numeric',\n                        hour: '2-digit',\n                        minute: '2-digit'\n                    })}</small>\n                </div>\n            `).join('');\n    } catch (error) {\n        wishesListDiv.innerHTML = '<p>Lỗi khi tải lời chúc.</p>';\n        console.error('Load Wishes Error:', error);\n    }\n}\n\n// Static form handlers (no submission)\nfunction handleRSVPSubmit(e) {\n    e.preventDefault();\n    const status = document.getElementById('rsvpStatus');\n    if (status) {\n        status.textContent = 'Website đã chuyển sang chế độ chỉ xem. Cảm ơn!';\n        status.style.color = '#8B4513';\n    }\n}\n\nfunction handleWishSubmit(e) {\n    e.preventDefault();\n    const status = document.getElementById('wishStatus');\n    if (status) {\n        status.textContent = 'Website đã chuyển sang chế độ chỉ xem. Cảm ơn!';\n        status.style.color = '#8B4513';\n    }\n}\n\n// Audio Player Control\nfunction initAudioPlayer() {\n    const audio = document.getElementById('bgMusic');\n    const musicToggle = document.getElementById('musicToggle');\n    if (!audio || !musicToggle) return;\n    let isPlaying = false;\n    musicToggle.addEventListener('click', () => {\n        if (isPlaying) {\n            audio.pause();\n            musicToggle.innerHTML = '<i class=\"fas fa-music\"></i>';\n        } else {\n            audio.play();\n            musicToggle.innerHTML = '<i class=\"fas fa-pause\"></i>';\n        }\n        isPlaying = !isPlaying;\n    });\n}\n\n// Gallery Carousel\n(function() {\n    const images = [\n        'images/t1-min.jpg', 'images/t2-min.jpg', 'images/t3-min.jpg',\n        'images/t4-min.jpg', 'images/t5-min.jpg', 'images/t6-min.jpg',\n        'images/t7-min.jpg', 'images/t8-min.jpg', 'images/t9-min.jpg'\n    ];\n    let current = 0;\n    const leftEl = document.getElementById('galleryLeft');\n    const centerEl = document.getElementById('galleryCenter');\n    const rightEl = document.getElementById('galleryRight');\n    const prevBtn = document.getElementById('galleryPrev');\n    const nextBtn = document.getElementById('galleryNext');\n    const track = document.querySelector('.gallery-track');\n    function updateImages(idx) {\n        const leftIdx = (idx - 1 + images.length) % images.length;\n        const rightIdx = (idx + 1) % images.length;\n        leftEl.src = images[leftIdx];\n        leftEl.alt = `Khoảnh khắc đẹp ${leftIdx+1}`;\n        centerEl.src = images[idx];\n        centerEl.alt = `Khoảnh khắc đẹp ${idx+1}`;\n        rightEl.src = images[rightIdx];\n        rightEl.alt = `Khoảnh khắc đẹp ${rightIdx+1}`;\n    }\n    function slideTo(idx, dir) {\n        if (!track) return;\n        track.classList.add('slide-' + dir);\n        setTimeout(() => {\n            track.classList.remove('slide-' + dir);\n            current = (idx + images.length) % images.length;\n            updateImages(current);\n        }, 450);\n    }\n    if (leftEl && centerEl && rightEl && prevBtn && nextBtn) {\n        prevBtn.addEventListener('click', () => slideTo(current - 1, 'right'));\n        nextBtn.addEventListener('click', () => slideTo(current + 1, 'left'));\n    }\n    if (track) {\n        let startX = 0;\n        let isTouch = false;\n        track.addEventListener('touchstart', (e) => {\n            if (e.touches.length === 1) {\n                startX = e.touches[0].clientX;\n                isTouch = true;\n            }\n        });\n        track.addEventListener('touchmove', (e) => {\n            if (isTouch) e.preventDefault();\n        }, { passive: false });\n        track.addEventListener('touchend', (e) => {\n            if (!isTouch) return;\n            const endX = e.changedTouches[0].clientX;\n            const dx = endX - startX;\n            if (Math.abs(dx) > 40) {\n                if (dx < 0) {\n                    slideTo(current + 1, 'left');\n                } else {\n                    slideTo(current - 1, 'right');\n                }\n            }\n            isTouch = false;\n        });\n    }\n    updateImages(current);\n})();\n\n// Initialize\ndocument.addEventListener('DOMContentLoaded', () => {\n    setupCountdown('2025-07-19T18:00:00', 'days-vuquy', 'hours-vuquy', 'minutes-vuquy', 'seconds-vuquy');\n    setupCountdown('2025-07-20T18:00:00', 'days-tanhon', 'hours-tanhon', 'minutes-tanhon', 'seconds-tanhon');\n    const rsvpForm = document.getElementById('rsvpForm');\n    const wishForm = document.getElementById('wishForm');\n    if (rsvpForm) rsvpForm.addEventListener('submit', handleRSVPSubmit);\n    if (wishForm) wishForm.addEventListener('submit', handleWishSubmit);\n    loadWishes();\n    initAudioPlayer();\n});