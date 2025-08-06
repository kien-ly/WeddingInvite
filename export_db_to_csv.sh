#!/bin/bash

# Create export directory with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
EXPORT_DIR="database_exports"
mkdir -p "$EXPORT_DIR"

echo "Exporting database tables to CSV..."

# Export wishes table
sudo -u postgres psql -d wedding_db -c "\COPY wishes TO '/tmp/wishes.csv' WITH CSV HEADER;"

# Export confirmations table  
sudo -u postgres psql -d wedding_db -c "\COPY confirmations TO '/tmp/confirmations.csv' WITH CSV HEADER;"

# Move files to export directory
sudo mv /tmp/wishes.csv "$EXPORT_DIR/"
sudo mv /tmp/confirmations.csv "$EXPORT_DIR/"
sudo chown ubuntu:ubuntu "$EXPORT_DIR"/*.csv

echo "Export completed in directory: $EXPORT_DIR"
echo "Files created:"
ls -la "$EXPORT_DIR"