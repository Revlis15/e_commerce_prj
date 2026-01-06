#!/bin/bash

echo "Stopping backend container..."
docker stop ecommerce_backend

echo "Removing old backend container..."
docker rm ecommerce_backend

echo "Rebuilding backend image..."
docker-compose build --no-cache backend

echo "Starting backend container..."
docker-compose up -d backend

echo "Waiting for backend to start..."
sleep 10

echo "Checking backend status..."
docker ps | grep ecommerce_backend

echo "Checking backend logs..."
docker logs ecommerce_backend --tail 20

echo "Done! Backend has been rebuilt."
