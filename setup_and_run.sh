#!/bin/bash

# Script to set up the wedding project on a fresh Ubuntu EC2 instance.
# This script will:
# 1. Update package lists.
# 2. Install Python3 venv, PostgreSQL, Nginx.
# 3. Configure PostgreSQL (create user and database).
# 4. Set up Python virtual environment for the backend.
# 5. Install Python dependencies.
# 6. Create .env file for the backend.
# 7. Configure Nginx to serve frontend and proxy backend.
# 8. Start the FastAPI backend with Uvicorn.

# --- Configuration Variables (Customize if needed) ---
PROJECT_DIR_NAME="wedding_project" # Tên thư mục dự án khi clone
GIT_REPO_URL="https://github.com/kien-ly/WeddingInvite" # <<<<<<< THAY THẾ BẰNG URL REPO CỦA BẠN

DEFAULT_DB_USER="wedding_user"
DEFAULT_DB_PASS="pw123" # <<<<<<< THAY ĐỔI MẬT KHẨU MẠNH HƠN
DEFAULT_DB_NAME="wedding_db"
DB_HOST="localhost"
DB_PORT="5432"

PYTHON_VERSION="python3" # Hoặc python3.9, python3.10 tùy theo instance có sẵn
VENV_NAME="venv"
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"
UVICORN_HOST="127.0.0.1" # Uvicorn chỉ lắng nghe trên localhost, Nginx sẽ public ra ngoài
UVICORN_PORT="8000"

# --- Helper Functions ---
print_info() {
    echo -e "\n\033[1;34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

print_error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        print_error "$1 could not be found. Please install it or check your PATH."
        exit 1
    fi
}

# --- Main Script ---
print_info "Starting Wedding Project Setup on EC2 Ubuntu..."

# 0. Check if running as root/sudo
if [ "$(id -u)" -ne 0 ]; then
    print_error "This script must be run with sudo or as root."
    print_info "Example: sudo ./setup_and_run.sh"
    exit 1
fi

# Check if git is installed (needed to clone the project)
if ! command -v git &> /dev/null; then
    print_info "Git not found. Installing git..."
    apt-get update -y
    apt-get install -y git
fi

# 1. Clone the project (if not already in the project directory)
# This script assumes it's being run FROM INSIDE the cloned project directory.
# If you want the script to clone it, uncomment the following lines and adjust.
# CURRENT_DIR_NAME=${PWD##*/}
# if [ "$CURRENT_DIR_NAME" != "$PROJECT_DIR_NAME" ]; then
#     if [ -d "$PROJECT_DIR_NAME" ]; then
#         print_info "Project directory '$PROJECT_DIR_NAME' already exists. Skipping clone."
#     else
#         print_info "Cloning project from $GIT_REPO_URL..."
#         git clone "$GIT_REPO_URL" "$PROJECT_DIR_NAME"
#         if [ $? -ne 0 ]; then
#             print_error "Failed to clone repository. Aborting."
#             exit 1
#         fi
#     fi
#     cd "$PROJECT_DIR_NAME" || { print_error "Failed to cd into $PROJECT_DIR_NAME. Aborting."; exit 1; }
# else
#     print_info "Already inside project directory '$PROJECT_DIR_NAME'."
# fi
# Make sure we are in the project's root directory for relative paths
if [ ! -f "README.md" ] || [ ! -d "$BACKEND_DIR" ] || [ ! -d "$FRONTEND_DIR" ]; then
    print_error "Script is not being run from the root of the '$PROJECT_DIR_NAME' directory."
    print_error "Please 'cd $PROJECT_DIR_NAME' and run the script from there."
    exit 1
fi
PROJECT_ROOT_PATH=$(pwd)


# 2. System Updates and Essential Packages
print_info "Updating system packages and installing dependencies..."
apt-get update -y
apt-get install -y $PYTHON_VERSION-venv postgresql postgresql-contrib nginx curl

# Verify installations
check_command $PYTHON_VERSION
check_command psql
check_command nginx

# 3. Configure PostgreSQL
print_info "Configuring PostgreSQL..."
# Prompt for database credentials or use defaults
read -p "Enter PostgreSQL Database User for the app (default: $DEFAULT_DB_USER): " DB_USER
DB_USER=${DB_USER:-$DEFAULT_DB_USER}

read -s -p "Enter password for $DB_USER (default: $DEFAULT_DB_PASS - PRESS ENTER FOR DEFAULT): " DB_PASS_INPUT
echo ""
DB_PASS=${DB_PASS_INPUT:-$DEFAULT_DB_PASS}


