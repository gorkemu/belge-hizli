# backend/Dockerfile

# Puppeteer için gerekli bağımlılıkları içeren Node imajını kullan
# Farklı Node versiyonları için imajları Docker Hub'da arayabilirsiniz (örn: node:18-slim, node:20-bookworm-slim)
# Bu imaj puppeteer bağımlılıklarının çoğunu içerir.
FROM ghcr.io/puppeteer/puppeteer:24.6.1

# Ortamı ayarla (WORKDIR, imaj içinde komutların çalışacağı varsayılan dizindir)
# PUPPETEER_EXECUTABLE_PATH, imajdaki Chrome yolunu gösterir
# PUPPETEER_CACHE_DIR, cache dizinini ayarlar
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer \
    NODE_ENV=production

# /home/pptruser dizinini oluştur ve sahipliğini değiştir (imajdaki varsayılan kullanıcı)
# Bu dizin, cache ve uygulama dosyaları için kullanılacak
RUN mkdir -p /home/pptruser/.cache && chown -R pptruser:pptruser /home/pptruser

# Çalışma dizinini ayarla
WORKDIR /home/pptruser/app

# package.json ve package-lock.json (veya yarn.lock) dosyalarını kopyala
# Sadece backend'in bağımlılıklarını kuracağız
COPY backend/package*.json ./

# Bağımlılıkları kur
# Sadece production bağımlılıklarını kurmak için --only=production
RUN npm install --only=production

# Tüm backend kodunu kopyala
COPY backend/ .

# Uygulama pptruser olarak çalışacak
USER pptruser

# Uygulamayı başlatma komutu (package.json'daki start script'ini kullanır)
CMD [ "npm", "start" ]

# Not: Render'ın atadığı portu dinlemek için kodunuzun process.env.PORT'u kullanması gerekir (bunu zaten yapmıştık).