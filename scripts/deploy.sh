#!/bin/bash

echo "🚀 Deploying DevLink Application..."

# Build and start services
echo "📦 Building and starting services..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ DevLink deployed successfully!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:8080"
    echo "📊 Database: localhost:5432"
else
    echo "❌ Deployment failed. Check logs:"
    docker-compose logs
fi