read -p "Enter Database Name for the app (default: $DEFAULT_DB_NAME): " DB_NAME
DB_NAME=${DB_NAME:-$DEFAULT_DB_NAME}

# Check if user exists
SUDO_PG="sudo -u postgres psql -tAc"

if $SUDO_PG "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
    print_warning "PostgreSQL user '$DB_USER' already exists. Skipping creation."
else
    print_info "Creating PostgreSQL user '$DB_USER'..."
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
    if [ $? -ne 0 ]; then print_warning "Failed to create PostgreSQL user (maybe it exists with different casing or a conflict)."; fi
fi

# Check if database exists
if $SUDO_PG "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
    print_warning "PostgreSQL database '$DB_NAME' already exists. Skipping creation."
else
    print_info "Creating PostgreSQL database '$DB_NAME'..."
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
    if [ $? -ne 0 ]; then print_warning "Failed to create PostgreSQL database."; fi
fi

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
if [ $? -ne 0 ]; then print_warning "Failed to grant privileges. Check user/db names."; fi


# 4. Set up Python Virtual Environment for Backend
print_info "Setting up Python virtual environment for backend..."
cd "$PROJECT_ROOT_PATH/$BACKEND_DIR" || { print_error "Backend directory '$BACKEND_DIR' not found. Aborting."; exit 1; }

if [ -d "$VENV_NAME" ]; then
    print_warning "Virtual environment '$VENV_NAME' already exists. Skipping creation."
else
    $PYTHON_VERSION -m venv $VENV_NAME
    if [ $? -ne 0 ]; then
        print_error "Failed to create virtual environment. Aborting."
        exit 1
    fi
fi

print_info "Activating virtual environment and installing dependencies..."
source "$VENV_NAME/bin/activate"

if [ ! -f "requirements.txt" ]; then
    print_error "requirements.txt not found in $BACKEND_DIR. Aborting."
    deactivate
    exit 1
fi
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    print_error "Failed to install Python dependencies. Aborting."
    deactivate
    exit 1
fi

# 5. Create .env file for Backend
print_info "Creating .env file for backend..."
if [ -f ".env" ]; then
    print_warning ".env file already exists. Checking/Updating DATABASE_URL."
else
    if [ ! -f ".env_example" ]; then
        print_error ".env_example not found. Cannot create .env file. Aborting."
        deactivate
        exit 1
    fi
    cp .env_example .env
fi

DB_CONN_STRING="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
# Use a robust way to update/set DATABASE_URL in .env to avoid issues with special characters in password
# Check if DATABASE_URL line exists
if grep -q "^DATABASE_URL=" .env; then
    # If exists, replace it
    sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=${DB_CONN_STRING}|" .env
else
    # If not, append it
    echo "DATABASE_URL=${DB_CONN_STRING}" >> .env
fi
[ -f .env.bak ] && rm .env.bak
print_success ".env file configured."

# Deactivate virtual environment for now, will be activated by Uvicorn runner later
# deactivate (Uvicorn will be run from within the venv via the script below)

cd "$PROJECT_ROOT_PATH" # Go back to project root

# 6. Configure Nginx
print_info "Configuring Nginx..."
# Prompt for domain name (optional, otherwise will use IP address)
read -p "Enter your domain name (e.g., mywedding.com, leave blank to use IP): " DOMAIN_NAME
SERVER_NAME_CONF=""
if [ -z "$DOMAIN_NAME" ]; then
    # Get public IP of EC2 instance
    EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || curl -s ifconfig.me)
    if [ -z "$EC2_PUBLIC_IP" ]; then
        print_warning "Could not automatically determine public IP. Using 'localhost' for Nginx server_name. You might need to adjust Nginx config manually."
        SERVER_NAME_CONF="localhost"
    else
        SERVER_NAME_CONF="$EC2_PUBLIC_IP"
    fi
else
    SERVER_NAME_CONF="$DOMAIN_NAME www.$DOMAIN_NAME"
fi

NGINX_CONF_FILE="/etc/nginx/sites-available/wedding_project"
NGINX_ENABLED_FILE="/etc/nginx/sites-enabled/wedding_project"

