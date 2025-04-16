# backend/Dockerfile

# Kullanılan Puppeteer versiyonuyla uyumlu imajı kullan
FROM ghcr.io/puppeteer/puppeteer:24.6.1

# Ortamı ayarla (Cache dizinlerini tanımlamıyoruz)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

# Çalışma dizinini oluştur
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY backend/package*.json ./

# Bağımlılıkları kur (root olarak, cache kullanmadan)
# --no-cache bayrağı npm'in disk cache'ini kullanmasını engeller
# --prefer-offline yerine --no-package-lock kullanmak da denenebilir ama önce --no-cache
RUN npm install --only=production --unsafe-perm --no-cache --loglevel verbose

# Uygulama kodunu kopyala
COPY backend/ .

# Portu expose et
EXPOSE 10000

CMD [ "npm", "start" ]