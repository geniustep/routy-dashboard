#!/bin/bash
# Script to start Routy Dashboard without stopping the server

cd /opt/routy_dashboard

# Check if container is running
if docker ps --format '{{.Names}}' | grep -q "^routy_dashboard_app$"; then
    echo "Container is already running. Restarting..."
    docker compose restart routy-dashboard
else
    echo "Starting container..."
    docker compose up -d
fi

echo "Container status:"
docker ps --filter name=routy_dashboard_app

