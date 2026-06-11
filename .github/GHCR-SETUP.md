# GitHub Container Registry (GHCR) Setup & Integration Guide

## 📋 Overview

This guide explains how to use GitHub Container Registry (GHCR) with the RentHub microservices. The workflow automatically builds and pushes Docker images to GHCR when you push code.

---

## 🔑 Required GitHub Permissions

Your workflow uses `GITHUB_TOKEN` which automatically has the right permissions. However, verify your repository settings:

### Repository Settings Checklist

```
1. Go to: Settings > Actions > General
2. Scroll to: "Workflow permissions"
3. Ensure checked:
   ✅ Read and write permissions
   ✅ Allow GitHub Actions to create and approve pull requests
4. Under "Default permissions":
   ✅ Read and write
```

### Personal Access Token (If Manual)
If you need a personal token with more control:

```
1. GitHub Settings > Developer settings > Personal access tokens (classic)
2. Generate new token
3. Scopes required:
   ✅ repo (all)
   ✅ packages:write
   ✅ packages:read
   ✅ delete:packages (for cleanup)
4. Copy token, save securely
5. Add to repository secrets as: GHCR_TOKEN
```

### GitHub Organization Package Settings

If using organization-level packages:

```
1. Organization Settings > Packages
2. Ensure: "Allow internal and private packages"
3. Check: Package visibility settings
```

---

## 🚀 How the Workflow Works

### Flow Diagram

```
Developer Push
  ↓
GitHub Actions triggered
  ↓
[1] Detect Changed Services
    ├─ Checks which services modified
    └─ Skips unchanged services
  ↓
[2] Run Tests (Lint only)
    ├─ Validates Dockerfile syntax
    ├─ Checks package.json
    ├─ Checks tsconfig.json
    └─ Must pass to continue
  ↓
[3] Build & Push (if tests pass)
    ├─ Sets up Docker Buildx
    ├─ Authenticates to GHCR
    ├─ Builds image with caching
    ├─ Tags with:
    │  ├─ v{run_number} (on main branch)
    │  ├─ dev-{run_number} (on develop)
    │  ├─ {short_sha} (always)
    │  └─ latest/dev-latest
    ├─ Pushes to GHCR
    └─ Scans for vulnerabilities
  ↓
[4] Output Image Names
    └─ Exposes for downstream jobs
```

### Image Naming Convention

```
ghcr.io/{github-org}/{repository}/{service}:{tag}

Examples:
ghcr.io/your-org/RENTHUB-MICROSERVICES-API/auth:abc1234
ghcr.io/your-org/RENTHUB-MICROSERVICES-API/gateway:v123
ghcr.io/your-org/RENTHUB-MICROSERVICES-API/user:dev-latest
```

---

## ✅ Verify Images Were Published

### Method 1: Using GitHub UI

```
1. Go to your repository
2. Click "Packages" tab (right side)
3. You should see your package names:
   - renthub-auth
   - renthub-gateway
   - renthub-user
   - etc.
4. Click each to see versions and tags
```

### Method 2: Using GitHub CLI

```bash
# List all packages in repository
gh api repos/{owner}/{repo}/packages --jq '.[] | {id, name, package_type}'

# Get specific package info
gh api repos/{owner}/{repo}/packages \
  --jq '.[] | select(.name=="renthub-auth")'
```

### Method 3: Using GHCR API

```bash
# Get all image tags for a service
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://ghcr.io/v2/{owner}/{repo}/auth/tags/list

# Example response:
# {
#   "name": "your-org/renthub-microservices-api/auth",
#   "tags": ["abc1234", "dev-latest", "v123"]
# }
```

### Method 4: Using Docker CLI

```bash
# List image layers (requires authentication first)
docker manifest inspect ghcr.io/{org}/RENTHUB-MICROSERVICES-API/auth:abc1234
```

---

## 🔐 Authentication for GHCR Access

### For Your GitHub Actions Workflows
Already built-in! `GITHUB_TOKEN` handles it automatically.

### For Local Development

#### Option 1: GitHub CLI (Easiest)

```bash
# Login using GitHub CLI
gh auth login
gh auth status  # Verify

# Docker will use gh credentials
docker pull ghcr.io/{org}/RENTHUB-MICROSERVICES-API/auth:latest
```

#### Option 2: Personal Access Token

```bash
# Create token (see above for scopes)
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u {github-username} --password-stdin

# Verify login
docker pull ghcr.io/{org}/RENTHUB-MICROSERVICES-API/auth:latest

# Logout
docker logout ghcr.io
```

#### Option 3: Store Credentials

```bash
# Create ~/.docker/config.json
cat << 'EOF' > ~/.docker/config.json
{
  "auths": {
    "ghcr.io": {
      "auth": "$(echo -n '{username}:{token}' | base64)"
    }
  }
}
EOF

# Make it secure
chmod 600 ~/.docker/config.json
```

