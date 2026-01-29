<script>
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset pesan
        messageDiv.style.color = "rgba(255,255,255,0.7)";
        messageDiv.innerText = "Memvalidasi...";

        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;

        try {
            // Mengambil data dari file user.json
            const response = await fetch('user.json');
            
            if (!response.ok) {
                throw new Error("File user.json tidak ditemukan");
            }

            const users = await response.json();

            // Mencari user yang cocok
            const user = users.find(u => u.username === usernameInput && u.password === passwordInput);

            if (user) {
                // Berhasil Login
                messageDiv.style.color = "#81ecec";
                messageDiv.innerText = "Akses diterima. Selamat datang, " + user.username + "!";
                
                // Opsional: Redirect setelah 1 detik
                // setTimeout(() => { window.location.href = "dashboard.html"; }, 1500);
            } else {
                // Gagal Login
                messageDiv.style.color = "#ff7675";
                messageDiv.innerText = "Username atau password salah.";
            }
        } catch (err) {
            console.error(err);
            messageDiv.style.color = "#fab1a0";
            messageDiv.innerText = "Gagal memuat data pengguna.";
        }
    });
</script>
