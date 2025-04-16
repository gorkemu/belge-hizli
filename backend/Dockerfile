# backend/Dockerfile

# Kullandığın Puppeteer versiyonuyla uyumlu imajı kullan
FROM ghcr.io/puppeteer/puppeteer:24.6.1

# Ortamı ayarla
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer \
    NODE_ENV=production \
    NPM_CONFIG_CACHE=/home/pptruser/.cache/npm

# /home/pptruser dizinini ve cache dizinlerini oluştur ve sahipliğini değiştir
RUN mkdir -p /home/pptruser/.cache/puppeteer && \
    mkdir -p /home/pptruser/.cache/npm && \
    chown -R pptruser:pptruser /home/pptruser/.cache

# Çalışma dizinini pptruser ana dizini altında oluştur
WORKDIR /home/pptruser/app

# package.json ve package-lock.json dosyalarını kopyala
COPY backend/package*.json ./

# ÖNEMLİ: Bağımlılıkları pptruser olarak kur
USER pptruser
# npm cache dizinini ayarla (ENV'de zaten yapıldı ama burada da belirtmek garanti olabilir)
RUN npm install --only=production --loglevel verbose --cache /home/pptruser/.cache/npm

# Uygulama kodunu kopyala
COPY backend/ .

# USER pptruser zaten yukarıda ayarlandı

CMD [ "npm", "start" ]