
# Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/index.html ./
COPY frontend/tsconfig.json ./
COPY frontend/vite.config.ts ./
COPY frontend/src/ ./src/
RUN npm run build

# Go build stage
FROM golang:1.24-alpine AS backend-builder
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/ .
RUN go build -o football-mondays

# Final stage

FROM alpine:3.19

# Install ca-certificates and tzdata for timezone support
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /root/

COPY --from=backend-builder /app/football-mondays .
COPY --from=frontend-builder /app/build ./build

EXPOSE 3001

CMD ["./football-mondays"]