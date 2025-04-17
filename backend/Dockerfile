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
# Artık 'backend/' öneki yok, çünkü build context'i zaten backend klasörü
COPY package*.json ./

# Bağımlılıkları 'npm ci' ile kur (root olarak)
RUN npm ci --only=production --loglevel verbose

# SONRA GERİ KALAN TÜM KODU kopyala (mevcut dizinden)
# Artık 'backend/' öneki yok
COPY . .

# Portu expose et
EXPOSE 8080

# Çalıştır
CMD [ "npm", "start" ]