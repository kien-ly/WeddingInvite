# Wedding Invitation Website

A beautiful and responsive wedding invitation website built with Python (FastAPI) and modern web technologies.

## Features

- 🎵 Background music with play/pause control
- 📅 Countdown timer to the wedding day
- 💌 RSVP form for guest confirmation
- 💝 Wish submission and display
- 📱 Fully responsive design
- 🎨 Elegant and romantic UI
- 📍 Google Maps integration for venue locations

## Tech Stack

- **Backend**: Python 3.11, FastAPI, PostgreSQL
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Database**: PostgreSQL 15
- **Deployment**: Nginx, Gunicorn

## Project Structure

```
wedding_project/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   └── database.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── images/
│   └── music/
└── setup.sh
```

## Setup Instructions

### 1. System Requirements

- Ubuntu 22.04 LTS
- Python 3.11
- PostgreSQL 15
- Nginx
- Git

### 2. Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wedding_project
   ```

2. Run the setup script:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. The script will:
   - Install required system packages
   - Set up Python virtual environment
   - Install Python dependencies
   - Configure PostgreSQL database
   - Set up Nginx
   - Configure systemd service

### 3. Configuration

1. Create `.env` file in the backend directory:
   ```
   DATABASE_URL=postgresql://wedding_user:your_password@localhost/wedding_db
   ```

2. Update Nginx configuration if needed:
   ```bash
   sudo nano /etc/nginx/sites-available/wedding
   ```

3. Update systemd service if needed:
   ```bash
   sudo nano /etc/systemd/system/wedding.service
   ```

### 4. Database Management

#### Check Database Status

1. Check if PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql
   ```

2. List all databases:
   ```bash
   sudo -u postgres psql -l
   ```

3. Connect to the wedding database:
   ```bash
   sudo -u postgres psql -d wedding_db
   ```

#### View and Manage Data

1. List all tables:
   ```sql
   \dt
   ```

2. View table structure:
   ```sql
   \d wishes
   \d confirmations
   ```

3. View data in tables:
   ```sql
   SELECT * FROM wishes;
   SELECT * FROM confirmations;
   ```

4. Delete all data from tables:
   ```sql
   DELETE FROM wishes;
   DELETE FROM confirmations;
   ```

5. Check database users:
   ```sql
   \du
   ```

6. Check connection info:
   ```sql
   \conninfo
   ```

### 5. Running the Application

1. Start the application:
   ```bash
   sudo systemctl start wedding
   ```

2. Check status:
   ```bash
   sudo systemctl status wedding
   ```

3. View logs:
   ```bash
   sudo journalctl -u wedding -f
   ```

### 6. Maintenance

1. Update the application:
   ```bash
   git pull
   sudo systemctl restart wedding
   ```

2. Backup database:
   ```bash
   sudo -u postgres pg_dump wedding_db > backup.sql
   ```

3. Restore database:
   ```bash
   sudo -u postgres psql wedding_db < backup.sql
   ```

## Development

### Local Development

1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```

3. Run development server:
   ```bash
   uvicorn backend.app.main:app --reload
   ```

### Adding New Features

1. Backend changes:
   - Add new models in `models.py`
   - Create new endpoints in `main.py`
   - Update database schema if needed

2. Frontend changes:
   - Add new HTML elements in `index.html`
   - Style new elements in `style.css`
   - Add JavaScript functionality in `main.js`

## Troubleshooting

### Common Issues

1. Database Connection Issues:
   - Check PostgreSQL service status
   - Verify database credentials in `.env`
   - Check database user permissions

2. Application Not Starting:
   - Check systemd service status
   - View application logs
   - Verify Python environment

3. Nginx Issues:
   - Check Nginx error logs
   - Verify Nginx configuration
   - Check file permissions

### Logs Location

- Application logs: `sudo journalctl -u wedding -f`
- Nginx logs: `/var/log/nginx/error.log`
- PostgreSQL logs: `/var/log/postgresql/postgresql-15-main.log`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or support, please contact [your-email@example.com]
