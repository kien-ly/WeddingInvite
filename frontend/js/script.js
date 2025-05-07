const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Đảm bảo đây là địa chỉ API backend của bạn

// --- COUNTDOWN TIMER ---
function startCountdown(targetDateString) {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    const targetDate = new Date(targetDateString).getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById('days').innerText = "00";
            document.getElementById('hours').innerText = "00";
            document.getElementById('minutes').innerText = "00";
            document.getElementById('seconds').innerText = "00";
            // Có thể hiển thị thông báo "Đã đến ngày!"
            // clearInterval(interval); // Dừng nếu không muốn nó chạy ngầm mãi
            if(document.querySelector('.hero-intro')) {
                document.querySelector('.hero-intro').textContent = "Chúc Mừng Hạnh Phúc!";
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    };

    updateTimer(); // Gọi lần đầu để không có độ trễ
    const interval = setInterval(updateTimer, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    // THAY THẾ BẰNG NGÀY CƯỚI CỦA BẠN (YYYY-MM-DD HH:MM:SS)
    const weddingDateTime = "2025-07-20T18:00:00"; // Ví dụ: "2024-12-25T18:00:00"
    startCountdown(weddingDateTime);


    const rsvpForm = document.getElementById('rsvpForm');
    const wishForm = document.getElementById('wishForm');
    const rsvpStatus = document.getElementById('rsvpStatus');
    const wishStatus = document.getElementById('wishStatus');
    const wishesListDiv = document.getElementById('wishesList');

    loadWishes();

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            rsvpStatus.textContent = 'Đang gửi...';
            rsvpStatus.style.color = '#8B4513';
            const formData = new FormData(rsvpForm);
            const data = {
                name: formData.get('name'),
                attending: formData.get('attending') === 'true',
                guests_count: parseInt(formData.get('guests_count'), 10),
                message: formData.get('message')
            };

            try {
                const response = await fetch(`${API_BASE_URL}/confirmations/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    rsvpStatus.textContent = 'Cảm ơn bạn đã xác nhận!';
                    rsvpStatus.style.color = 'green';
                    rsvpForm.reset();
                } else {
                    const errorData = await response.json();
                    rsvpStatus.textContent = `Lỗi: ${errorData.detail || response.statusText}`;
                    rsvpStatus.style.color = 'red';
                }
            } catch (error) {
                rsvpStatus.textContent = 'Lỗi kết nối đến server.';
                rsvpStatus.style.color = 'red';
                console.error('RSVP Error:', error);
            }
        });
    }

    if (wishForm) {
        wishForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            wishStatus.textContent = 'Đang gửi...';
            wishStatus.style.color = '#8B4513';
            const formData = new FormData(wishForm);
            const data = {
                name: formData.get('name'),
                wish_text: formData.get('wish_text'),
            };

            try {
                const response = await fetch(`${API_BASE_URL}/wishes/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                if (response.ok) {
                    wishStatus.textContent = 'Cảm ơn lời chúc của bạn!';
                    wishStatus.style.color = 'green';
                    wishForm.reset();
                    loadWishes();
                } else {
                    const errorData = await response.json();
                    wishStatus.textContent = `Lỗi: ${errorData.detail || response.statusText}`;
                    wishStatus.style.color = 'red';
                }
            } catch (error) {
                wishStatus.textContent = 'Lỗi kết nối đến server.';
                wishStatus.style.color = 'red';
                console.error('Wish Error:', error);
            }
        });
    }

    async function loadWishes() {
        if (!wishesListDiv) return;
        try {
            const response = await fetch(`${API_BASE_URL}/wishes/?limit=20`); // Giới hạn số lời chúc hiển thị ban đầu
            if (response.ok) {
                const wishes = await response.json();
                wishesListDiv.innerHTML = '';
                if (wishes.length === 0) {
                    wishesListDiv.innerHTML = '<p>Chưa có lời chúc nào.</p>';
                    return;
                }
                wishes.forEach(wish => {
                    const wishElement = document.createElement('div');
                    wishElement.classList.add('wish-item');
                    wishElement.innerHTML = `
                        <p><strong>${escapeHtml(wish.name)}:</strong></p>
                        <p>${escapeHtml(wish.wish_text)}</p>
                        <small>Gửi lúc: ${new Date(wish.created_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'})}</small>
                    `;
                    wishesListDiv.appendChild(wishElement);
                });
            } else {
                wishesListDiv.innerHTML = '<p>Không thể tải lời chúc.</p>';
            }
        } catch (error) {
            wishesListDiv.innerHTML = '<p>Lỗi kết nối khi tải lời chúc.</p>';
            console.error('Load Wishes Error:', error);
        }
    }

    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&")
             .replace(/</g, "<")
             .replace(/>/g, ">")
             .replace(/"/g, """)
             .replace(/'/g, "'");
    }
});