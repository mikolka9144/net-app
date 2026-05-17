# Build React app

FROM node:alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Serve with NGINX
FROM nginx:1.29.7-alpine

ARG BUILD_DATE
ARG VERSION
ARG NODE_ENV=production

LABEL org.opencontainers.image.created=${BUILD_DATE}
LABEL org.opencontainers.image.version=${VERSION}
LABEL org.opencontainers.image.title="frontend"


COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=build /app/dist /usr/share/nginx/html
RUN mkdir /home/cache
RUN chown -R nginx:nginx /var/cache/nginx/ /usr/share/nginx/ /var/log/nginx /home/cache
RUN chmod 777 /run

EXPOSE 80
HEALTHCHECK --interval=10s --timeout=10s --start-period=8s --retries=3 CMD ["curl","127.0.0.1"]

USER nginx
CMD ["nginx", "-g", "daemon off;"]
