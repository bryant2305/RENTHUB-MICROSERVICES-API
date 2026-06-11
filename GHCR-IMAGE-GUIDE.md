# 🐳 GHCR Image Management Guide

Complete guide for managing Docker images in GitHub Container Registry with RentHub.

---

## 📋 Quick Start

### 1. Make Scripts Executable
```bash
chmod +x scripts/pull-image.sh
chmod +x scripts/test-image.sh
```

### 2. Set Your GitHub Organization
```bash
# Option A: Set environment variable
export GITHUB_ORG="your-github-org"

# Option B: Edit scripts
sed -i 's/GITHUB_ORG:-"your-org"/GITHUB_ORG:-"your-actual-org"/' scripts/*.sh
```

### 3. Authenticate to GHCR
```bash
# Using GitHub CLI (recommended)
gh auth login
gh auth status  # Verify

# Or using Docker
docker login ghcr.io
# Username: {your-github-username}
# Password: {your-personal-access-token}
```

---

## 🔄 Workflow: From Code to Production

```
┌─────────────────────────────────────────────────────────────┐
│ 1. DEVELOPER COMMITS CODE                                   │
│ $ git push origin develop                                   │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. GITHUB ACTIONS WORKFLOW RUNS                             │
│ .github/workflows/build-and-push.yaml                       │
│                                                              │
│ Stages:                                                      │
│ ├─ detect-changes: Which services changed?                 │
│ ├─ lint: Run simple tests (must pass!)                      │
│ ├─ build: Build & push to GHCR                             │
│ └─ summarize: Show results                                  │
│                                                              │
│ Outputs:                                                     │
│ ├─ gateway_image: ghcr.io/.../gateway:abc1234              │
│ ├─ auth_service_image: ghcr.io/.../auth:abc1234            │
│ └─ ... (one per service)                                   │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. IMAGES IN GHCR                                           │
│ Ready to be deployed or tested                              │
└─────────────────────┬───────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. OPTIONS FROM HERE:                                       │
│                                                              │
│ A) Test locally (this guide)                               │
│    ./scripts/pull-image.sh auth latest                     │
│    ./scripts/test-image.sh auth latest                     │
│                                                              │
│ B) Deploy with ArgoCD (GitOps)                             │
│    Infrastructure repo automatically updated               │
│    ArgoCD syncs K8s cluster                                │
│                                                              │
│ C) Deploy to docker-compose                                │
│    docker-compose -f docker-compose.yml \                 │
│      -f docker-compose.ghcr.yml up                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Common Tasks

### Task 1: Pull and Verify a New Image

```bash
# Authenticate first
gh auth login

# Pull latest auth service image
./scripts/pull-image.sh auth latest

# Or specific version (commit SHA)
./scripts/pull-image.sh auth abc1234

# Or dev version
./scripts/pull-image.sh auth dev-latest

# Verify it's there
docker images | grep auth
```

### Task 2: Test Image Locally (Simple)

```bash
# Test auth service
./scripts/test-image.sh auth latest

# The script will:
# ✓ Pull the image
# ✓ Start a container
# ✓ Check health
# ✓ Show logs
# ✓ Give you access commands
```

### Task 3: Test with docker-compose (Full Stack)

```bash
# Authenticate
docker login ghcr.io

# Test with GHCR images (production versions)
GHCR_ORG="your-org" GHCR_TAG="latest" \
  docker-compose -f docker-compose.yml \
                 -f docker-compose.ghcr.yml up

# Or mix local and GHCR (some local, some GHCR)
# Edit docker-compose.ghcr.yml to only override certain services
```

### Task 4: List Available Images and Tags

```bash
# Using GitHub CLI
gh api repos/{owner}/{repo}/packages --jq '.[].name'

# Using GitHub API
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/{owner}/{repo}/packages

# Using Docker (requires pulling first)
docker images | grep ghcr.io
```

### Task 5: Compare Local Build vs GHCR

```bash
# Build locally
docker build -t local-auth auth-service/

# Pull from GHCR
./scripts/pull-image.sh auth latest

# Compare images
docker images | grep -E "local-auth|ghcr.*auth"

