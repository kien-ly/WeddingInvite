#!/usr/bin/env python3
import csv
import json
import os

def csv_to_json():
    # Find latest export directory
    export_dirs = [d for d in os.listdir('.') if d.startswith('database_exports_')]
    if not export_dirs:
        print("No export directories found")
        return
    
    latest_dir = sorted(export_dirs)[-1]
    print(f"Using data from: {latest_dir}")
    
    # Create data directory
    os.makedirs('frontend/data', exist_ok=True)
    
    # Convert wishes
    wishes = []
    with open(f"{latest_dir}/wishes.csv", 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        wishes = list(reader)
    
    # Convert confirmations
    confirmations = []
    with open(f"{latest_dir}/confirmations.csv", 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        confirmations = list(reader)
    
    # Save JSON files
    with open('frontend/data/wishes.json', 'w', encoding='utf-8') as f:
        json.dump(wishes, f, ensure_ascii=False, indent=2)
    
    with open('frontend/data/confirmations.json', 'w', encoding='utf-8') as f:
        json.dump(confirmations, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Created frontend/data/wishes.json ({len(wishes)} records)")
    print(f"✓ Created frontend/data/confirmations.json ({len(confirmations)} records)")

if __name__ == "__main__":
    csv_to_json()