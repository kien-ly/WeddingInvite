#!/bin/bash

# Wedding Project EC2 Setup Script
# Assumes it's run from the project's root directory with sudo.

# --- Configuration ---
GIT_REPO_URL="<your-git-repository-url-here>" # !!! REPLACE THIS !!!
PROJECT_DIR_NAME_IN_HOME="wedding_project" # Name of the project directory in /home/ubuntu

DB_USER="wedding_user"
DB_PASS="pw" # !!! CHANGE THIS IN PRODUCTION !!!
DB_NAME="wedding_db"
DB_HOST="localhost"
DB_PORT="5432"

PYTHON_VERSION="python3" # Adjust if your EC2 instance has a specific python3.x
VENV_NAME="venv"
BACKEND_DIR_REL="backend" # Relative to project root
FRONTEND_DIR_REL="frontend" # Relative to project root

UVICORN_HOST="127.0.0.1" # Uvicorn listens locally, Nginx proxies
UVICORN_PORT="8000"
NGINX_USER="www-data" # Default Nginx user on Ubuntu

# --- Helper Functions ---
print_info() { echo -e "\n\033[1;34m[INFO]\033[0m $1"; }
print_success() { echo -e "\033[1;32m[SUCCESS]\033[0m $1"; }
print_warning() { echo -e "\033[1;33m[WARNING]\033[0m $1"; }
print_error() { echo -e "\033[1;31m[ERROR]\033[0m $1"; }
exit_if_error() { if [ $? -ne 0 ]; then print_error "$1"; exit 1; fi }

# --- Main Script ---
print_info "Starting Wedding Project Setup on EC2 Ubuntu..."

# 0. Pre-flight Checks
if [ "$(id -u)" -ne 0 ]; then print_error "This script must be run with sudo."; exit 1; fi
if ! command -v git &> /dev/null; then apt-get update -y >/dev/null && apt-get install -y git >/dev/null; fi
exit_if_error "Git installation failed."

# Define PROJECT_ROOT_PATH based on where the script is run from
# This script is intended to be run from the project root after cloning.
PROJECT_ROOT_PATH=$(pwd)
if [[ ! "$PROJECT_ROOT_PATH" == *"$PROJECT_DIR_NAME_IN_HOME"* ]] || \
   [ ! -f "$PROJECT_ROOT_PATH/README.md" ] || \
   [ ! -d "$PROJECT_ROOT_PATH/$BACKEND_DIR_REL" ]; then
    print_error "Script is not being run from the root of the project directory ('$PROJECT_DIR_NAME_IN_HOME'), or project structure is incorrect."
    print_error "Expected path to contain '$PROJECT_DIR_NAME_IN_HOME' and have README.md, $BACKEND_DIR_REL/ etc."
    print_error "Current path: $PROJECT_ROOT_PATH"
    # exit 1 # Commented out to allow running if structure is slightly different but intentional
fi
print_info "Project root identified as: $PROJECT_ROOT_PATH"


# 1. System Packages
print_info "Updating system packages and installing dependencies (Python, PostgreSQL, Nginx)..."
apt-get update -y >/dev/null
apt-get install -y ${PYTHON_VERSION}-venv postgresql postgresql-contrib libpq-dev nginx curl >/dev/null
exit_if_error "Failed to install system packages."
if ! command -v $PYTHON_VERSION &> /dev/null; then print_error "$PYTHON_VERSION not found after install."; exit 1; fi
if ! command -v psql &> /dev/null; then print_error "psql not found after install."; exit 1; fi
if ! command -v nginx &> /dev/null; then print_error "nginx not found after install."; exit 1; fi

# 2. Configure PostgreSQL
print_info "Configuring PostgreSQL..."
# Prompt for DB credentials or use defaults (less interactive for EC2 setup)
# For EC2, it's often better to use predefined values or manage secrets externally.
# DB_USER, DB_PASS, DB_NAME are defined at the top.

# Ensure PostgreSQL service is running
systemctl start postgresql
systemctl enable postgresql

