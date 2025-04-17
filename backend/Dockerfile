# backend/Dockerfile (Eski COPY komutları ile)
FROM node:18-slim
ENV NODE_ENV=production
WORKDIR /app
COPY backend/package*.json ./ 
# <--- backend/ öneki geri eklendi
RUN npm ci --only=production --loglevel verbose
COPY backend/ .               
# <--- backend/ öneki geri eklendi
EXPOSE 8080
CMD [ "node", "server.js" ]