# Compare sizes
docker inspect local-auth | jq '.[].Size'
docker inspect ghcr.io/org/repo/auth | jq '.[].Size'

# Test both
./scripts/test-image.sh local-auth  # ❌ Won't work, use "auth"
# Instead manually test local:
docker run -it local-auth
```

### Task 6: Debug a Failed Image

```bash
# If image won't start
./scripts/test-image.sh auth dev-latest

# Check logs
docker logs test-auth-dev-latest

# Inspect image layers
docker history ghcr.io/your-org/RENTHUB-MICROSERVICES-API/auth:latest

# Inspect image config
docker inspect ghcr.io/your-org/RENTHUB-MICROSERVICES-API/auth:latest
```

### Task 7: Clean Up Local Images

```bash
# Remove all GHCR images
docker rmi $(docker images | grep ghcr.io | awk '{print $3}')

# Or specific service
docker rmi ghcr.io/your-org/RENTHUB-MICROSERVICES-API/auth:latest

# Prune dangling images
docker image prune -f

# Prune everything (careful!)
docker system prune -a
```

---

## 🔐 Authentication Troubleshooting

### Issue: "Authentication required"

**Solution 1: Using GitHub CLI**
```bash
gh auth login
# Follow prompts
# Choose: HTTPS
# Authenticate via web

# Verify
gh auth status
```

**Solution 2: Personal Access Token**
```bash
# Create token at: github.com/settings/tokens/new
# Scopes: repo, packages:read, packages:write

# Login
echo "ghp_xxxxxxxxxxxxxxxxxxxx" | \
  docker login ghcr.io -u {username} --password-stdin

# Test
docker pull ghcr.io/org/RENTHUB-MICROSERVICES-API/auth:latest
```

**Solution 3: Using ~/.docker/config.json**
```bash
# Create credentials file
cat > ~/.docker/config.json << 'EOF'
{
  "auths": {
    "ghcr.io": {
      "auth": "base64(username:token)"
    }
  }
}
EOF

chmod 600 ~/.docker/config.json
docker pull ghcr.io/org/RENTHUB-MICROSERVICES-API/auth:latest
```

### Issue: "Image not found" or "Permission denied"

1. Verify image exists: `gh api repos/{owner}/{repo}/packages`
2. Check spelling (case-sensitive!)
3. Verify repository is not private (or you have access)
4. Try with explicit registry: `ghcr.io/owner/repo/service:tag`

---

## 📊 Understanding Image Tags

### Tag Format
```
ghcr.io/{org}/RENTHUB-MICROSERVICES-API/{service}:{tag}
                ↑                        ↑          ↑
                |                        |          └─ Version
                |                        └────────────── Service
                └────────────────────────────────────── Organization
```

### Tag Strategy

| Tag | When | Use Case | Example |
|-----|------|----------|---------|
| `latest` | Push to develop | Latest dev version | `auth:latest` |
| `dev-latest` | Push to develop | Latest from develop | `auth:dev-latest` |
| `abc1234` | Always | Specific commit | `auth:abc1234` |
| `v123` | Push to main | Production release | `auth:v123` |
| `dev-456` | Push to develop | Dev build 456 | `auth:dev-456` |

### Pulling Different Versions

```bash
# Latest from develop
./scripts/pull-image.sh auth dev-latest

# Latest from main (production)
./scripts/pull-image.sh auth latest

# Specific commit
./scripts/pull-image.sh auth abc1234

# Specific build number
./scripts/pull-image.sh auth v123
```

---

## 🚀 Integration Examples

### Example 1: Test New Feature

```bash
# 1. Push code to develop
git checkout -b feat/oauth
# Make changes...
git push origin feat/oauth

# 2. GitHub Actions builds image
# Wait for workflow to complete

# 3. Pull and test locally
./scripts/pull-image.sh auth dev-latest

# 4. Or full stack test
docker-compose -f docker-compose.yml \
               -f docker-compose.ghcr.yml up

# 5. Manual testing
curl http://localhost:3010/health

# 6. Merge when confident
git push origin feat/oauth
# Create PR, get approval, merge to develop
```

### Example 2: Production Deployment

```bash
# 1. Code on main branch
# Already built and pushed by CI/CD

