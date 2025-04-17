# backend/Dockerfile (SADELEŞTİRİLMİŞ - Puppeteer YOK)

# Standart Node.js imajı (LTS - Long Term Support versiyonu genellikle iyidir)
FROM node:18-slim
# Veya projenizin uyumlu olduğu başka bir Node versiyonu (node:20-slim vb.)

ENV NODE_ENV=production

WORKDIR /app

COPY backend/package*.json ./

# Sadece production bağımlılıklarını kur
# Artık puppeteer olmadığı için daha hızlı olmalı
RUN npm ci --only=production --loglevel verbose

COPY backend/ .

EXPOSE 8080

CMD [ "node", "server.js" ] 
# Direkt node ile başlatmak da mümkün
# VEYA CMD [ "npm", "start" ] # package.json'daki start script'ini kullanır