# STAGE 1: Build
FROM node:18-alpine AS build

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./tsconfig.json /app/tsconfig.json
COPY ./tsconfig.build.json /app/tsconfig.build.json
COPY ./src/ /app/src/ 

WORKDIR /app

RUN npm install
RUN npx puppeteer browsers install chrome
RUN npm run build

# STAGE 2: Runtime
FROM node:18-alpine AS runtime

RUN apk add --no-cache tzdata
ENV TZ 'America/Sao_Paulo'

# Instalar dependências do Puppeteer
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules

WORKDIR /app
EXPOSE 80
CMD ["npm", "run", "start:prod"]
