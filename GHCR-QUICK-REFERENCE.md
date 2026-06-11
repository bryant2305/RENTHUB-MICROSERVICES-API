# 🚀 GHCR Quick Reference Card

**Print this or bookmark it!**

---

## 🔐 First Time Setup

```bash
# 1. Authenticate
gh auth login
gh auth status

# 2. Set organization
export GITHUB_ORG="your-github-org"

# 3. Verify setup
./scripts/verify-ghcr-setup.sh
```

---

## 📥 Pull Images

```bash
# Latest dev build
./scripts/pull-image.sh auth dev-latest

# Latest production build
./scripts/pull-image.sh auth latest

# Specific commit
./scripts/pull-image.sh auth abc1234

# All services
./scripts/pull-image.sh gateway dev-latest
./scripts/pull-image.sh user dev-latest
./scripts/pull-image.sh property dev-latest
./scripts/pull-image.sh reservation dev-latest
./scripts/pull-image.sh mail dev-latest
```

---

## 🧪 Test Images

```bash
# Quick test (auto port mapping)
./scripts/test-image.sh auth dev-latest

# Check logs
docker logs test-auth-dev-latest

# Access shell
docker exec -it test-auth-dev-latest /bin/sh

# Stop test
docker stop test-auth-dev-latest
```

---

## 🐳 Full Stack Testing

```bash
# With GHCR images (latest builds)
docker-compose -f docker-compose.yml \
               -f docker-compose.ghcr.yml up

# With specific tag
GHCR_TAG=v123 docker-compose -f docker-compose.yml \
                             -f docker-compose.ghcr.yml up

# With custom org
GHCR_ORG=myorg GHCR_TAG=latest docker-compose -f docker-compose.yml \
                                              -f docker-compose.ghcr.yml up
```

---

## 🔄 Development Workflow

```bash
# 1. Code changes
vim auth-service/src/app.ts

# 2. Commit & push
git add . && git commit -m "fix: bug" && git push origin develop

# 3. Wait for Actions (2-5 min)
# Go to: GitHub → Actions → "Build and Push"

# 4. Pull and test
./scripts/pull-image.sh auth dev-latest
./scripts/test-image.sh auth dev-latest

# 5. Verify (curl localhost:3010)
curl http://localhost:3010/health
```

---

## 📊 Available Images

```bash
# List with GitHub CLI
gh api repos/{owner}/{repo}/packages

# Check specific service
gh api repos/{owner}/{repo}/packages \
  --jq '.[] | select(.name | contains("auth"))'
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Command not found" | Run: `chmod +x scripts/*.sh` |
| "Auth required" | Run: `gh auth login` |
| "Image not found" | Check spelling (case-sensitive!) |
| "Can't connect" | Is docker running? `docker info` |
| "Workflow failed" | Check: GitHub Actions logs |
| "GITHUB_ORG not set" | Run: `export GITHUB_ORG="your-org"` |

---

## 📂 Key Files Location

```
.github/
  └── GHCR-SETUP.md              ← Complete reference (400+ lines)
  └── workflows/
      └── build-and-push.yaml    ← Workflow code

scripts/
  └── pull-image.sh              ← Pull from GHCR
  └── test-image.sh              ← Test locally
  └── verify-ghcr-setup.sh       ← Verify setup

GHCR-IMAGE-GUIDE.md              ← Developer guide
GHCR-SETUP-COMPLETE.md           ← Full summary

docker-compose.ghcr.yml          ← Use GHCR images
```

---

## 🎯 Tag Strategy

| Branch | Tags |
|--------|------|
| develop | `dev-latest`, `dev-{run}`, `{sha}` |
| main | `latest`, `v{run}`, `{sha}` |

---

## 🔗 Image URL Format

```
ghcr.io/{org}/RENTHUB-MICROSERVICES-API/{service}:{tag}

Example:
ghcr.io/myorg/RENTHUB-MICROSERVICES-API/auth:abc1234
```

---

## 📋 Services Available

- gateway
- auth
- user
- property
- reservation
- mail

---

**For more help, see:**
- `GHCR-IMAGE-GUIDE.md` (developer guide)
- `.github/GHCR-SETUP.md` (complete reference)
- `GHCR-SETUP-COMPLETE.md` (setup summary)

