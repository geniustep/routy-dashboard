#!/bin/bash
# Script to rebuild and update without stopping the server

cd /opt/routy_dashboard

echo "Building new image..."
docker compose build

echo "Stopping old container..."
docker compose stop routy-dashboard

echo "Starting new container..."
docker compose up -d

echo "Container status:"
docker ps --filter name=routy_dashboard_app

echo "Logs (last 20 lines):"
docker logs --tail 20 routy_dashboard_app

