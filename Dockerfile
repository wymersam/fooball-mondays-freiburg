# Build stage
FROM node:18-alpine AS frontend-builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY src/ src/
COPY public/ public/
COPY tsconfig.json .

RUN npm run build

# Go build stage
FROM golang:1.21-alpine AS backend-builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY main.go ./
RUN go build -o football-mondays main.go

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=backend-builder /app/football-mondays .
COPY --from=frontend-builder /app/build ./build

EXPOSE 3001

CMD ["./football-mondays"]