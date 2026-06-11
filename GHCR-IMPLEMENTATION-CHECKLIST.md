# ✅ GHCR Implementation Checklist

Complete checklist to verify your GHCR setup and integration.

---

## 🎯 Phase 1: Setup Verification (5 minutes)

### Files Created
- [ ] `.github/workflows/build-and-push.yaml` exists
- [ ] `.github/GHCR-SETUP.md` exists  
- [ ] `GHCR-IMAGE-GUIDE.md` exists
- [ ] `GHCR-SETUP-COMPLETE.md` exists
- [ ] `GHCR-QUICK-REFERENCE.md` exists
- [ ] `docker-compose.ghcr.yml` exists
- [ ] `scripts/pull-image.sh` is executable (`-rwx`)
- [ ] `scripts/test-image.sh` is executable (`-rwx`)
- [ ] `scripts/verify-ghcr-setup.sh` is executable (`-rwx`)

**Verify with:**
```bash
ls -lh .github/GHCR-SETUP.md scripts/*.sh docker-compose.ghcr.yml
```

### Environment Setup
- [ ] GitHub CLI installed: `gh --version`
- [ ] Docker installed: `docker --version`
- [ ] Git configured: `git config user.name`
- [ ] `GITHUB_ORG` environment variable set: `echo $GITHUB_ORG`

**Verify with:**
```bash
gh --version
docker --version
git config --global user.name
echo $GITHUB_ORG  # Should show your org, if not: export GITHUB_ORG="your-org"
```

---

## 🔐 Phase 2: Authentication (5 minutes)

### GitHub CLI Setup
- [ ] Logged in: `gh auth status` shows your username
- [ ] Can list repos: `gh repo list` shows your repos
- [ ] Can access API: `gh api user --jq '.login'` shows your username

**Complete with:**
```bash
gh auth login
# Follow prompts: HTTPS → Authenticate via web
gh auth status
```

### Docker Authentication
- [ ] Can list images (optional): `docker images`
- [ ] Docker daemon running: `docker info` shows no errors

**Verify with:**
```bash
docker info | grep "Docker Root Dir"
```

---

## 🧪 Phase 3: Workflow Testing (10-15 minutes)

### Trigger First Build
- [ ] Push changes to develop: `git push origin develop`
- [ ] Workflow starts: GitHub Actions shows "Build and Push" in progress
- [ ] Linting passes: No lint errors in workflow logs
- [ ] Build succeeds: All services build without errors
- [ ] Images pushed: Workflow shows "Pushed to GHCR"

**Check workflow:**
```bash
gh workflow view build-and-push -v  # Shows recent runs
# Or visit: GitHub → Actions → Build and Push Docker Images
```

### Verify Images in GHCR
- [ ] Images appear: `gh api repos/{owner}/{repo}/packages` shows images
- [ ] Correct naming: Images follow pattern `RENTHUB-MICROSERVICES-API`
- [ ] Tags present: `dev-latest` and `{sha}` tags visible
- [ ] Packages tab shows images: Repository → Packages

**List images:**
```bash
gh api repos/{owner}/{repo}/packages --jq '.[].name'
```

---

## 📥 Phase 4: Local Verification (15 minutes)

### Pull Images
- [ ] Pull auth: `./scripts/pull-image.sh auth dev-latest` succeeds
- [ ] Pull gateway: `./scripts/pull-image.sh gateway dev-latest` succeeds
- [ ] Images show locally: `docker images | grep ghcr` shows images
- [ ] Correct size: Images are reasonable size (not huge)

**Commands:**
```bash
./scripts/pull-image.sh auth dev-latest
./scripts/pull-image.sh gateway dev-latest
docker images | grep ghcr.io
```

### Test Images
- [ ] Auth test: `./scripts/test-image.sh auth dev-latest` starts
- [ ] Container running: `docker ps` shows test container
- [ ] Health check works: Container logs show startup
- [ ] Gateway test: `./scripts/test-image.sh gateway dev-latest` starts

**Commands:**
```bash
./scripts/test-image.sh auth dev-latest
# Wait for test container to start
docker ps | grep test-
docker logs test-auth-dev-latest | head -20
docker stop test-auth-dev-latest
```

### Test docker-compose
- [ ] Override file loads: `docker-compose -f docker-compose.yml -f docker-compose.ghcr.yml config` shows no errors
- [ ] All services configured: Output shows all 6 services
- [ ] GHCR images referenced: Images use `ghcr.io/...`

