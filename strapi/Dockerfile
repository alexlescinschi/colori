FROM node:20-alpine AS builder
RUN apk add --no-cache python3 make g++ sqlite-dev
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
RUN apk add --no-cache sqlite-libs
WORKDIR /app
ENV NODE_ENV=production
ENV STRAPI_DISABLE_UPDATE_CHECK=true
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/config ./config
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
EXPOSE 1337
CMD ["npm", "start"]
