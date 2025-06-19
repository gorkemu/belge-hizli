process.on('uncaughtException', (error) => {
	console.error('UNCAUGHT EXCEPTION! Shutting down...');
	console.error(error.stack || error);
	process.exit(1); // Hata sonrası çıkış yap
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('UNHANDLED REJECTION! Reason:', reason);
	console.error(promise);
	// process.exit(1); // Opsiyonel
});
// --- Diğer require'lar ve kodunuz buradan devam eder ---

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const templateRoutes = require('./routes/templates'); // Rotayı bağlantı sonrası yükleyeceğiz
// const paymentRoutes = require('./routes/payment'); // <-- YENİ: Bunu da bağlantı sonrası yükleyeceğiz
const documentRoutes = require('./routes/document');
const path = require('path');
const adminAuthRoutes = require('./routes/adminAuth');
const adminDataRoutes = require('./routes/adminData');
const AdminUser = require('./models/adminUser'); 
const bcrypt = require('bcryptjs');  

dotenv.config();
const app = express();

// --- CORS Ayarları ---
const allowedOrigins = [
	'http://localhost:5173',
	'https://www.belgehizli.com',
	'https://belgehizli.com',
	process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
	origin: function (origin, callback) {
		if (!origin || allowedOrigins.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			console.error(`CORS Error: Origin ${origin} not allowed.`);
			callback(new Error('Not allowed by CORS'));
		}
	},
	optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// --- CORS Ayarları Sonu ---

app.use(express.json());

app.use((req, res, next) => {
	if (process.env.NODE_ENV !== 'production') {
		console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
	}
	next();
});

const uri = process.env.ATLAS_URI;
if (!uri) {
	console.error('Hata: ATLAS_URI ortam değişkeni tanımlanmamış!');
	process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(async () => { 
        console.log('MongoDB Atlas bağlantısı başarılı!');

        // --- İlk Admin Kullanıcısını Kontrol Et/Oluştur ---
        try {
            const adminCount = await AdminUser.countDocuments();
            if (adminCount === 0) {
                const adminUsernameEnv = process.env.ADMIN_USERNAME;
                const adminPasswordEnv = process.env.ADMIN_PASSWORD; // Bu ham şifre olacak

                if (adminUsernameEnv && adminPasswordEnv) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(adminPasswordEnv, salt);
                    
                    await AdminUser.create({
                        username: adminUsernameEnv.toLowerCase(),
                        passwordHash: hashedPassword
                    });
                    console.log('Varsayılan admin kullanıcısı başarıyla oluşturuldu.');
                } else {
                    console.warn('Varsayılan admin kullanıcısı oluşturulamadı: ADMIN_USERNAME veya ADMIN_PASSWORD .env dosyasında eksik.');
                }
            }
        } catch (error) {
            console.error('İlk admin kullanıcısı kontrol edilirken/oluşturulurken hata:', error);
        }
		// --- İlk Admin Kullanıcısını Kontrol Et/Oluştur Sonu ---

        // Rotaları Yükle
        const templateRoutes = require('./routes/templates');
        const paymentRoutes = require('./routes/payment');
        const documentRoutes = require('./routes/document');
        const adminAuthRoutes = require('./routes/adminAuth');
        const adminDataRoutes = require('./routes/adminData');

        app.use('/api', templateRoutes);
        app.use('/api/payment', paymentRoutes);
        app.use('/api/document', documentRoutes);
        app.use('/api/admin', adminAuthRoutes); // Bu /login ve /change-password'u içerecek
        app.use('/api/admin-data', adminDataRoutes);
		
		// --- Rotalar Sonu ---

		// --- Port Ayarı (Bağlantı Başarılı Olduktan Sonra Sunucuyu Başlat) ---
		const port = process.env.PORT || 8080;
		// console.log(`Attempting to listen on port: ${port} (from process.env.PORT: ${process.env.PORT})`);
		app.listen(port, '0.0.0.0', () => { // '0.0.0.0' Fly.io için önemli
			console.log(`Server is running on port: ${port}`);
		});
		// --- Port Ayarı Sonu ---

	})
	.catch((error) => {
		console.error('MongoDB bağlantı hatası:', error);
		process.exit(1);
	});

// --- Hata Yönetimi Middleware'i ---
app.use((err, req, res, next) => {
	console.error("Beklenmeyen Hata:", err.stack || err);
	if (err.message === 'Not allowed by CORS') {
		return res.status(403).json({ message: 'CORS policy violation' });
	}
	res.status(err.status || 500).json({
		message: err.message || 'Sunucuda bir hata oluştu.',
		error: process.env.NODE_ENV !== 'production' ? { message: err.message, stack: err.stack } : {} // Geliştirmede stack trace
	});
});
// --- Hata Yönetimi Middleware'i Sonu ---