---

## 📥 Pull and Run Images Locally

### Pull Image from GHCR

```bash
# Authenticate first (see above)
docker login ghcr.io

# Pull image
docker pull ghcr.io/{org}/RENTHUB-MICROSERVICES-API/auth:latest

# Or specific version
docker pull ghcr.io/{org}/RENTHUB-MICROSERVICES-API/auth:abc1234
```

### Run Container Locally

```bash
# Run with environment variables
docker run -d \
  --name auth-service \
  -e DB_HOST=localhost \
  -e DB_PASSWORD=your-password \
  -p 3010:3010 \
  ghcr.io/{org}/RENTHUB-MICROSERVICES-API/auth:latest

# Check logs
docker logs -f auth-service

# Stop container
docker stop auth-service
```

### Use in docker-compose.yml

```yaml
version: '3.8'

services:
  auth:
    image: ghcr.io/{org}/RENTHUB-MICROSERVICES-API/auth:latest
    ports:
      - "3010:3010"
    environment:
      DB_HOST: mysql
      DB_PASSWORD: ${DB_PASSWORD}
      MONGODB_HOST: mongo
      REDIS_HOST: redis
    depends_on:
      - mysql
      - mongo
      - redis

  gateway:
    image: ghcr.io/{org}/RENTHUB-MICROSERVICES-API/gateway:latest
    ports:
      - "3333:3333"
    # ... rest of config
```

---

## 🔧 Troubleshooting

### Problem: "Image pull back-off"
```
Error: pull access denied for ghcr.io/...
Solution:
1. Verify image exists: gh api repos/{owner}/{repo}/packages
2. Check spelling: case-sensitive!
3. Verify permissions:
   - Is repo public or private?
   - Do you have access token?
   - ghcr.io credentials correct?
```

### Problem: "Unauthorized to access package"
```
Solution:
1. Verify you're authenticated: docker info | grep Username
2. Check token has right scopes: packages:read, packages:write
3. Try fresh login: docker logout ghcr.io && docker login ghcr.io
4. Regenerate PAT if old
```

### Problem: "Workflow fails on build-and-push"
```
Check:
1. Linting step: docker lint errors?
2. Dockerfile exists in service directory?
3. package.json valid JSON?
4. tsconfig.json valid JSON?
5. GitHub Actions runner has disk space?
```

### Problem: "No layers cached"
```
This is normal on first build. Subsequent builds use cache.
Check workflow for:
  cache-from: type=registry,ref=...
  cache-to: type=registry,ref=...,mode=max
```

### Problem: "Trivy scan fails"
```
Solution: This is non-blocking (continue-on-error: true)
But to reduce vulnerabilities:
1. Use official base images
2. Keep dependencies updated
3. Review scan results in GitHub Security tab
```

---

## 🔗 Integration with GitOps (Helm + ArgoCD)

### Exposing Image Tags for Downstream

The workflow outputs individual image tags for each service:

```yaml
outputs:
  gateway_image: ghcr.io/org/RENTHUB-MICROSERVICES-API/gateway:abc1234
  auth_service_image: ghcr.io/org/RENTHUB-MICROSERVICES-API/auth:abc1234
  user_service_image: ghcr.io/org/RENTHUB-MICROSERVICES-API/user:abc1234
  # ... etc for all services
```

### Using in Deploy Workflows

In `deploy-dev.yaml`, `deploy-staging.yaml`, etc:

```yaml
# Reference outputs from build job
- name: Update infrastructure repo with new image tags
  uses: peter-evans/repository-dispatch@v2
  with:
    token: ${{ secrets.INFRASTRUCTURE_REPO_TOKEN }}
    repository: ${{ secrets.INFRASTRUCTURE_REPO }}
    event-type: update-dev-images
    client-payload: |
      {
        "images": {
          "gateway": "${{ needs.build.outputs.gateway_image }}",
          "auth": "${{ needs.build.outputs.auth_service_image }}",
          "user": "${{ needs.build.outputs.user_service_image }}",
          "property": "${{ needs.build.outputs.properties_service_image }}",
          "reservation": "${{ needs.build.outputs.reservation_service_image }}",
          "mail": "${{ needs.build.outputs.mail_service_image }}"
        }
      }
```

### Infrastructure Repo Receives Images

In `renthub-infrastructure` repo workflow:

```bash
# Extract image info from webhook payload
GATEWAY_IMAGE=$(echo '${{ github.event.client_payload.images.gateway }}')
AUTH_IMAGE=$(echo '${{ github.event.client_payload.images.auth }}')

# Update Helm values
sed -i "s|image: .*|image: $AUTH_IMAGE|" helm/renthub-chart/values-dev.yaml

# Commit and push
git add helm/renthub-chart/values-dev.yaml
git commit -m "chore: update image tags"
git push origin main

# ArgoCD detects change and deploys!
```

