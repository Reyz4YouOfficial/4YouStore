const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); // Agar frontend bisa akses backend

// KONFIGURASI
const API_TOKEN = "ISI_TOKEN_DIGITALOCEAN_DISINI"; 
const PORT = 3000;

// Fungsi Generate Password
function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pass = '';
    for (let i = 0; i < 12; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    return pass;
}

app.post('/api/create-vps', async (req, res) => {
    const { hostname, size } = req.body;
    const password = generatePassword();

    try {
        // 1. Request ke DigitalOcean
        const response = await fetch('https://api.digitalocean.com/v2/droplets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            },
            body: JSON.stringify({
                name: hostname.toLowerCase().replace(/\s/g, '-'),
                region: "sgp1",
                size: size,
                image: 'ubuntu-24-04-x64',
                ipv6: true,
                user_data: `#cloud-config\npassword: ${password}\nchpasswd: { expire: False }\nssh_pwauth: True`
            })
        });

        const data = await response.json();
        if (!response.ok) return res.status(400).json({ message: data.message });

        const dropletId = data.droplet.id;

        // 2. Tunggu IP Ready (Polling sederhana)
        // Kita beri respon awal ke frontend bahwa proses dimulai
        res.json({
            status: "processing",
            id: dropletId,
            password: password,
            message: "Droplet sedang dibuat, IP akan muncul dalam 60 detik."
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint untuk cek status IP setelah 1 menit
app.get('/api/check-vps/:id', async (req, res) => {
    try {
        const response = await fetch(`https://api.digitalocean.com/v2/droplets/${req.params.id}`, {
            headers: { 'Authorization': `Bearer ${API_TOKEN}` }
        });
        const data = await response.json();
        const ip = data.droplet.networks.v4[0]?.ip_address || "Pending...";
        res.json({ ip });
    } catch (err) {
        res.status(500).json({ message: "Gagal mengambil data IP" });
    }
});

app.listen(PORT, () => console.log(`Backend jalan di http://localhost:${PORT}`));
