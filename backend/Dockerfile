# backend/Dockerfile

FROM ghcr.io/puppeteer/puppeteer:24.6.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

# Çalışma dizinini oluştur
WORKDIR /app

# ÖNCE SADECE package*.json kopyala
COPY backend/package*.json ./

# Sonra bağımlılıkları kur
RUN npm install --only=production --unsafe-perm --no-cache --loglevel verbose

# SONRA GERİ KALAN TÜM backend KODUNU kopyala
COPY backend/ .

# Portu expose et
EXPOSE 10000

# Çalıştır
CMD [ "npm", "start" ]