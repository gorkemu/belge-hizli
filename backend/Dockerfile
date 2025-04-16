# backend/Dockerfile

# Kullanılan Puppeteer versiyonuyla uyumlu imajı kullan
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

# Çalışma dizinini oluştur ve sahipliğini pptruser'a ver
WORKDIR /home/pptruser/app
RUN chown -R pptruser:pptruser /home/pptruser/app # <-- Çalışma dizininin sahipliğini ayarla

# ÖNEMLİ: Kullanıcıyı npm install'dan ÖNCE değiştir
USER pptruser

# package.json ve package-lock.json dosyalarını kopyala
# Artık pptruser olarak kopyalanacak
COPY backend/package*.json ./

# Bağımlılıkları pptruser olarak kur (önbelleği kullanarak)
RUN npm install --only=production --loglevel verbose --cache /home/pptruser/.cache/npm

# Uygulama kodunu kopyala
# Yine pptruser olarak kopyalanacak
COPY backend/ .

# USER pptruser zaten ayarlandı

CMD [ "npm", "start" ]