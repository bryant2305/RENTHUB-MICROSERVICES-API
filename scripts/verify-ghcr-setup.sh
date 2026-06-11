#!/bin/bash

# =============================================================================
# GHCR Setup Verification Script
#
# Checks if GHCR integration is properly set up
# Usage: ./scripts/verify-ghcr-setup.sh
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

# Helper functions
check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

check_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Print header
echo ""
echo "=========================================="
echo "GHCR Setup Verification"
echo "=========================================="
echo ""

# 1. Check workflow files
echo "📋 Checking workflow files..."
if [ -f ".github/workflows/build-and-push.yaml" ]; then
    check_pass "Workflow file exists: .github/workflows/build-and-push.yaml"
else
    check_fail "Workflow file missing: .github/workflows/build-and-push.yaml"
fi

# 2. Check documentation
echo ""
echo "📚 Checking documentation..."
if [ -f ".github/GHCR-SETUP.md" ]; then
    check_pass "GHCR documentation found: .github/GHCR-SETUP.md"
else
    check_fail "GHCR documentation missing: .github/GHCR-SETUP.md"
fi

if [ -f "GHCR-IMAGE-GUIDE.md" ]; then
    check_pass "Image guide found: GHCR-IMAGE-GUIDE.md"
else
    check_fail "Image guide missing: GHCR-IMAGE-GUIDE.md"
fi

if [ -f "GHCR-SETUP-COMPLETE.md" ]; then
    check_pass "Setup summary found: GHCR-SETUP-COMPLETE.md"
else
    check_fail "Setup summary missing: GHCR-SETUP-COMPLETE.md"
fi

# 3. Check helper scripts
echo ""
echo "🔧 Checking helper scripts..."
if [ -f "scripts/pull-image.sh" ]; then
    if [ -x "scripts/pull-image.sh" ]; then
        check_pass "Script is executable: scripts/pull-image.sh"
    else
        check_warn "Script exists but not executable: scripts/pull-image.sh"
        echo "   Run: chmod +x scripts/pull-image.sh"
    fi
else
    check_fail "Script missing: scripts/pull-image.sh"
fi

if [ -f "scripts/test-image.sh" ]; then
    if [ -x "scripts/test-image.sh" ]; then
        check_pass "Script is executable: scripts/test-image.sh"
    else
        check_warn "Script exists but not executable: scripts/test-image.sh"
        echo "   Run: chmod +x scripts/test-image.sh"
    fi
else
    check_fail "Script missing: scripts/test-image.sh"
fi

# 4. Check docker-compose override
echo ""
echo "🐳 Checking Docker Compose..."
if [ -f "docker-compose.ghcr.yml" ]; then
    check_pass "Docker Compose override found: docker-compose.ghcr.yml"
    
    # Validate YAML
    if command -v yq &> /dev/null; then
        if yq eval '.' docker-compose.ghcr.yml > /dev/null 2>&1; then
            check_pass "Docker Compose YAML is valid"
        else
            check_fail "Docker Compose YAML is invalid"
        fi
    else
        check_warn "yq not installed, skipping YAML validation"
    fi
else
    check_fail "Docker Compose override missing: docker-compose.ghcr.yml"
fi

# 5. Check GitHub configuration
echo ""
echo "🔐 Checking GitHub configuration..."
if command -v gh &> /dev/null; then
    check_pass "GitHub CLI installed"
    
    # Check authentication
    if gh auth status > /dev/null 2>&1; then
        USERNAME=$(gh api user --jq '.login')
        check_pass "GitHub CLI authenticated as: $USERNAME"
    else
        check_fail "GitHub CLI not authenticated"
        check_info "Run: gh auth login"
    fi
else
    check_fail "GitHub CLI not installed"
    check_info "Install from: https://cli.github.com"
fi

# 6. Check Docker
echo ""
echo "🐳 Checking Docker..."
if command -v docker &> /dev/null; then
    check_pass "Docker is installed"
    DOCKER_VERSION=$(docker --version)
    check_info "$DOCKER_VERSION"
else
    check_fail "Docker is not installed"
    check_info "Install from: https://docs.docker.com/get-docker/"
fi

# 7. Check environment variables
echo ""
echo "🌍 Checking environment variables..."
if [ -n "$GITHUB_ORG" ]; then
    check_pass "GITHUB_ORG is set: $GITHUB_ORG"
else
    check_warn "GITHUB_ORG not set"
    check_info "Set with: export GITHUB_ORG='your-org'"
fi

# 8. Check git configuration
echo ""
echo "📊 Checking Git configuration..."
if command -v git &> /dev/null; then
    check_pass "Git is installed"
    
    if git config user.name > /dev/null 2>&1; then
        GIT_USER=$(git config user.name)
        check_pass "Git user configured: $GIT_USER"
    else
        check_warn "Git user not configured"
        check_info "Configure with: git config --global user.name 'Your Name'"
    fi
    
    if git config user.email > /dev/null 2>&1; then
        GIT_EMAIL=$(git config user.email)
        check_pass "Git email configured: $GIT_EMAIL"
    else
        check_warn "Git email not configured"
        check_info "Configure with: git config --global user.email 'you@example.com'"
    fi
else
    check_fail "Git is not installed"
fi

# 9. Check Kubernetes tools (optional)
echo ""
echo "☸️  Checking Kubernetes tools (optional)..."
if command -v kubectl &> /dev/null; then
    check_pass "kubectl is installed"
else
    check_warn "kubectl not installed (needed for K8s deployment)"
fi

if command -v helm &> /dev/null; then
    check_pass "Helm is installed"
else
    check_warn "Helm not installed (needed for K8s deployment)"
fi

# 10. Summary
echo ""
echo "=========================================="
echo "Verification Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo "=========================================="

if [ $FAIL -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 All checks passed! Setup is complete.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Make sure GITHUB_ORG is set:"
    echo "   export GITHUB_ORG='your-github-org'"
    echo ""
    echo "2. Test the workflow:"
    echo "   git push origin develop"
    echo "   # Wait 2-5 minutes for workflow"
    echo ""
    echo "3. Pull and test an image:"
    echo "   ./scripts/pull-image.sh auth dev-latest"
    echo "   ./scripts/test-image.sh auth dev-latest"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}⚠️  Some checks failed. Please fix the issues above.${NC}"
    echo ""
    echo "For help, see:"
    echo "- GHCR-SETUP-COMPLETE.md"
    echo "- .github/GHCR-SETUP.md"
    echo "- GHCR-IMAGE-GUIDE.md"
    echo ""
    exit 1
fi
