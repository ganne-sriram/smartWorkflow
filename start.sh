#!/bin/bash

echo "========================================="
echo "Core Operations Hub - Starting Services"
echo "========================================="
echo ""

echo "Building and starting containers..."
docker-compose up --build -d

echo ""
echo "Waiting for services to start..."
sleep 10

echo ""
echo "========================================="
echo "Application Started Successfully!"
echo "========================================="
echo ""
echo "Access the application:"
echo "  Frontend:  http://localhost:4200"
echo "  Backend:   http://localhost:8080"
echo "  MongoDB:   localhost:27017"
echo ""
echo "Login Credentials:"
echo "  Designer: designer1 / password123"
echo "  Viewer:   viewer1 / password123"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop services:"
echo "  docker-compose down"
echo ""
