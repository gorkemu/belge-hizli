# backend/Dockerfile
FROM node:18-slim
ENV NODE_ENV=production
WORKDIR /app
COPY backend/package*.json ./ 
# <--- backend/ öneki var
RUN npm ci --only=production --loglevel verbose
COPY backend/ .               
# <--- backend/ öneki var
EXPOSE 8080
CMD [ "node", "server.js" ]