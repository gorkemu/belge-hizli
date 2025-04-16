# backend/Dockerfile

# Kullanılan Puppeteer versiyonuyla uyumlu imajı kullan
FROM ghcr.io/puppeteer/puppeteer:24.6.1

# Ortamı ayarla
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    PUPPETEER_CACHE_DIR=/root/.cache/puppeteer \
    NODE_ENV=production \
    NPM_CONFIG_CACHE=/root/.cache/npm

# Çalışma dizinini oluştur
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY backend/package*.json ./

# Bağımlılıkları kur (root olarak)
RUN npm install --only=production --unsafe-perm --loglevel verbose

# Uygulama kodunu kopyala
COPY backend/ .

# Portu expose et
EXPOSE 10000

CMD [ "npm", "start" ]