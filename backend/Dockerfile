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

# package.json ve package-lock.json dosyalarını kopyala
COPY backend/package*.json ./

# Çalışma dizininin sahipliğini pptruser'a ver (tekrar, kopyalamadan sonra emin olmak için)
# ve npm cache'ini temizle
RUN chown -R pptruser:pptruser /home/pptruser/app && \
    npm cache clean --force

# Bağımlılıkları kur (pptruser olarak)
USER pptruser
RUN npm install --only=production --loglevel verbose # <-- verbose loglama ekledik

# Uygulama kodunu kopyala
# Bağımlılıklar kurulduktan SONRA kodu kopyalamak build cache'ini daha iyi kullanır
COPY backend/ .

# USER pptruser satırı zaten yukarıda, tekrar gerekmez.

CMD [ "npm", "start" ]