#!/bin/bash
# Script to build locally and deploy to Docker without stopping the server

set -e

echo "🚀 Starting build and deploy process..."

cd /opt/routy_dashboard

# Step 1: Build locally (faster and doesn't stop server)
echo "📦 Building project locally..."
NODE_OPTIONS=--max-old-space-size=4096 npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"

# Step 2: Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found!"
    exit 1
fi

# Step 3: Build Docker image with pre-built files using quick compose
echo "🐳 Building Docker image..."
docker compose -f docker-compose.quick.yml build

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

# Step 4: Stop old container (if running)
echo "🛑 Stopping old container..."
docker compose stop routy-dashboard 2>/dev/null || true

# Step 5: Start new container
echo "▶️  Starting new container..."
docker compose -f docker-compose.quick.yml up -d

echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Container status:"
docker ps --filter name=routy_dashboard_app

echo ""
echo "📝 Recent logs:"
docker logs --tail 10 routy_dashboard_app

