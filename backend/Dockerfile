# backend/Dockerfile

# Kullanılan Puppeteer versiyonuyla uyumlu imajı kullan
FROM ghcr.io/puppeteer/puppeteer:24.6.1

# Ortamı ayarla (Cache dizinlerini root'un erişebileceği bir yere koyalım)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    PUPPETEER_CACHE_DIR=/root/.cache/puppeteer \ # <-- root'un cache dizini
    NODE_ENV=production \
    NPM_CONFIG_CACHE=/root/.cache/npm # <-- root'un cache dizini

# Çalışma dizinini oluştur
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY backend/package*.json ./

# Bağımlılıkları kur (root olarak)
# --unsafe-perm bayrağı bazı izin sorunlarını çözebilir
RUN npm install --only=production --unsafe-perm --loglevel verbose

# Uygulama kodunu kopyala
COPY backend/ .

# USER pptruser SATIRINI TAMAMEN KALDIRDIK

# Portu expose et (Render bunu otomatik yapar ama belirtmek iyi olabilir)
EXPOSE 10000 # Render genellikle 10000 portunu kullanır, kodumuz process.env.PORT'u dinler

CMD [ "npm", "start" ]