FROM node:20-alpine AS builder

WORKDIR /app

# Build widget bundle and place into sample-app/public
COPY package.json package-lock.json rollup.config.js tsconfig.json ./
COPY src ./src
COPY samples ./samples

RUN npm ci
RUN npm run build && cp dist/imagekit-media-library-widget.min.js samples/sample-app/public/


FROM node:20-alpine AS runner

WORKDIR /app

COPY samples/sample-app/package.json samples/sample-app/package-lock.json ./samples/sample-app/
RUN cd samples/sample-app && npm ci --omit=dev

COPY --from=builder /app/samples/sample-app ./samples/sample-app

ENV SERVER_PORT=3000
EXPOSE 3000

CMD ["node", "samples/sample-app/server.js"]
