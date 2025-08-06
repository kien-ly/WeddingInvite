#!/usr/bin/env python3
import pandas as pd
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
    
    # Convert wishes
    wishes_df = pd.read_csv(f"{latest_dir}/wishes.csv")
    wishes_json = wishes_df.to_dict('records')
    
    # Convert confirmations  
    confirmations_df = pd.read_csv(f"{latest_dir}/confirmations.csv")
    confirmations_json = confirmations_df.to_dict('records')
    
    # Create data directory
    os.makedirs('frontend/data', exist_ok=True)
    
    # Save JSON files
    with open('frontend/data/wishes.json', 'w', encoding='utf-8') as f:
        json.dump(wishes_json, f, ensure_ascii=False, indent=2, default=str)
    
    with open('frontend/data/confirmations.json', 'w', encoding='utf-8') as f:
        json.dump(confirmations_json, f, ensure_ascii=False, indent=2, default=str)
    
    print(f"✓ Created frontend/data/wishes.json ({len(wishes_json)} records)")
    print(f"✓ Created frontend/data/confirmations.json ({len(confirmations_json)} records)")

if __name__ == "__main__":
    csv_to_json()