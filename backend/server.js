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
  process.env.FRONTEND_URL // Vercel'deki canlı frontend URL'si (environment variable'dan)
].filter(Boolean); // Eğer FRONTEND_URL tanımlı değilse, filtreleyerek undefined olmasını engelle

const corsOptions = {
  origin: function (origin, callback) {
    // Eğer istek origin'i izin verilenler listesinde varsa veya origin yoksa (örn: sunucu içi istekler, Postman gibi araçlar) izin ver
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200 // Bazı eski tarayıcılar için
};

// app.use(cors(corsOptions));// Eski ayarları yorum satırı yapın
app.use(cors()); // Herkese izin ver
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
// Render'ın sağladığı PORT'u veya lokal geliştirme için 5001'i kullan (5000 de kalabilir)
const port = process.env.PORT || 5001;
// --- Port Ayarı Sonu ---

app.listen(port, () => {
  // Log mesajını İngilizce yapmak daha standart olabilir
  console.log(`Server is running on port: ${port}`);
});