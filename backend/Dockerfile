# backend/Dockerfile (Son çalışan versiyon)
FROM ghcr.io/puppeteer/puppeteer:24.6.1
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    NODE_ENV=production
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production --loglevel verbose
COPY backend/ .
EXPOSE 8080
CMD [ "npm", "start" ]