**Verify:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.ghcr.yml config | head -50
```

---

## 📚 Phase 5: Documentation Review (10 minutes)

### Read Documentation
- [ ] Opened `GHCR-QUICK-REFERENCE.md` for quick commands
- [ ] Reviewed `GHCR-IMAGE-GUIDE.md` for developer workflows
- [ ] Checked `.github/GHCR-SETUP.md` for complete reference
- [ ] Understood tag strategy and image naming

**Quick start:**
```bash
open GHCR-QUICK-REFERENCE.md  # macOS
cat GHCR-QUICK-REFERENCE.md   # Any OS
```

### Understand Workflow
- [ ] Know what build-and-push.yaml does
- [ ] Understand 4-job structure (detect, lint, build, summarize)
- [ ] Know image output format
- [ ] Understand tag strategy

**Review:**
```bash
cat .github/workflows/build-and-push.yaml | head -100
```

---

## 🚀 Phase 6: Team Onboarding (5-10 minutes)

### Share Setup
- [ ] Team members have repository access
- [ ] Team knows where to find documentation
- [ ] Team knows how to pull images
- [ ] Team knows how to test locally

**Share these files:**
- `GHCR-QUICK-REFERENCE.md` - Quick commands
- `GHCR-IMAGE-GUIDE.md` - Developer guide

---

## 🔧 Phase 7: Production Readiness (20 minutes)

### Configure Secrets (if deploying)
- [ ] `INFRASTRUCTURE_REPO_TOKEN` added (if needed)
- [ ] `INFRASTRUCTURE_REPO` secret added (if needed)
- [ ] `SLACK_WEBHOOK` added (optional, for notifications)

**Add secrets at:** Repository Settings → Secrets and variables → Actions

### Review Workflow Settings
- [ ] Workflow permissions: Read and write enabled
- [ ] Default permissions: Read and write
- [ ] Concurrency control: Configured

**Check at:** Repository Settings → Actions → General

### Test Full Deployment Flow
- [ ] Code changes trigger build ✓
- [ ] Tests pass ✓
- [ ] Images build ✓
- [ ] Images pushed ✓
- [ ] Images pullable locally ✓

---

## 📊 Phase 8: Monitoring Setup (Optional)

### GitHub Actions Insights
- [ ] Can view workflow runs: Actions → Build and Push
- [ ] Understand run logs: Each step visible
- [ ] Know where to find errors: Step details
- [ ] Have bookmark: GitHub Actions dashboard

### Slack Notifications (Optional)
- [ ] Slack webhook working (if configured)
- [ ] Test failure notification sent
- [ ] Team receives alerts

---

## 🎯 Phase 9: Documentation Update (5 minutes)

### Update README
- [ ] Repository README mentions GHCR
- [ ] README links to GHCR-QUICK-REFERENCE.md
- [ ] Team knows how to pull and test images
- [ ] Troubleshooting section updated

**Add to main README.md:**
```markdown
## 🐳 Docker Images

Images are automatically built and pushed to GitHub Container Registry.

See [GHCR-QUICK-REFERENCE.md](./GHCR-QUICK-REFERENCE.md) for commands.

### Pull Latest Image
```bash
./scripts/pull-image.sh auth dev-latest
```

### Test Locally
```bash
./scripts/test-image.sh auth dev-latest
```

See [GHCR-IMAGE-GUIDE.md](./GHCR-IMAGE-GUIDE.md) for more.
```

---

## ✅ Phase 10: Final Verification

### Complete Workflow Test
- [ ] Make small code change (add comment)
- [ ] Commit and push: `git push origin develop`
- [ ] Wait for workflow (2-5 min)
- [ ] Workflow succeeds
- [ ] Images in GHCR
- [ ] Pull locally: `./scripts/pull-image.sh`
- [ ] Test locally: `./scripts/test-image.sh`
- [ ] Everything works

### Document Setup
- [ ] Created `.github/SETUP.md` with setup steps
- [ ] Team knows how to reproduce setup
- [ ] Troubleshooting documented
- [ ] Team contacted about new workflow

---

## 🎉 Success Criteria

All of the following should be true:

✅ All 9 files exist and scripts are executable
✅ GitHub CLI authenticated and working
✅ Docker installed and running
✅ First workflow completed successfully
✅ Images appear in GHCR Packages tab
✅ Can pull images locally
✅ Can test images with scripts
✅ docker-compose override works
✅ Team understands the new workflow
✅ Documentation is accessible

---

## 📋 Troubleshooting During Checklist

### If workflow fails to start:
- Check: Repository has GitHub Actions enabled
- Check: Workflow file syntax valid
- Try: Manual trigger via Actions tab

### If images don't appear:
- Check: Workflow completed successfully
- Check: No linting errors in logs
- Try: Refresh page
- Try: `gh api repos/{owner}/{repo}/packages`

### If can't pull images:
- Check: Authenticated: `gh auth status`
- Check: Image exists: `gh api repos/{owner}/{repo}/packages`
- Try: Full path: `docker pull ghcr.io/{org}/{repo}/{service}:tag`
- Try: Force pull: `docker pull --no-cache ghcr.io/...`

### If scripts won't run:
- Check: Executable: `ls -l scripts/*.sh`
- Try: Make executable: `chmod +x scripts/*.sh`
- Try: Full path: `./scripts/pull-image.sh`
- Check: Bash installed: `which bash`

---

## 📞 Getting Help

1. **Check quick reference:** [GHCR-QUICK-REFERENCE.md](./GHCR-QUICK-REFERENCE.md)
2. **Read developer guide:** [GHCR-IMAGE-GUIDE.md](./GHCR-IMAGE-GUIDE.md)
3. **Full documentation:** [.github/GHCR-SETUP.md](./.github/GHCR-SETUP.md)
4. **Check workflow logs:** GitHub Actions tab
5. **Verify setup:** `./scripts/verify-ghcr-setup.sh`

---

## ⏱️ Estimated Time

- Phase 1-2: 10 minutes (setup)
- Phase 3-4: 20 minutes (testing)
- Phase 5-6: 15 minutes (docs)
- Phase 7-10: 30 minutes (production)
- **Total: 75 minutes** (can be parallelized)

---

## 🎯 Next Steps After Completion

1. **Immediate:**
   - [ ] Team trained on new workflow
   - [ ] Documentation shared
   - [ ] Setup verified working

2. **Soon (This Week):**
   - [ ] All team members tested locally
   - [ ] First real deployment tested
   - [ ] Feedback collected

3. **Later (This Month):**
   - [ ] Infrastructure repo created (if GitOps)
   - [ ] ArgoCD configured (if GitOps)
   - [ ] Automated deployments enabled

4. **Future:**
   - [ ] Image vulnerability monitoring
   - [ ] Image retention policies
   - [ ] Performance optimization
   - [ ] Advanced testing integration

---

**Print this checklist and track your progress! ✅**

