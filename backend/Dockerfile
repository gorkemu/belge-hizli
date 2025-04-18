# backend/Dockerfile (SADELEŞTİRİLMİŞ - Puppeteer YOK)
FROM node:18-slim
ENV NODE_ENV=production
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production --loglevel verbose
COPY backend/ .
EXPOSE 8080
CMD [ "node", "server.js" ]
# Dockerfile sonu
CMD [ "sh", "-c", "sleep 2 && npm start" ] 
# Başlamadan önce 2 saniye bekle