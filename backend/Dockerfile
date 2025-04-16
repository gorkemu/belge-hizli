# backend/Dockerfile

# Kullanılan Puppeteer versiyonuyla uyumlu imajı kullan
FROM ghcr.io/puppeteer/puppeteer:24.6.1

# Ortamı ayarla
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

# Çalışma dizinini oluştur
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY backend/package*.json ./

# --- YENİ: Kopyalanan dosyaların izinlerini değiştir ---
# root kullanıcısının bu dosyalara yazabildiğinden emin olalım
RUN chmod 666 package-lock.json || true # Hata verirse devam et (dosya yoksa diye)
RUN chmod 666 package.json || true    # Hata verirse devam et

# Bağımlılıkları kur (root olarak, cache kullanmadan)
RUN npm install --only=production --unsafe-perm --no-cache --loglevel verbose

# Uygulama kodunu kopyala
COPY backend/ .

# Portu expose et
EXPOSE 10000

CMD [ "npm", "start" ]