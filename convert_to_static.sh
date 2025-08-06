#!/bin/bash

echo "🔄 Converting wedding website to static..."

# 1. Export latest database to CSV
echo "📊 Exporting database..."
bash export_db_to_csv.sh

# 2. Convert CSV to JSON
echo "🔄 Converting CSV to JSON..."
python3 csv_to_json_simple.py

# 3. Create static website directory
echo "📁 Creating static website..."
STATIC_DIR="wedding_static"
rm -rf "$STATIC_DIR"
mkdir -p "$STATIC_DIR"

# 4. Copy frontend files
cp -r frontend/* "$STATIC_DIR/"

# 5. Update to use static JS
cp frontend/js/main_static.js "$STATIC_DIR/js/main.js"

# 6. Create simple HTTP server script
cat > "$STATIC_DIR/serve.py" << 'EOF'
#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 8000
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()
EOF

chmod +x "$STATIC_DIR/serve.py"

echo "✅ Static website created in '$STATIC_DIR' directory"
echo "🚀 To serve locally: cd $STATIC_DIR && python3 serve.py"
echo "🌐 Or upload the '$STATIC_DIR' folder to any web hosting service"