const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const templateRoutes = require('./routes/templates');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB Atlas bağlantısı
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas bağlantısı başarılı!'))
  .catch((error) => console.error('MongoDB bağlantı hatası:', error));

// API rotalarını kullan
app.use('/api', templateRoutes);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})

app.listen(port, () => {
  console.log(`Sunucu ${port} numaralı portta çalışıyor.`);
});