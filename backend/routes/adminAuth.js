// backend/routes/adminAuth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const adminUsernameEnv = process.env.ADMIN_USERNAME;
    const adminPasswordEnv = process.env.ADMIN_PASSWORD;
    const jwtSecretEnv = process.env.JWT_SECRET;
    const jwtExpiresInEnv = process.env.JWT_EXPIRES_IN || '1h';

    if (!adminUsernameEnv || !adminPasswordEnv || !jwtSecretEnv) {
        console.error('Admin login config error: ADMIN_USERNAME, ADMIN_PASSWORD, or JWT_SECRET is missing in .env');
        return res.status(500).json({ message: 'Sunucu yapılandırma hatası.' });
    }

    if (!username || !password) {
        return res.status(400).json({ message: 'Kullanıcı adı ve şifre gereklidir.' });
    }

    if (username === adminUsernameEnv && password === adminPasswordEnv) {
        const payload = { user: { id: 'admin_user_static_id', role: 'admin' } };
        jwt.sign(payload, jwtSecretEnv, { expiresIn: jwtExpiresInEnv }, (err, token) => {
            if (err) {
                console.error('Error signing JWT:', err);
                return res.status(500).json({ message: 'Token oluşturulurken bir hata oluştu.' });
            }
            res.json({ success: true, message: 'Admin girişi başarılı!', token: token });
        });
    } else {
        res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }
});

module.exports = router;