FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma/schema.prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build


FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/prisma ./prisma/

RUN npm ci --only=production
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "npm exec prisma migrate deploy && node --enable-source-maps dist/main.js"]