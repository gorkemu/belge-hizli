# backend/Dockerfile

# Kullandığın Puppeteer versiyonuyla uyumlu imajı kullan
FROM ghcr.io/puppeteer/puppeteer:24.6.1 # Bu imajın versiyonu 24.6.1 olarak güncellenmiş, bu iyi.

# Ortamı ayarla
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer \
    NODE_ENV=production \
    NPM_CONFIG_CACHE=/home/pptruser/.cache/npm # <-- npm cache dizinini ayarla

# /home/pptruser dizinini ve cache dizinlerini oluştur ve sahipliğini değiştir
# Bu sefer /home/pptruser/app'ı burada oluşturmuyoruz
RUN mkdir -p /home/pptruser/.cache/puppeteer && \
    mkdir -p /home/pptruser/.cache/npm && \
    chown -R pptruser:pptruser /home/pptruser/.cache

# Çalışma dizinini pptruser ana dizini altında oluştur
WORKDIR /home/pptruser/app

# package.json ve package-lock.json dosyalarını kopyala
# Bu dosyalar WORKDIR'a (yani /home/pptruser/app) kopyalanacak
COPY backend/package*.json ./

# ÖNEMLİ: Bağımlılıkları pptruser olarak kur
USER pptruser
RUN npm install --only=production --loglevel verbose --cache /home/pptruser/.cache/npm # <-- Cache dizinini belirt

# Uygulama kodunu kopyala
# Kodu WORKDIR'a kopyala
COPY backend/ .

# Sahipliği kontrol etmeye gerek yok, kod zaten pptruser tarafından kopyalanmalı veya erişilebilir olmalı

# USER pptruser zaten yukarıda ayarlandı

CMD [ "npm", "start" ]