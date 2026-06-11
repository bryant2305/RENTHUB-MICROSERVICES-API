# Production Deployment Architecture Guide

## The Complete Picture

You now have a **production-grade CI/CD pipeline** that follows industry best practices. Here's how everything connects:

---

## Repository Structure (Two Repos)

### Repo 1: RENTHUB-MICROSERVICES-API (Code)
```
This repository contains your application code

.github/
├── workflows/
│   ├── build-and-push.yaml        # Build & push Docker images
│   ├── deploy-dev.yaml            # Notify infra repo to deploy to dev
│   ├── deploy-staging.yaml        # Manual deployment to staging
│   └── deploy-prod.yaml           # Manual + approval to production
│
├── CI-CD-ARCHITECTURE.md          # This pipeline explained
└── CODEOWNERS                      # PR approval rules

gateway/
auth-service/
user-service/
properties-service/
reservation-service/
mail-service/
docker-compose.yml
README.md
```

**Responsibility**: Developers work here
**What it does**: 
- Builds Docker images
- Pushes to registry
- Notifies infrastructure repo

---

### Repo 2: renthub-infrastructure (Infrastructure)
```
NEW repository YOU need to create (separate from this one)

helm/
├── renthub-chart/
│   ├── Chart.yaml
│   ├── values.yaml               # Base values
│   ├── values-dev.yaml           # Dev overrides (auto-updated)
│   ├── values-staging.yaml       # Staging overrides (manual)
│   └── values-prod.yaml          # Production (manual + approval)
│   └── templates/
│       ├── deployment.yaml
│       ├── service.yaml
│       └── configmap.yaml

argocd/
├── renthub-dev.yaml              # ArgoCD app for dev
├── renthub-staging.yaml          # ArgoCD app for staging
└── renthub-prod.yaml             # ArgoCD app for production

terraform/                         # Optional: provision clusters
.github/
└── workflows/
    └── validate.yaml             # Just validate K8s configs
```

**Responsibility**: DevOps team manages this
**What it does**:
- Stores infrastructure configuration
- Helm values for all environments
- ArgoCD app definitions
- Gets updated by microservices repo workflows

---

## How They Connect

```
DEVELOPER WORKFLOW:
┌──────────────────────────────────────────────────────────────┐
│ RENTHUB-MICROSERVICES-API (Code Repo)                        │
│                                                              │
│ Developer: git push to develop branch                        │
│ ↓                                                            │
│ build-and-push.yaml runs:                                   │
│   ✓ Detects code changes                                    │
│   ✓ Builds Docker images                                    │
│   ✓ Pushes to ghcr.io/renthub-auth:v123                    │
│   ✓ Triggers deploy-dev.yaml                               │
│                                                              │
│ deploy-dev.yaml runs:                                       │
│   ✓ Calls repository_dispatch webhook                       │
│   ✓ Sends image tag info to infrastructure repo             │
│   ✓ Workflow in infrastructure repo receives event          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
           │
           │ webhook notification
           ↓
┌──────────────────────────────────────────────────────────────┐
│ renthub-infrastructure (Infrastructure Repo)                │
│                                                              │
│ Workflow triggered by repository_dispatch event:             │
│   ✓ Receives image tag from microservices repo              │
│   ✓ Updates helm/renthub-chart/values-dev.yaml              │
│   ✓ Commits: "chore: update dev image tag to v123"          │
│   ✓ Pushes to main branch                                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
           │
           │ git push detected
           ↓
┌──────────────────────────────────────────────────────────────┐
│ ArgoCD (GitOps Controller)                                  │
│                                                              │
│ ArgoCD watches infrastructure repo main branch:              │
│   ✓ Detects values-dev.yaml change (1-2 seconds)            │
│   ✓ Applies new Helm chart to dev cluster                   │
│   ✓ Rolls out pods with new image                           │
│   ✓ Notifies team                                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
           │
           ↓
┌──────────────────────────────────────────────────────────────┐
│ Kubernetes - Dev Cluster                                     │
│                                                              │
│ New version deployed:                                        │
│   ✓ pods: renthub-auth-abc123xyz (old image)               │
│   ✓ pods: renthub-auth-def456abc (new image - rolling)     │
│   ✓ No downtime (rolling update)                           │
│   ✓ Tests can now verify new version                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## The Three Deployment Paths

### Path 1: Development (Automatic)
```
Code Push (develop) → Build → ArgoCD → Dev Cluster (in seconds!)
- No approval needed
- Automatic deployment
- For rapid testing
```

### Path 2: Staging (Manual)
```
DevOps: Click "Deploy to Staging" workflow
  ↓
