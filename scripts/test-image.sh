#!/bin/bash

# =============================================================================
# Local Image Testing Script
#
# Tests a service image locally with basic health checks
# 
# Usage: ./test-image.sh <service> [tag]
# Example: ./test-image.sh auth latest
#          ./test-image.sh gateway dev-latest
# =============================================================================

set -e

REGISTRY="ghcr.io"
ORG=${GITHUB_ORG:-"your-org"}
REPO="RENTHUB-MICROSERVICES-API"
TAG=${2:-"latest"}
SERVICE=${1:-""}

if [ -z "$SERVICE" ]; then
    echo "❌ Usage: $0 <service> [tag]"
    exit 1
fi

# Normalize service name
case $SERVICE in
    auth-service|auth)
        SERVICE="auth"
        PORT=3010
        ;;
    user-service|user)
        SERVICE="user"
        PORT=3000
        ;;
    gateway)
        SERVICE="gateway"
        PORT=3333
        ;;
    properties-service|property|properties)
        SERVICE="property"
        PORT=3003
        ;;
    reservation-service|reservation)
        SERVICE="reservation"
        PORT=3004
        ;;
    mail-service|mail)
        SERVICE="mail"
        PORT=3006
        ;;
    *)
        echo "❌ Unknown service: $SERVICE"
        exit 1
        ;;
esac

IMAGE="${REGISTRY}/${ORG}/${REPO}/${SERVICE}:${TAG}"
CONTAINER_NAME="test-${SERVICE}-${TAG}"

# Clean up old container if exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "🧹 Cleaning up old container..."
    docker stop "${CONTAINER_NAME}" 2>/dev/null || true
    docker rm "${CONTAINER_NAME}" 2>/dev/null || true
fi

echo "📦 Testing image: $IMAGE"
echo ""

# Pull image
echo "📥 Pulling image..."
if ! docker pull "$IMAGE"; then
    echo "❌ Failed to pull image"
    echo ""
    echo "💡 Make sure you're authenticated to GHCR:"
    echo "   gh auth login"
    echo "   docker login ghcr.io"
    exit 1
fi

echo "✅ Image pulled"
echo ""

# Run container
echo "🏃 Starting container..."
docker run -d \
    --name "$CONTAINER_NAME" \
    -e NODE_ENV=development \
    -e LOG_LEVEL=debug \
    -p "${PORT}:${PORT}" \
    "$IMAGE" || {
        echo "❌ Failed to start container"
        docker logs "$CONTAINER_NAME" || true
        exit 1
    }

echo "✅ Container started: $CONTAINER_NAME"
echo ""

# Wait for startup
echo "⏳ Waiting for service to initialize (10 seconds)..."
sleep 10

# Check if container is still running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "❌ Container exited. Checking logs..."
    docker logs "$CONTAINER_NAME"
    exit 1
fi

echo "✅ Container is running"
echo ""

# Try health check
echo "🔍 Attempting health check on localhost:${PORT}/health..."
if docker exec "$CONTAINER_NAME" \
    wget -q -O- http://localhost:${PORT}/health 2>/dev/null || \
   docker exec "$CONTAINER_NAME" \
    curl -s http://localhost:${PORT}/health >/dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "⚠️  Health check endpoint not responding (might still be starting)"
fi

echo ""
echo "📋 Container Status:"
docker ps --filter "name=$CONTAINER_NAME" \
    --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "📝 Container Logs (last 20 lines):"
docker logs "$CONTAINER_NAME" | tail -20

echo ""
echo "=== Test Complete ==="
echo ""
echo "ℹ️  To view all logs:"
echo "   docker logs -f $CONTAINER_NAME"
echo ""
echo "ℹ️  To stop container:"
echo "   docker stop $CONTAINER_NAME"
echo ""
echo "ℹ️  To remove container:"
echo "   docker rm $CONTAINER_NAME"
echo ""
echo "ℹ️  To access container shell:"
echo "   docker exec -it $CONTAINER_NAME /bin/sh"