# Create DB User if not exists
if (cd /tmp && sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'") | grep -q 1; then
    print_warning "PostgreSQL user '$DB_USER' already exists."
else
    print_info "Creating PostgreSQL user '$DB_USER'..."
    (cd /tmp && sudo -u postgres psql -c "CREATE USER \"$DB_USER\" WITH PASSWORD '$DB_PASS';")
    exit_if_error "Failed to create PostgreSQL user '$DB_USER'."
fi

# Create DB if not exists
if (cd /tmp && sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'") | grep -q 1; then
    print_warning "PostgreSQL database '$DB_NAME' already exists."
else
    print_info "Creating PostgreSQL database '$DB_NAME'..."
    (cd /tmp && sudo -u postgres psql -c "CREATE DATABASE \"$DB_NAME\" OWNER \"$DB_USER\";")
    exit_if_error "Failed to create PostgreSQL database '$DB_NAME'."
fi

# Grant privileges
(cd /tmp && sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$DB_NAME\" TO \"$DB_USER\";")
exit_if_error "Failed to grant privileges to user '$DB_USER' on database '$DB_NAME'."
print_success "PostgreSQL configured."

# 3. Set up Python Backend
print_info "Setting up Python backend..."
BACKEND_ABS_PATH="$PROJECT_ROOT_PATH/$BACKEND_DIR_REL"
cd "$BACKEND_ABS_PATH" || { print_error "Backend directory '$BACKEND_ABS_PATH' not found."; exit 1; }

if [ ! -d "$VENV_NAME" ]; then
    print_info "Creating Python virtual environment '$VENV_NAME'..."
    $PYTHON_VERSION -m venv $VENV_NAME
    exit_if_error "Failed to create virtual environment."
else
    print_warning "Virtual environment '$VENV_NAME' already exists."
fi

print_info "Activating virtual environment and installing dependencies..."
source "$VENV_NAME/bin/activate"
exit_if_error "Failed to activate virtual environment."

if [ ! -f "requirements.txt" ]; then
    print_error "requirements.txt not found in $BACKEND_ABS_PATH. Aborting."
    deactivate
    exit 1
fi
pip install -r requirements.txt --upgrade
exit_if_error "Failed to install Python dependencies from requirements.txt."

# Create .env file
print_info "Configuring .env file for backend..."
ENV_FILE_PATH="$BACKEND_ABS_PATH/.env"
ENV_EXAMPLE_PATH="$BACKEND_ABS_PATH/.env_example"

if [ ! -f "$ENV_EXAMPLE_PATH" ]; then
    print_warning ".env_example not found. Creating .env with default DATABASE_URL."
    echo "DATABASE_URL=" > "$ENV_FILE_PATH" # Create empty if no example
else
    cp "$ENV_EXAMPLE_PATH" "$ENV_FILE_PATH"
fi

# Use +psycopg2 for SQLAlchemy driver
DB_CONN_STRING="postgresql+psycopg2://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
if grep -q "^DATABASE_URL=" "$ENV_FILE_PATH"; then
    sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=${DB_CONN_STRING}|" "$ENV_FILE_PATH"
else
    echo -e "\nDATABASE_URL=${DB_CONN_STRING}" >> "$ENV_FILE_PATH"
fi
[ -f "${ENV_FILE_PATH}.bak" ] && rm "${ENV_FILE_PATH}.bak"
print_success ".env file configured."
# Backend setup done in venv, Uvicorn will be started later by root/sudo

deactivate # Deactivate venv for now, will be sourced by uvicorn runner or systemd
cd "$PROJECT_ROOT_PATH" # Go back to project root

# 4. Set File Permissions for Nginx
print_info "Setting file permissions for Nginx user '$NGINX_USER'..."
# Nginx (www-data) needs to traverse parent directories and read frontend files.
# /home/ubuntu usually is drwx------ (700) or drwxr-x--- (750)
# We need 'others' or 'nginx_user_group' to have 'x' on /home/ubuntu and project root.
# And 'rx' on frontend dir, 'r' on files.

print_info "Current permissions for /home/ubuntu: $(stat -c '%A %U %G' /home/ubuntu)"
chmod o+x /home/ubuntu # Allow others (like www-data) to traverse /home/ubuntu
exit_if_error "Failed to set o+x on /home/ubuntu."

# Set ownership to ubuntu:NGINX_USER for project files, and appropriate permissions
# This gives user ubuntu full control, and NGINX_USER (www-data) read/execute access.
chown -R ubuntu:$NGINX_USER "$PROJECT_ROOT_PATH"
exit_if_error "Failed to chown project directory to ubuntu:$NGINX_USER."

# Directories: owner=rwx, group=r-x, other=--- (750)
# Files: owner=rw-, group=r--, other=--- (640)
find "$PROJECT_ROOT_PATH" -type d -exec chmod 750 {} \;
find "$PROJECT_ROOT_PATH" -type f -exec chmod 640 {} \;

# Specifically for frontend, ensure group (www-data) can read files and execute dirs
FRONTEND_ABS_PATH="$PROJECT_ROOT_PATH/$FRONTEND_DIR_REL"
if [ -d "$FRONTEND_ABS_PATH" ]; then
    find "$FRONTEND_ABS_PATH" -type d -exec chmod g+x {} \; # Ensure group execute on frontend subdirs
    find "$FRONTEND_ABS_PATH" -type f -exec chmod g+r {} \; # Ensure group read on frontend files
    # Make sure index.html itself is readable by the group
    if [ -f "$FRONTEND_ABS_PATH/index.html" ]; then
        chmod g+r "$FRONTEND_ABS_PATH/index.html"
    fi
else
    print_warning "Frontend directory $FRONTEND_ABS_PATH not found for permission setting."
fi
print_success "File permissions set."

# 5. Configure Nginx
print_info "Configuring Nginx..."
# Determine server_name (IP or domain)
EC2_PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || curl -s ifconfig.me || echo "YOUR_EC2_IP_MANUALLY")
read -p "Enter your domain name (e.g., mywedding.com, leave blank to use IP '$EC2_PUBLIC_IP'): " DOMAIN_NAME
SERVER_NAME_VALUE="${DOMAIN_NAME:-$EC2_PUBLIC_IP}"
if [ "$SERVER_NAME_VALUE" == "YOUR_EC2_IP_MANUALLY" ]; then
    print_error "Could not determine Public IP. Please edit Nginx config manually or provide domain."
    # exit 1 # Or prompt user to enter IP
fi
if [[ -n "$DOMAIN_NAME" ]]; then # If domain is provided, add www version
    SERVER_NAME_VALUE="$DOMAIN_NAME www.$DOMAIN_NAME $EC2_PUBLIC_IP" # Include IP as well for direct IP access
else
    SERVER_NAME_VALUE="$EC2_PUBLIC_IP" # Just IP if no domain
fi


NGINX_CONF_NAME="${PROJECT_DIR_NAME_IN_HOME//[^a-zA-Z0-9_-]/_}" # Sanitize project name for filename
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available/$NGINX_CONF_NAME"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled/$NGINX_CONF_NAME"

print_info "Creating Nginx configuration for server(s): $SERVER_NAME_VALUE"
cat > "$NGINX_SITES_AVAILABLE" <<EOL
server {
    listen 80;
    server_name $SERVER_NAME_VALUE;

    root $PROJECT_ROOT_PATH/$FRONTEND_DIR_REL;
    index index.html index.htm;

    location / {
        try_files \$uri \$uri/ /index.html =404; # Important: =404 breaks redirection cycle
    }

    # Explicitly serve static assets from subdirectories if needed,
    # though the root directive and try_files above should handle them.
    # location /css { alias $PROJECT_ROOT_PATH/$FRONTEND_DIR_REL/css; try_files \$uri =404; expires 1d; }
    # location /js { alias $PROJECT_ROOT_PATH/$FRONTEND_DIR_REL/js; try_files \$uri =404; expires 1d; }
    # location /images { alias $PROJECT_ROOT_PATH/$FRONTEND_DIR_REL/images; try_files \$uri =404; expires 1M; }
    # location /favicon.ico { alias $PROJECT_ROOT_PATH/$FRONTEND_DIR_REL/favicon.ico; log_not_found off; access_log off; }


    location /api {
        proxy_pass http://$UVICORN_HOST:$UVICORN_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 60s; # Optional: Increase timeout
        proxy_connect_timeout 60s; # Optional: Increase timeout
    }

    # Deny access to sensitive files
    location ~ /\.env { deny all; return 403; }
    location ~ /\.git { deny all; return 403; }
    location = /README.md { deny all; return 403; }
    location = /setup_and_run.sh { deny all; return 403; }


    # Logging (optional: customize log format or paths)
    # access_log /var/log/nginx/${NGINX_CONF_NAME}.access.log;
    # error_log /var/log/nginx/${NGINX_CONF_NAME}.error.log;
}
EOL
exit_if_error "Failed to write Nginx configuration file."

# Enable site
if [ -L "$NGINX_SITES_ENABLED" ]; then rm "$NGINX_SITES_ENABLED"; fi
if [ -f "$NGINX_SITES_ENABLED" ] && [ ! -L "$NGINX_SITES_ENABLED" ]; then rm "$NGINX_SITES_ENABLED"; fi # Remove if regular file
ln -s "$NGINX_SITES_AVAILABLE" "$NGINX_SITES_ENABLED"
exit_if_error "Failed to create Nginx symlink."

nginx -t
exit_if_error "Nginx configuration test failed. Check $NGINX_SITES_AVAILABLE and Nginx error logs."

systemctl reload nginx
exit_if_error "Failed to reload Nginx."
print_success "Nginx configured and reloaded."

# 6. Start FastAPI Backend with Uvicorn (using systemd is better for production)
print_info "Starting FastAPI backend with Uvicorn (via nohup)..."
UVICORN_LOG_FILE="$BACKEND_ABS_PATH/uvicorn.log"
UVICORN_PID_FILE="$BACKEND_ABS_PATH/uvicorn.pid"

# Stop existing Uvicorn if PID file exists and process is running
if [ -f "$UVICORN_PID_FILE" ]; then
    OLD_PID=$(cat "$UVICORN_PID_FILE" 2>/dev/null)
    if [ -n "$OLD_PID" ] && ps -p "$OLD_PID" > /dev/null; then
        print_warning "Stopping existing Uvicorn process (PID: $OLD_PID)..."
        kill "$OLD_PID"
        sleep 2
    fi
    rm -f "$UVICORN_PID_FILE"
fi

# Start Uvicorn in the background, ensuring it runs from the correct venv
# The user running Uvicorn should ideally be a non-root user with access to the venv and project files.
# For simplicity, this script will run it as root sourcing the venv, which is not ideal for long-term prod.
# A better approach is a dedicated systemd service file that specifies User, Group, WorkingDirectory, and ExecStart.
LAUNCH_CMD="source \"$BACKEND_ABS_PATH/$VENV_NAME/bin/activate\" && uvicorn app.main:app --host \"$UVICORN_HOST\" --port \"$UVICORN_PORT\""

nohup bash -c "$LAUNCH_CMD" >> "$UVICORN_LOG_FILE" 2>&1 &
UVICORN_NEW_PID=$!
echo "$UVICORN_NEW_PID" > "$UVICORN_PID_FILE"

sleep 3
if ps -p "$UVICORN_NEW_PID" > /dev/null; then
    print_success "Uvicorn backend started (PID: $UVICORN_NEW_PID). Log: $UVICORN_LOG_FILE"
else
    print_error "Uvicorn backend may not have started correctly. Check $UVICORN_LOG_FILE"
    print_error "Command attempted: $LAUNCH_CMD"
fi

# 7. Final Instructions
print_success "Setup script finished!"
ACCESS_URL_HTTP="http://${SERVER_NAME_VALUE%% *}" # Use the first server_name entry (IP or domain)
echo ""
print_info "-------------------------------------------------------------------"
print_info "ACCESS YOUR WEBSITE (ensure Security Group allows port 80):"
print_info "Frontend & API Base: $ACCESS_URL_HTTP"
print_info "API Docs (via Nginx): $ACCESS_URL_HTTP/api/docs"
print_info "-------------------------------------------------------------------"
print_info "Uvicorn PID: $UVICORN_PID_FILE, Log: $UVICORN_LOG_FILE"
print_info "To stop Uvicorn: kill \$(cat $UVICORN_PID_FILE 2>/dev/null || echo 0)"
print_info "-------------------------------------------------------------------"