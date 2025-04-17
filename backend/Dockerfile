# backend/Dockerfile

# Puppeteer'ın kendi imajını kullan
FROM ghcr.io/puppeteer/puppeteer:24.6.1

# SADECE NODE_ENV'yi ayarlayalım
ENV NODE_ENV=production

# Çalışma dizinini oluştur
WORKDIR /app

# ÖNCE SADECE package*.json kopyala
COPY backend/package*.json ./

# Bağımlılıkları 'npm ci' ile kur (root olarak)
# SKIP_DOWNLOAD olmadan kurmayı deneyelim
RUN npm ci --only=production --loglevel verbose

# SONRA GERİ KALAN TÜM backend KODUNU kopyala
COPY backend/ .

# Portu expose et
EXPOSE 8080

# Çalıştır
CMD [ "npm", "start" ]