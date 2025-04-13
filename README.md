# Wedding Invitation Website

This is a wedding invitation website with RSVP and wishes functionality, inspired by ngocsonthutrang.iwedding.info.

## Features

- Beautiful wedding invitation with couple information
- Four wedding event details with time and location
- RSVP form for guests to confirm attendance
- Wishes section for guests to leave congratulatory messages
- Admin dashboard to view RSVPs and wishes
- Fully responsive design for mobile, tablet, and desktop
- PostgreSQL database integration for data storage

## Local Setup and Development

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- PostgreSQL (version 12 or higher)

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/wedding-website.git

# Navigate to the project directory
cd wedding-website
```

### Step 2: Install Dependencies

```bash
# Install all required dependencies
npm install
```

### Step 3: Setup PostgreSQL Database

First, ensure that PostgreSQL is running on your machine. Then create a new database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create a database
CREATE DATABASE wedding;

# Create a user (if needed)
CREATE USER weddinguser WITH PASSWORD 'your-password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE wedding TO weddinguser;

# Exit PostgreSQL
\q
```

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```
DATABASE_URL=postgres://weddinguser:your-password@localhost:5432/wedding
```

### Step 5: Push Database Schema

```bash
# Push the schema to the database
npm run db:push
```

### Step 6: Run Development Server

#### For Unix/Linux/macOS:
```bash
# Option 1: Using npm script
npm run dev

# Option 2: Using the bash script
bash start.sh
```

#### For Windows:
```bash
# Option 1: Using the batch file
start.bat

# Option 2: Set environment variable manually
set NODE_ENV=development
npx tsx server/index.ts
```

The application should now be running at http://localhost:5000

## Setup on EC2

### Prerequisites

- An AWS account with access to EC2
- A domain name (optional, but recommended)
- Basic knowledge of AWS services

### Step 1: Launch an EC2 Instance

1. Login to your AWS Management Console
2. Navigate to EC2 Dashboard
3. Click "Launch Instance"
4. Choose an Amazon Machine Image (AMI) - Ubuntu Server 20.04 LTS is recommended
5. Choose an instance type (t2.micro is eligible for free tier)
6. Configure instance details as needed
7. Add storage (default 8GB is typically sufficient)
8. Add tags if needed
9. Configure security group:
   - Allow SSH (port 22) from your IP
   - Allow HTTP (port 80) from anywhere
   - Allow HTTPS (port 443) from anywhere
10. Review and launch with a key pair

### Step 2: Connect to Your EC2 Instance

```bash
ssh -i /path/to/your-key.pem ubuntu@your-ec2-public-dns
```

### Step 3: Install Required Software

```bash
# Update package lists
sudo apt update

# Install Node.js and npm
sudo apt install -y nodejs npm

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install Git
sudo apt install -y git
```

### Step 4: Configure PostgreSQL Database

```bash
# Login to PostgreSQL as postgres user
sudo -u postgres psql

# Create a new database
CREATE DATABASE wedding;

# Create a new user with password
CREATE USER weddinguser WITH PASSWORD 'your-secure-password';

# Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE wedding TO weddinguser;

# Exit PostgreSQL
\q
```

### Step 5: Clone and Setup the Application

```bash
# Navigate to a suitable directory
cd /var/www

# Clone the repository
sudo git clone https://github.com/yourusername/wedding-website.git

# Set proper ownership
sudo chown -R ubuntu:ubuntu wedding-website

# Navigate to the project directory
cd wedding-website

# Install dependencies
npm install

# Create .env file with configuration
echo "DATABASE_URL=postgres://weddinguser:your-secure-password@localhost:5432/wedding" > .env
echo "PORT=5000" >> .env
echo "NODE_ENV=production" >> .env

# Build the application
npm run build

# Push database schema
npm run db:push
```

### Step 6: Configure Nginx

Create an Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/wedding
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/wedding /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Setup a Process Manager

Install PM2 to keep your application running:

```bash
sudo npm install -g pm2

# Start the application
cd /var/www/wedding-website
pm2 start npm --name "wedding" -- run start

# Save the PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### Step 8: Setup SSL with Let's Encrypt (Optional)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Changing Content

### Couple Information

To update the couple information, edit the `client/src/components/wedding/CoupleSection.tsx` file:

```jsx
// Look for this section and update the names and descriptions
<div className="text-center mb-12">
  <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-neutral-800 mb-4">
    Cô Dâu & Chú Rể
  </h2>
  {/* Update names here */}
</div>

// Update the bride's information
<div className="text-center">
  <h3 className="font-['Playfair_Display'] text-2xl text-neutral-800 mb-2">
    Ngọc Sơn
  </h3>
  {/* Update the bride's details */}
</div>

// Update the groom's information
<div className="text-center">
  <h3 className="font-['Playfair_Display'] text-2xl text-neutral-800 mb-2">
    Thu Trang
  </h3>
  {/* Update the groom's details */}
</div>
```

### Wedding Date

To update the wedding date, edit the `client/src/lib/utils.ts` file:

```javascript
// Look for this line and change the date
export const WEDDING_DATE = new Date("2023-08-15T10:00:00");
```

### Event Details

To update the event details, edit the `client/src/components/wedding/EventDetails.tsx` file:

```jsx
// Find each event card in the return section:
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* First Event */}
  <div className="bg-white p-6 rounded-lg shadow-md border border-primary/20">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <CalendarHeart size={24} />
      </div>
      <h3 className="ml-4 font-['Playfair_Display'] text-xl text-neutral-800">
        Lễ Ăn Hỏi
      </h3>
    </div>
    
    <div className="space-y-3 text-neutral-700">
      {/* Update the time */}
      <div className="flex items-start">
        <Clock className="w-5 h-5 mr-3 text-primary mt-0.5" />
        <span>09:00 - 11:00, Ngày 15/08/2023</span>
      </div>
      
      {/* Update the location */}
      <div className="flex items-start">
        <MapPin className="w-5 h-5 mr-3 text-primary mt-0.5" />
        <span>Nhà Riêng, 123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</span>
      </div>
    </div>
  </div>
  
  {/* Repeat for each event */}
</div>
```

### Header and Cover Image

To update the header background image, edit the `client/src/components/wedding/Header.tsx` file:

```jsx
// Look for the style section and update the background image URL
<section
  className="h-screen relative flex items-center justify-center bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/path/to/your/image.jpg')" // Update this URL
  }}
>
```

### Gallery Images

To update the gallery images, edit the `client/src/lib/utils.ts` file:

```javascript
// Look for this section and update the image URLs
export const GALLERY_IMAGES = [
  {
    id: 1,
    src: "/path/to/thumbnail1.jpg", // Update with your image paths
    alt: "Wedding photo 1",
    original: "/path/to/original1.jpg"
  },
  // Repeat for each image
];
```

## Environment Variables

The application uses environment variables for configuration. These are stored in a `.env` file in the root directory. The following variables are available:

```
# PostgreSQL Configuration
DATABASE_URL=postgres://postgres:postgres@localhost:5432/wedding

# Application Settings
PORT=5000
NODE_ENV=development
```

## Database Schema

The application uses two main tables in PostgreSQL:

1. `rsvps` - Stores guest RSVP submissions
2. `wishes` - Stores wishes and messages from guests

To modify the schema, edit the `shared/schema.ts` file and then run `npm run db:push` to apply the changes.

## Support

If you encounter any issues or have questions, please contact the developer at your-email@example.com.