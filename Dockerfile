# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/index.html ./
COPY frontend/tsconfig.json ./
COPY frontend/vite.config.ts ./
COPY frontend/public/ ./public/
COPY frontend/src/ ./src/
RUN npm run build

# Go build stage (Debian-based for CGO/SQLite)
FROM golang:1.24 AS backend-builder
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ .
RUN apt-get update && apt-get install -y gcc
ENV CGO_ENABLED=1
RUN go build -o football-mondays

# Final stage
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates tzdata && rm -rf /var/lib/apt/lists/*
WORKDIR /root/

COPY --from=backend-builder /app/football-mondays .
COPY --from=frontend-builder /app/build ./build

EXPOSE 3001

CMD ["./football-mondays"]