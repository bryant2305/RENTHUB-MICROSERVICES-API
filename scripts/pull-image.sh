#!/bin/bash

# =============================================================================
# GHCR Image Pull Helper Script
# 
# Usage: ./pull-image.sh <service> [tag]
# Example: ./pull-image.sh auth latest
#          ./pull-image.sh gateway abc1234
# =============================================================================

set -e

# Configuration
REGISTRY="ghcr.io"
ORG=${GITHUB_ORG:-"your-org"}  # Set via environment or edit here
REPO="RENTHUB-MICROSERVICES-API"
TAG=${2:-"latest"}

# Service name
SERVICE=${1:-""}

if [ -z "$SERVICE" ]; then
    echo "❌ Usage: $0 <service> [tag]"
    echo ""
    echo "Available services:"
    echo "  - gateway"
    echo "  - auth"
    echo "  - user"
    echo "  - property"
    echo "  - reservation"
    echo "  - mail"
    echo ""
    echo "Examples:"
    echo "  $0 auth latest"
    echo "  $0 gateway abc1234"
    exit 1
fi

# Normalize service name
case $SERVICE in
    auth-service|auth)
        SERVICE="auth"
        ;;
    user-service|user)
        SERVICE="user"
        ;;
    gateway)
        SERVICE="gateway"
        ;;
    properties-service|property|properties)
        SERVICE="property"
        ;;
    reservation-service|reservation)
        SERVICE="reservation"
        ;;
    mail-service|mail)
        SERVICE="mail"
        ;;
    *)
        echo "❌ Unknown service: $SERVICE"
        exit 1
        ;;
esac

# Construct image URL
IMAGE="${REGISTRY}/${ORG}/${REPO}/${SERVICE}:${TAG}"

echo "🔐 Ensuring GHCR authentication..."
if command -v gh &> /dev/null; then
    # Using GitHub CLI
    gh auth login || true
else
    echo "⚠️  GitHub CLI not found. Using docker login..."
    echo "⚠️  You'll need to enter your credentials or PAT"
fi

echo ""
echo "📥 Pulling image: $IMAGE"
docker pull "$IMAGE"

echo ""
echo "✅ Successfully pulled: $IMAGE"
echo ""
echo "🚀 To run this image:"
echo "   docker run -it $IMAGE"
