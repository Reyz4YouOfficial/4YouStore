const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const FILE_PATH = 'user.json';

// Endpoint untuk Login (Cek User)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(FILE_PATH, (err, data) => {
        if (err || data.length === 0) {
            return res.status(404).json({ message: "Database kosong atau tidak ditemukan." });
        }

        const users = JSON.parse(data);
        
        // Mencari user yang username DAN password-nya cocok
        const userFound = users.find(u => u.username === username && u.password === password);

        if (userFound) {
            res.status(200).json({ success: true, message: "Login Berhasil!" });
        } else {
            res.status(401).json({ success: false, message: "Username atau Password salah!" });
        }
    });
});

app.listen(3000, () => console.log('Server login berjalan di http://localhost:3000'));
