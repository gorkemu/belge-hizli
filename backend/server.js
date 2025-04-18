// server.js (EN ÜSTE YAKIN BİR YERE EKLEYİN)

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(error.stack || error);
  process.exit(1); // Hata sonrası çıkış yap
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION! Reason:', reason);
  console.error(promise);
  // İsteğe bağlı: Uygulamayı burada da durdurabilirsiniz ama genellikle sadece loglamak yeterli olabilir.
  // process.exit(1);
});

// --- Diğer require'lar ve kodunuz buradan devam eder ---


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const templateRoutes = require('./routes/templates');
const path = require('path'); // path modülünü ekleyelim (statik dosya sunumu için gerekebilir)

// Ortam değişkenlerini yükle (dosyanın başında olması iyi pratiktir)
dotenv.config();

const app = express();

// --- CORS Ayarları (Güncellendi) ---
const allowedOrigins = [
  'http://localhost:5173', // Lokal frontend
  process.env.FRONTEND_URL // Fly.io'daki Secret'tan gelecek canlı frontend URL'si
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed.`); // <-- Hangi origin'in reddedildiğini loglayalım
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// --- CORS Ayarları Sonu ---

app.use(cors(corsOptions));
// --- CORS Ayarları Sonu ---

// JSON body parser middleware'i
app.use(express.json());

// Basit loglama middleware'i (isteğe bağlı, production'da daha gelişmiş loglama kullanılabilir)
app.use((req, res, next) => {
  // Sadece production'da değilse logla veya daha gelişmiş bir logger kullan
  if (process.env.NODE_ENV !== 'production') {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});


// MongoDB Atlas bağlantısı
const uri = process.env.ATLAS_URI;
if (!uri) {
  console.error('Hata: ATLAS_URI ortam değişkeni tanımlanmamış!');
  process.exit(1); // URI yoksa uygulamayı durdur
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }) // Not: Yeni Mongoose versiyonlarında bu opsiyonlar varsayılan ve gereksiz olabilir.
  .then(() => console.log('MongoDB Atlas bağlantısı başarılı!'))
  .catch((error) => {
      console.error('MongoDB bağlantı hatası:', error);
      process.exit(1); // Bağlantı hatasında uygulamayı durdur
  });

// API rotalarını kullan
app.use('/api', templateRoutes);

// --- Hata Yönetimi Middleware'i (Örnek) ---
// Rotalardan sonra tanımlanmalı
app.use((err, req, res, next) => {
    console.error("Beklenmeyen Hata:", err.stack || err); // Hatanın detayını logla
    // CORS hatası ise özel mesaj gönder
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ message: 'CORS policy violation' });
    }
    // Diğer hatalar için genel bir mesaj gönder
    res.status(err.status || 500).json({
        message: err.message || 'Sunucuda bir hata oluştu.',
        // Production'da hata detayını client'a gönderme
        error: process.env.NODE_ENV !== 'production' ? err : {}
    });
});
// --- Hata Yönetimi Middleware'i Sonu ---


// --- Port Ayarı (Güncellendi) ---
// server.js (app.listen'den önce)
const port = process.env.PORT || 8080;
console.log(`Attempting to listen on port: ${port} (from process.env.PORT: ${process.env.PORT})`); // <-- Ekstra log
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port: ${port}`);
});