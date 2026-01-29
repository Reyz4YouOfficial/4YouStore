document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            message.style.color = "#2ecc71"; // Hijau elegan
            message.innerText = "Selamat Datang, " + username + "!";
            // Di sini Anda bisa mengarahkan user ke halaman lain:
            // window.location.href = 'dashboard.html';
        } else {
            message.style.color = "#e74c3c"; // Merah
            message.innerText = result.message;
        }
    } catch (err) {
        message.style.color = "#e67e22";
        message.innerText = "Gagal terhubung ke server.";
    }
});
