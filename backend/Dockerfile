

FROM node:25-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

FROM deps AS test
WORKDIR /app

RUN npm install --only=dev
COPY . .
RUN npm test


FROM node:25-alpine 
ARG BUILD_DATE
ARG VERSION
ARG NODE_ENV=production

LABEL org.opencontainers.image.created=${BUILD_DATE}
LABEL org.opencontainers.image.version=${VERSION}
LABEL org.opencontainers.image.title=backend

RUN addgroup -S backend && adduser -S backend -G backend

WORKDIR /app

COPY ./ ./
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./
RUN chown -R backend /app

ENV PORT=4000
ENV INSTANCE_ID=instance-1

USER backend
EXPOSE 4000
HEALTHCHECK --interval=5s --timeout=5s --start-period=5s --retries=3 CMD ["wget","--spider","http://127.0.0.1:4000/health"]

ENV POSTGRES_URL=postgres://postgres:postgres@instance-postgres:5432/postgres
ENV REDIS_URL=redis://instance-redis:6379

CMD ["npm", "start"]