---

## 📦 Managing Images and Space

### View Image Sizes

```bash
# Docker CLI
docker images | grep ghcr.io

# GitHub API
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/{owner}/{repo}/packages \
  --jq '.[] | {name, size_in_bytes}'
```

### Delete Old Images

```bash
# Via GitHub API
curl -X DELETE \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/{owner}/{repo}/packages/{package-id}

# Or via GitHub CLI
gh api repos/{owner}/{repo}/packages/{id} \
  -X DELETE
```

### Set Retention Policy

```
1. Go to: Settings > Packages and registries
2. Configure:
   - Retention period: e.g., 30 days
   - Keep last N versions: e.g., 10
   - Auto-delete untagged images
```

---

## 🎓 Best Practices

### 1. **Tag Strategy**
```yaml
✅ Good:
  - v{run_number}: Production releases
  - dev-latest: Latest dev build
  - {short_sha}: Specific commit
  - {semantic_version}: v1.2.3

❌ Avoid:
  - latest only (ambiguous)
  - latest on all branches
  - No SHA tracking
```

### 2. **Image Size Optimization**
```dockerfile
# ✅ Good: Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /build
COPY . .
RUN npm ci --only=production && npm run build

FROM node:18-alpine
COPY --from=builder /build/dist /app/dist
CMD ["node", "dist/main.js"]

# ❌ Bad: Large final image
FROM node:18
COPY . .
RUN npm install
```

### 3. **Security**
```yaml
✅ Do:
  - Scan images with Trivy
  - Use minimal base images (alpine)
  - Don't hardcode secrets
  - Run as non-root user

❌ Don't:
  - Include secrets in image
  - Use 'latest' tag as guarantee
  - Update packages in production
  - Run as root
```

### 4. **Layer Caching**
```yaml
✅ Good cache hits:
  - Base image rarely changes
  - Dependencies (npm install) mid-build
  - Application code last

❌ Cache misses:
  - ADD/COPY . . too early
  - Unnecessary RUN commands
  - Changing base images
```

---

## 📊 Monitoring and Alerts

### GitHub Actions Insights

```
1. Go to: Actions > Build and Push Docker Images
2. View:
   - Workflow run duration
   - Success/failure rate
   - Most common errors
```

### Set Notifications

```
1. GitHub > Settings > Notifications
2. Under "Watching":
   ✅ Direct mentions
   ✅ Workflow failures
```

### Slack Integration

Already configured in `build-and-push.yaml`:
- Notifies on build failure
- Requires `SLACK_WEBHOOK` secret

---

## 🔄 Complete Example: Local Testing

### Test Image Locally

```bash
#!/bin/bash
set -e

ORG="your-org"
REPO="RENTHUB-MICROSERVICES-API"
SERVICE="auth"
TAG="latest"

IMAGE="ghcr.io/$ORG/$REPO/$SERVICE:$TAG"

echo "🔐 Logging in to GHCR..."
gh auth login || true

echo "📥 Pulling image: $IMAGE..."
docker pull "$IMAGE"

echo "🏃 Running container..."
docker run -d \
  --name test-$SERVICE \
  -e NODE_ENV=development \
  -e DB_HOST=host.docker.internal \
  -p 3010:3010 \
  "$IMAGE"

echo "⏳ Waiting for service to start..."
sleep 5

echo "🔍 Checking health..."
docker exec test-$SERVICE curl http://localhost:3010/health || echo "Health check pending..."

echo "📋 Container logs:"
docker logs test-$SERVICE

echo "✅ Test complete!"
echo "To stop: docker stop test-$SERVICE"
```

Run it:
```bash
chmod +x test-image.sh
./test-image.sh
```

---

## 🎯 Checklist: Ready for Production

- [ ] GitHub permissions configured
- [ ] Workflow tested with dummy push
- [ ] Images appearing in Packages tab
- [ ] Can pull image locally
- [ ] Tags following strategy
- [ ] Layer caching working
- [ ] Trivy scanning enabled
- [ ] Retention policy set
- [ ] Slack notifications working
- [ ] Downstream workflows configured
- [ ] Team knows image naming
- [ ] Rollback procedure documented

---

## 📚 References

- [GitHub Container Registry Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Build Action](https://github.com/docker/build-push-action)
- [Trivy Vulnerability Scanner](https://aquasecurity.github.io/trivy/)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/guides/publishing-docker-images)

---

## 📞 Support

For issues:
1. Check workflow logs: Actions tab
2. Check GitHub Status: status.github.com
3. Review Trivy results: Security > Code scanning alerts
4. Check Docker documentation
5. Contact your DevOps team
