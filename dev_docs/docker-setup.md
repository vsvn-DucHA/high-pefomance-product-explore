# Docker Setup Guide

Complete guide for production deployment with Docker.

---

## 📦 Overview

The project uses **multi-stage Docker build** optimized for production:
- **Stage 1 (deps):** Install dependencies with pnpm
- **Stage 2 (builder):** Build optimized static assets with Vite
- **Stage 3 (production):** Serve with Nginx on Alpine Linux

**Result:** Production-ready container (~50MB) with Nginx, compression, and security headers.

---

## 🚀 Quick Start

```bash
# Build and start production container
docker-compose up -d

# View logs
docker-compose logs -f
```

Access at: [http://localhost](http://localhost)

**For development:** Use local setup (`pnpm dev`) for hot-reload and faster iteration.

---

## 🏗 Architecture

### Multi-Stage Dockerfile

```dockerfile
# Stage 1: deps - Install dependencies with pnpm
# Stage 2: builder - Build optimized production bundle
# Stage 3: production - Serve static files with Nginx
```

**Benefits:**
- ✅ Minimal image size (~50MB)
- ✅ Cached layers for faster rebuilds
- ✅ Security: Only static files in final image
- ✅ Production-optimized with Nginx

### Image Size

| Component | Size |
|-----------|------|
| Final Production Image | ~50MB |
| Base (nginx:alpine) | ~40MB |
| Built Assets | ~10MB |

---

## 📋 Available Commands

### Basic Operations

```bash
# Start production container
docker-compose up -d

# Stop container
docker-compose down

# Restart container
docker-compose restart

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Execute command in container
docker-compose exec app sh
```

### Build Commands

```bash
# Build image
docker-compose build

# Force rebuild (no cache)
docker-compose build --no-cache

# Build and start
docker-compose up --build -d
```

### Cleanup

```bash
# Stop and remove container
docker-compose down

# Remove container and volumes
docker-compose down -v

# Remove all unused images
docker image prune -a

# Complete cleanup
docker-compose down -v --rmi all
```

---

## 🔧 Configuration

### Port Mapping

| Container Port | Host Port | Access |
|----------------|-----------|--------|
| 80 | 80 | http://localhost |

**Change port:**
Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Access at http://localhost:8080
```

### Environment Variables

```yaml
NODE_ENV=production  # Production mode
```

### Container Resources

Add to `docker-compose.yml`:
```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

---

## 🏥 Health Checks

```bash
# Check health endpoint
curl http://localhost/health
# Response: "healthy"

# Check container status
docker-compose ps
# Should show: Up (healthy)

# View health check logs
docker inspect product-explorer | grep -A 10 Health
```

**Configuration:**
- Interval: 30 seconds
- Timeout: 3 seconds
- Retries: 3
- Start period: 5 seconds

**Health endpoint:** `/health` returns 200 status with "healthy" text.

---

## 🎯 Use Cases

### 1. Production Deployment

```bash
# Deploy to server
docker-compose up -d

# Monitor
docker-compose logs -f
```

**Perfect for:**
- ✅ VPS/Cloud deployment (AWS, DigitalOcean, etc.)
- ✅ Production builds
- ✅ Staging environments
- ✅ Performance testing

### 2. Local Development

**Use native setup instead:**
```bash
pnpm dev  # Much faster with HMR
```

**Why?**
- ⚡ Instant hot reload
- ⚡ Faster startup
- ⚡ Better debugging
- ⚡ No Docker overhead

### 3. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
steps:
  - name: Build Docker image
    run: docker build -t app:latest .

  - name: Push to registry
    run: docker push registry.example.com/app:latest

  - name: Deploy
    run: ssh server "docker pull app:latest && docker-compose up -d"
```

### 4. Consistent Deployments

✅ Same build process everywhere
✅ Same Nginx configuration
✅ Same Node/pnpm versions
✅ Predictable behavior

---

## 🔍 Troubleshooting

### Issue: Container won't start

```bash
# Check logs for errors
docker-compose logs

# Common issues:
# 1. Port 80 already in use
sudo lsof -i :80  # Find process using port
docker-compose down

# 2. Build failed
docker-compose build --no-cache
```

### Issue: Port 80 already in use

```bash
# Error: Bind for 0.0.0.0:80 failed: port is already allocated

# Solution 1: Stop conflicting service
docker ps  # Find container using port
docker stop <container-id>

# Solution 2: Use different port
# Edit docker-compose.yml:
ports:
  - "8080:80"  # Access at http://localhost:8080
```

### Issue: Products not loading

```bash
# Check if products.json was generated during build
docker-compose exec app ls -la /usr/share/nginx/html/assets/

# Rebuild if missing
docker-compose build --no-cache
docker-compose up -d
```

### Issue: 404 on routes

**Symptom:** Direct URL access (e.g., `/products/123`) returns 404

**Cause:** SPA routing not configured

**Solution:** Check `nginx.conf` has:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Issue: Health check failing

```bash
# Test health endpoint manually
curl http://localhost/health

# Should return: "healthy"

# If not, check Nginx logs
docker-compose logs

# Restart container
docker-compose restart
```

### Issue: Build fails on Windows

**Problem:** Line endings or path issues

**Solution:**
```bash
# Configure git to handle line endings
git config core.autocrlf false

# Rebuild
docker-compose build --no-cache
```

---

## 🎨 Nginx Configuration (Production)

Located in `nginx.conf`:

### Features Enabled

1. **Gzip Compression**
   - Reduces transfer size by ~70%
   - Applies to JS, CSS, JSON

2. **Caching Headers**
   - Static assets: 1 year
   - products.json: 1 hour
   - index.html: No cache

3. **Security Headers**
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection
   - Referrer-Policy

4. **SPA Routing**
   - All routes fall back to index.html
   - Enables client-side routing

5. **Health Check**
   - `/health` endpoint for monitoring

### Custom Configuration

Edit `nginx.conf` and rebuild:

```bash
# Modify nginx.conf
vim nginx.conf

# Rebuild production image
docker-compose build prod
docker-compose up prod
```

---

## 📊 Performance

### Build Times

| Stage | Time (Cold) | Time (Cached) |
|-------|-------------|---------------|
| deps | ~2 min | ~5 sec |
| builder | ~1 min | ~10 sec |
| production | ~5 sec | ~2 sec |
| **Total** | **~3.5 min** | **~20 sec** |

**Tip:** Cached builds are much faster. Only `package.json` or source changes trigger rebuilds.

### Resource Usage

| Metric | Production Container |
|--------|---------------------|
| CPU (idle) | ~1-2% |
| Memory | ~10-15 MB |
| Disk | ~50 MB |
| Network | Minimal |

### Runtime Performance

**Nginx optimization enabled:**
- ✅ Gzip compression (~70% size reduction)
- ✅ Static asset caching (1 year)
- ✅ Browser caching headers
- ✅ HTTP/2 ready

**Benchmarks:**
```bash
# Test with ApacheBench
ab -n 1000 -c 10 http://localhost/

# Expected:
# - Requests/sec: 2000-3000
# - Time/request: ~5ms
```

---

## 🔐 Security Best Practices

### 1. Non-root User (Future Enhancement)

```dockerfile
# Add in Dockerfile
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs
```

### 2. Scan for Vulnerabilities

```bash
# Using Trivy
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image product-explorer-prod:latest

# Using Docker Scout
docker scout cves product-explorer-prod:latest
```

### 3. Minimal Base Images

✅ Already using Alpine Linux (smallest base)

---

## 🚀 Production Deployment

### Deploy to VPS/Cloud

#### 1. Docker Hub

```bash
# Build and tag
docker build -t username/product-explorer:latest .

# Push to Docker Hub
docker push username/product-explorer:latest

# Deploy on server
ssh user@server
docker pull username/product-explorer:latest
docker run -d \
  --name product-explorer \
  --restart unless-stopped \
  -p 80:80 \
  username/product-explorer:latest
```

#### 2. AWS ECS

```bash
# Authenticate to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and tag
docker build -t <account-id>.dkr.ecr.us-east-1.amazonaws.com/product-explorer:latest .

# Push
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/product-explorer:latest

# Deploy via ECS console or CLI
```

#### 3. DigitalOcean/Linode

```bash
# SSH to droplet
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone and deploy
git clone <your-repo>
cd <your-repo>
docker-compose up -d
```

#### 4. Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: product-explorer
spec:
  replicas: 3
  selector:
    matchLabels:
      app: product-explorer
  template:
    metadata:
      labels:
        app: product-explorer
    spec:
      containers:
      - name: app
        image: username/product-explorer:latest
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: product-explorer
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: product-explorer
```

### CI/CD Examples

#### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/product-explorer:${{ github.sha }} .

      - name: Login to Docker Hub
        run: echo "${{ secrets.DOCKERHUB_TOKEN }}" | docker login -u "${{ secrets.DOCKERHUB_USERNAME }}" --password-stdin

      - name: Push image
        run: |
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/product-explorer:${{ github.sha }}
          docker tag ${{ secrets.DOCKERHUB_USERNAME }}/product-explorer:${{ github.sha }} ${{ secrets.DOCKERHUB_USERNAME }}/product-explorer:latest
          docker push ${{ secrets.DOCKERHUB_USERNAME }}/product-explorer:latest

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull ${{ secrets.DOCKERHUB_USERNAME }}/product-explorer:latest
            docker stop product-explorer || true
            docker rm product-explorer || true
            docker run -d --name product-explorer --restart unless-stopped -p 80:80 ${{ secrets.DOCKERHUB_USERNAME }}/product-explorer:latest
```

---

## 📚 References

- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Docker Compose Specification](https://docs.docker.com/compose/compose-file/)
- [Vite Docker Best Practices](https://vitejs.dev/guide/env-and-mode.html)

---

**Last updated:** 2026-03-17