print_info "Creating Nginx configuration for $SERVER_NAME_CONF"
# Nginx configuration
cat > "$NGINX_CONF_FILE" <<EOL
server {
    listen 80;
    server_name $SERVER_NAME_CONF;

    # Serve frontend static files
    location / {
        root $PROJECT_ROOT_PATH/$FRONTEND_DIR;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html; # Important for single-page apps if you use client-side routing
    }

    # Proxy API requests to backend FastAPI
    location /api {
        proxy_pass http://$UVICORN_HOST:$UVICORN_PORT; # FastAPI running on uvicorn
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Optional: Deny access to .env or other sensitive files if they were accidentally put in web root
    location ~ /\.env {
        deny all;
    }
    location ~ /\.git {
        deny all;
    }
}
EOL

# Enable the site by creating a symlink
if [ -L "$NGINX_ENABLED_FILE" ]; then
    rm "$NGINX_ENABLED_FILE"
fi
ln -s "$NGINX_CONF_FILE" "$NGINX_ENABLED_FILE"

# Test Nginx configuration and reload
nginx -t
if [ $? -ne 0 ]; then
    print_error "Nginx configuration test failed. Please check $NGINX_CONF_FILE"
    print_error "You can try: sudo cat $NGINX_CONF_FILE"
    print_error "And: sudo nginx -t"
    # exit 1 # Don't exit, let user try to fix
else
    print_info "Reloading Nginx..."
    systemctl reload nginx
    if [ $? -ne 0 ]; then print_warning "Failed to reload Nginx. Service might not be running or config error persists."; fi
fi

# 7. Start Backend FastAPI Server
print_info "Starting FastAPI backend server with Uvicorn..."
print_info "Backend will run in the background. Check logs or use 'pgrep uvicorn' to see if it's running."

# Create a small script to run Uvicorn in the venv and nohup it
RUN_BACKEND_SCRIPT="$PROJECT_ROOT_PATH/run_backend.sh"
cat > "$RUN_BACKEND_SCRIPT" <<EOL
#!/bin/bash
cd "$PROJECT_ROOT_PATH/$BACKEND_DIR" || exit
source "$VENV_NAME/bin/activate"
echo "Starting Uvicorn on $UVICORN_HOST:$UVICORN_PORT from $(pwd)" >> uvicorn.log
nohup uvicorn app.main:app --host $UVICORN_HOST --port $UVICORN_PORT >> uvicorn.log 2>&1 &
echo \$! > uvicorn.pid
echo "Uvicorn started with PID \$(cat uvicorn.pid). Log: $PROJECT_ROOT_PATH/$BACKEND_DIR/uvicorn.log"
deactivate
EOL
chmod +x "$RUN_BACKEND_SCRIPT"

# Run the script to start uvicorn
"$RUN_BACKEND_SCRIPT"

# Give it a couple of seconds to start
sleep 3
if ps -p "$(cat $PROJECT_ROOT_PATH/$BACKEND_DIR/uvicorn.pid 2>/dev/null)" > /dev/null 2>&1; then
    print_success "Uvicorn backend seems to be running."
else
    print_error "Uvicorn backend may not have started correctly. Check $PROJECT_ROOT_PATH/$BACKEND_DIR/uvicorn.log"
    print_error "Try running manually: cd $PROJECT_ROOT_PATH/$BACKEND_DIR && source $VENV_NAME/bin/activate && uvicorn app.main:app --host $UVICORN_HOST --port $UVICORN_PORT"
fi

# 8. Final Instructions
print_success "Setup script finished!"
echo ""
print_info "-------------------------------------------------------------------"
print_info "ACCESS YOUR WEBSITE:"
if [ -z "$DOMAIN_NAME" ]; then
    print_info "Frontend: http://$EC2_PUBLIC_IP"
    print_info "Backend API base (proxied): http://$EC2_PUBLIC_IP/api"
else
    print_info "Frontend: http://$DOMAIN_NAME (and http://www.$DOMAIN_NAME if configured)"
    print_info "Backend API base (proxied): http://$DOMAIN_NAME/api"
fi
print_info "API Docs (via proxy): http://${SERVER_NAME_CONF%% *}/api/docs"
print_info "-------------------------------------------------------------------"
print_info "IMPORTANT NOTES:"
print_info "- Ensure your EC2 instance's Security Group allows inbound traffic on port 80 (HTTP)."
print_info "- The Uvicorn backend is running via 'nohup'. For robust production, consider using a process manager like systemd or Supervisor."
print_info "  Uvicorn PID is stored in: $PROJECT_ROOT_PATH/$BACKEND_DIR/uvicorn.pid"
print_info "  Uvicorn logs are in: $PROJECT_ROOT_PATH/$BACKEND_DIR/uvicorn.log"
print_info "- To stop Uvicorn: kill \$(cat $PROJECT_ROOT_PATH/$BACKEND_DIR/uvicorn.pid)"
print_info "- To restart Nginx: sudo systemctl restart nginx"
print_info "- For HTTPS, you'll need to configure SSL (e.g., with Let's Encrypt and Certbot)."
print_info "-------------------------------------------------------------------"