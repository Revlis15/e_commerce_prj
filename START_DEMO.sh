#!/bin/bash

echo "🚀 Starting E-Commerce Platform..."

# Start all services
echo "📦 Starting Docker containers..."
docker-compose up -d

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Initialize database
echo "🗄️  Initializing database..."
docker exec -i ecommerce_postgres psql -U postgres -d ecommerce_db < init-db.sql

echo ""
echo "✅ System is ready!"
echo ""
echo "🌐 Frontend: http://localhost"
echo "🔌 Backend API: http://localhost:3000"
echo ""
echo "📝 To view logs:"
echo "   docker logs -f ecommerce_backend"
echo "   docker logs -f ecommerce_frontend"
echo ""
echo "🛑 To stop:"
echo "   docker-compose down"
echo ""
