# backend/Dockerfile (Alternatif Base İmaj ile)

# Standart bir Node.js imajı kullan (Debian tabanlı - bookworm)
FROM node:18-bookworm-slim
# Veya node:20-bookworm-slim gibi projenize uygun bir versiyon

# Puppeteer'ın ihtiyaç duyduğu bağımlılıkları manuel kur
# Kaynak: https://pptr.dev/troubleshooting#running-puppeteer-on-debian
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Ortamı ayarla
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production

# Çalışma dizinini oluştur
WORKDIR /app

# package.json ve package-lock.json dosyalarını kopyala
COPY backend/package*.json ./

# Bağımlılıkları kur (root olarak, cache kullanmadan)
RUN npm install --only=production --unsafe-perm --no-cache --loglevel verbose

# Uygulama kodunu kopyala
COPY backend/ .

# Portu expose et
EXPOSE 10000

CMD [ "npm", "start" ]