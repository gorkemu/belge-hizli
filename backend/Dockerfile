# backend/Dockerfile

# Kullanılan Puppeteer versiyonuyla uyumlu imajı kullan
FROM ghcr.io/puppeteer/puppeteer:24.6.1

# Ortamı ayarla
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

# Çalışma dizinini oluştur
WORKDIR /app

# ÖNCE SADECE package*.json kopyala
COPY backend/package*.json ./

# Bağımlılıkları 'npm ci' ile kur (root olarak)
RUN npm ci --only=production --loglevel verbose

# SONRA GERİ KALAN TÜM backend KODUNU kopyala
COPY backend/ .

# Portu expose et
EXPOSE 8080 
# Koyeb genellikle 8080 portunu bekler, kodumuz process.env.PORT'u dinler

# Çalıştır
CMD [ "npm", "start" ]