# 2. Verify images
./scripts/pull-image.sh gateway latest
./scripts/pull-image.sh auth latest

# 3. Quick test
./scripts/test-image.sh auth latest

# 4. Infrastructure repo updated
# Git receives: helm/values-prod.yaml with new tag
# ArgoCD sees change: syncs automatically
# Cluster: rolling deployment starts

# 5. Monitor deployment
kubectl -n renthub-prod get pods -w

# 6. Verify in production
curl https://your-prod-domain.com/health
```

### Example 3: Local Development (Minikube)

```bash
# 1. Load images into minikube
eval $(minikube docker-env)

# 2. Pull from GHCR (now goes to minikube's docker)
./scripts/pull-image.sh auth dev-latest

# 3. Deploy with kubectl
kubectl apply -f k8s/deployments/auth.yaml

# 4. Or use helm
helm install renthub ./helm/renthub-chart \
  -f helm/renthub-chart/values-dev.yaml

# 5. Check
kubectl get pods
kubectl logs deployment/auth
```

---

## 📈 Performance Tips

### Faster Pulls
```bash
# Use latest/dev-latest instead of specific SHAs
# (if you don't need exact reproducibility)
./scripts/pull-image.sh auth latest

# Parallel pulls (if testing multiple)
./scripts/pull-image.sh auth dev-latest &
./scripts/pull-image.sh gateway dev-latest &
wait
```

### Faster Tests
```bash
# Skip health checks if you know they work
# Edit test-image.sh to skip this section

# Or test without port mapping
docker run --rm {image} echo "Works"
```

### Reuse Images
```bash
# Keep images locally instead of re-pulling
docker run ... {image}  # Uses cached locally

# Prune only unused
docker image prune -a --filter "until=720h"  # Older than 30 days
```

---

## 🐛 Debugging Commands

```bash
# See all GHCR images on your system
docker images | grep ghcr.io

# Get image history
docker history ghcr.io/org/repo/auth:latest

# Inspect image details
docker inspect ghcr.io/org/repo/auth:latest

# Compare image size
docker images --no-trunc | grep auth

# Check image layers
docker manifest inspect ghcr.io/org/repo/auth:latest

# View image's environment variables
docker run --rm ghcr.io/org/repo/auth:latest env

# See entrypoint
docker inspect ghcr.io/org/repo/auth:latest | jq '.[0].Config.Entrypoint'

# Run shell in image
docker run -it --entrypoint /bin/sh ghcr.io/org/repo/auth:latest
```

---

## ✅ Workflow Verification Checklist

After setting everything up:

- [ ] Scripts are executable: `ls -l scripts/*.sh`
- [ ] GHCR_ORG environment set: `echo $GITHUB_ORG`
- [ ] Authenticated to GHCR: `gh auth status`
- [ ] Can list images: `gh api repos/{owner}/{repo}/packages`
- [ ] Can pull image: `./scripts/pull-image.sh auth latest`
- [ ] Image runs: `./scripts/test-image.sh auth latest`
- [ ] docker-compose.ghcr.yml works: `docker-compose -f docker-compose.yml -f docker-compose.ghcr.yml config`
- [ ] Multiple services work: `./scripts/pull-image.sh gateway dev-latest`

---

## 📚 Further Reading

- See [GHCR-SETUP.md](./../GHCR-SETUP.md) for complete GHCR documentation
- See [CI-CD-ARCHITECTURE.md](./CI-CD-ARCHITECTURE.md) for workflow details
- See [build-and-push.yaml](./workflows/build-and-push.yaml) for workflow source

---

## 🆘 Quick Help

**Q: Image won't pull?**
A: Check auth: `gh auth status` or `docker login ghcr.io`

**Q: Image won't start?**
A: Check logs: `docker logs {container}`

**Q: Can't find image?**
A: List images: `gh api repos/{owner}/{repo}/packages`

**Q: How to use in production?**
A: Infrastructure repo automatically updated, ArgoCD deploys automatically

**Q: How to rollback?**
A: `git revert` in infrastructure repo, ArgoCD redeploys

---

Happy Docker image management! 🚀
