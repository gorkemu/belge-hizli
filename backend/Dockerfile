# backend/Dockerfile (SADELEŞTİRİLMİŞ - Puppeteer YOK)
FROM node:18-slim
ENV NODE_ENV=production
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production --loglevel verbose
COPY backend/ .
EXPOSE 8080
# Dockerfile sonu
# CMD [ "node", "server.js" ] # Bunu silin veya yorum yapın
CMD [ "sh", "-c", "sleep 2 && npm start" ] 
# Bu kalsın (npm start "node server.js" çalıştırır)