Choose image tag: v456
  ↓
GitHub Actions validates
  ↓
Infrastructure repo updates
  ↓
ArgoCD → Staging Cluster (in 1-2 minutes)
  
For: Quality assurance, load testing
```

### Path 3: Production (Manual + Strict)
```
DevOps: Click "Deploy to Production" workflow
  ↓
Choose image tag: v456, reason: "Hot fix auth bug"
  ↓
GitHub requires approval from CODEOWNERS
  ↓
After approval: validates tag format (must be v###)
  ↓
Infrastructure repo updates with audit trail
  ↓
ArgoCD → Production Cluster (in 1-2 minutes)
  ↓
Slack notification
  
For: Production releases only
Safety: Multiple approvals, strict tag validation, audit trail
```

---

## Key Advantages of This Setup

| Feature | Benefit |
|---------|---------|
| **Two Repos** | Separation of concerns (code vs infra) |
| **GitOps** | All changes tracked in git, easy rollback |
| **Automatic Dev Deploy** | Developers see changes immediately |
| **Manual Staging/Prod** | Prevents accidents, requires approval |
| **Helm Templates** | Single source of truth for all environments |
| **Docker Images** | Immutable, reproducible builds |
| **Audit Trail** | Git history shows who deployed what when |
| **Zero-Downtime** | Rolling updates don't interrupt service |
| **Easy Rollback** | Revert git commit to previous version |
| **Team Collaboration** | Clear approval flow, CODEOWNERS rules |

---

## Setup Checklist

### Step 1: Create Infrastructure Repository
```bash
# On GitHub, create new repo: renthub-infrastructure
# Public or private (usually private for production)
git clone https://github.com/YOUR-ORG/renthub-infrastructure.git
```

### Step 2: Move K8s Folder
```bash
# Copy our k8s/ folder to new infrastructure repo
cp -r RENTHUB-MICROSERVICES-API/k8s/* renthub-infrastructure/helm/

# Organize
mkdir -p renthub-infrastructure/helm/renthub-chart/templates
# Move all YAML files to templates/
# Move values-*.yaml to root of renthub-chart/
```

### Step 3: Set Up GitHub Secrets
In **RENTHUB-MICROSERVICES-API** repository:
```
Settings > Secrets and variables > Actions > New repository secret

Add these secrets:
- INFRASTRUCTURE_REPO_TOKEN    (GitHub PAT with repo access)
- INFRASTRUCTURE_REPO          (your-org/renthub-infrastructure)
- SLACK_WEBHOOK                (optional, for notifications)
- SLACK_WEBHOOK_DEPLOYMENTS    (optional, prod-only channel)
```

How to create GitHub PAT:
```
1. GitHub Settings > Developer settings > Personal access tokens
2. Generate new token (classic)
3. Give it: repo scope
4. Copy token, paste into secret
```

### Step 4: Set Up GitHub Environment Protection
In **RENTHUB-MICROSERVICES-API** repository:
```
Settings > Environments > Create "production"
  ↓
Required reviewers: (select team members)
  ↓
Deployment branches: Only "main"
  ↓
Save
```

### Step 5: Add CODEOWNERS
Already created at `.github/CODEOWNERS` - customize for your team

### Step 6: Test the Pipeline
```
1. Make a change to gateway/ code
2. Commit to develop branch: git push origin develop
3. Watch .github/workflows/build-and-push.yaml run
4. Check ghcr.io for new image
5. Watch deploy-dev.yaml trigger
6. Verify image tag updated in infrastructure repo
7. Watch ArgoCD sync (check dashboard)
8. Verify new pod in dev cluster
```

---

## Real-World Example: Fixing a Bug

```
SCENARIO: Critical bug in auth service

1️⃣ Developer fixes bug
   git checkout -b bugfix/auth-token
   # Fix code
   git commit -m "fix: auth token expiry issue"
   git push origin bugfix/auth-token

2️⃣ Create PR to develop
   gh pr create --base develop
   
3️⃣ Team reviews & approves PR
   (CODEOWNERS automatically requested)
   
4️⃣ Merge to develop
   PR merged → develop branch updated
   
5️⃣ build-and-push.yaml runs (auto)
   ✓ Builds new auth-service image
   ✓ Tags: ghcr.io/org/renthub-auth:v456
   
6️⃣ deploy-dev.yaml runs (auto)
   ✓ Notifies infrastructure repo
   
7️⃣ Infrastructure repo updates
   ✓ values-dev.yaml updated: tag: v456
   ✓ Git commit created
   
8️⃣ ArgoCD detects change (within 2 sec)
   ✓ Deploys to dev cluster
   
9️⃣ Dev environment running new code
   Team: "Let's test the fix"
   
🔟 Test passes! Ready for production
   DevOps: Runs deploy-prod.yaml
   
1️⃣1️⃣ Manual deploy-prod workflow
   image_tag: v456
   reason: "Critical fix: auth token expiry issue"
   
1️⃣2️⃣ GitHub requires approval
   Tech lead approves deployment
   
1️⃣3️⃣ Production cluster updates (1-2 min)
   ✓ Rolling deployment (0 downtime)
   ✓ Slack notification sent
   ✓ Audit trail in git
   
1️⃣4️⃣ Bug fixed in production!
   Time from commit to production: ~30 minutes
   
Rollback if needed? Just one command:
   git revert <commit-hash>
   ArgoCD detects, rolls back in 1-2 min
```

---

## Comparison: Our Learning Setup vs Production

| Aspect | Learning | Production |
|--------|----------|-----------|
| Config location | `k8s/` folder here | `renthub-infrastructure` repo |
| Deployment | `kubectl apply` manually | ArgoCD auto-syncs |
| Change detection | Manual | Git webhook (automatic) |
| Multi-environment | Copy-paste YAML | Helm values + overlays |
| Dev environment | Manual approval | Automatic |
| Staging environment | Manual approval | Manual trigger |
| Production environment | Manual approval | Manual + GitHub approval |
| Rollback | Manual `kubectl` | `git revert` + auto-sync |
| Audit trail | Git commits | Git + ArgoCD logs |
| Team approval | None | CODEOWNERS rules |
| Secrets | Base64 in YAML | External Secrets Operator |
| Scaling | Edit replicas | Edit values file |
| Testing | Local minikube | Actual K8s clusters |

---

## You've Built

✅ **Microservices repository** with proper CI/CD workflows
✅ **Docker image building** with automated detection
✅ **Three-environment strategy** (dev/staging/prod)
✅ **Approval workflows** for production safety
✅ **GitOps ready** (just needs infrastructure repo + ArgoCD)
✅ **Audit trails** for compliance
✅ **Team collaboration** with CODEOWNERS

This is **exactly what DevOps engineers use in production**! 🚀

---

## Next Steps

1. **Create `renthub-infrastructure` repo** (separate GitHub repo)
2. **Move k8s folder** to that new repo (organized as Helm chart)
3. **Add GitHub secrets** to this microservices repo
4. **Set up environment protection** in GitHub
5. **Install ArgoCD** on your Kubernetes clusters
6. **Test the full flow**: Code change → Build → Deploy
7. **Document for your team** how to use these workflows

You're now using industry-standard DevOps practices! 🎉
