#!/bin/bash

# Create backup directory
mkdir -p backups

# Backup database
echo "💾 Creating database backup..."
docker-compose exec -T postgres pg_dump -U devlink devlink > backups/devlink_$(date +%Y%m%d_%H%M%S).sql

echo "✅ Backup completed!"