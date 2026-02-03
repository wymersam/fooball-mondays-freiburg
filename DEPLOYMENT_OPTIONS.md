# Better hosting options for Go backend

## 🚀 Recommended Platforms

### 1. Railway (Easiest)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

- ✅ Supports Go natively
- ✅ File storage works
- ✅ Free tier available
- ✅ Automatic HTTPS

### 2. Fly.io (Scalable)

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Deploy
fly launch
fly deploy
```

- ✅ Global edge deployment
- ✅ Persistent volumes for data
- ✅ Great performance

### 3. Render (Simple)

```bash
# Connect GitHub repo
# Auto-deploys on push
```

- ✅ Zero config deployment
- ✅ Built-in SSL
- ✅ Database integration

### 4. Heroku (Classic)

```bash
git push heroku main
```

- ✅ Easy deployment
- ✅ Add-ons ecosystem
- ⚠️ Paid plans only now

## 📝 Deployment Files Needed

### For Railway/Render (Dockerfile)

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o main .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/public ./public
EXPOSE 3001
CMD ["./main"]
```

### For Fly.io (fly.toml)

```toml
app = "football-mondays"

[http_service]
  internal_port = 3001
  force_https = true

[[mounts]]
  source = "data"
  destination = "/app/data"
```

## 🌐 Frontend Options for Netlify

If you want to keep frontend on Netlify:

1. **Deploy Go backend** to Railway/Fly.io
2. **Deploy React frontend** to Netlify
3. **Update API URLs** in React to point to backend

```javascript
// In your React app
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://football-mondays.railway.app/api" // Railway URL
    : "http://localhost:3001/api";
```

## 💡 Recommendation

**Best approach for you:**

1. Deploy Go backend to **Railway** (easiest)
2. Deploy React frontend to **Netlify**
3. Configure CORS to allow Netlify domain
