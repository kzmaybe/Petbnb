FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY backend ./backend

ENV NODE_ENV=production

EXPOSE 5001

CMD ["node", "backend/index.js"]
