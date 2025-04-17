# backend/Dockerfile (Puppeteer base imajı ve npm ci ile)

# Puppeteer'ın kendi imajını kullan (içinde Chrome kurulu gelir)
FROM ghcr.io/puppeteer/puppeteer:24.6.1

# Ortamı ayarla
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    # İmajın içindeki varsayılan yol
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \ 
    NODE_ENV=production

# Çalışma dizinini oluştur
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY backend/package*.json ./

# Bağımlılıkları 'npm ci' ile kur (root olarak)
RUN npm ci --only=production --loglevel verbose

# SONRA GERİ KALAN TÜM backend KODUNU kopyala
COPY backend/ .

# Portu expose et
EXPOSE 8080 
# Koyeb'in beklediği iç port

# Çalıştır
CMD [ "npm", "start" ]