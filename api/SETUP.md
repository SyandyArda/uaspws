# SmartRetail Open API - Setup Guide

## Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **PostgreSQL 14+** - [Download here](https://www.postgresql.org/download/)
3. **Git** (optional) - [Download here](https://git-scm.com/)

## Installation Steps

### Step 1: Enable PowerShell Script Execution (Windows Only)

If you encounter a PowerShell execution policy error, run PowerShell as Administrator and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 2: Install Node.js Dependencies

Navigate to the API directory and install dependencies:

```bash
cd "d:\Materi kuliah\PWS\SmartRetail\api"
npm install
```

This will install all required packages including Express, Sequelize, JWT, Swagger, and more.

### Step 3: Setup PostgreSQL Database

#### Option A: Using Docker (Recommended)

If you have Docker Desktop installed:

```bash
docker compose up -d
```

This will start PostgreSQL on port 5432 and Adminer (database UI) on port 8080.

#### Option B: Manual PostgreSQL Installation

1. Install PostgreSQL from the official website
2. Create a new database:

```sql
CREATE DATABASE smartretail_db;
CREATE USER postgres WITH PASSWORD 'postgres123';
GRANT ALL PRIVILEGES ON DATABASE smartretail_db TO postgres;
```

3. Update `.env` file with your database credentials

### Step 4: Configure Environment Variables

Create a `.env` file in the `api` directory by copying `.env.example`:

```bash
copy .env.example .env
```

Edit `.env` and update the following:

```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smartretail_db
DB_USER=postgres
DB_PASSWORD=postgres123

# JWT Configuration (change these in production!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_refresh_token_secret_change_this
```

### Step 5: Run Database Migrations

Create all database tables:

```bash
node src/migrations/run.js
```

You should see:
```
✅ Database connection established.
✅ All models synchronized successfully.
✅ Database migration completed successfully.
```

### Step 6: Seed Demo Data (Optional)

Populate the database with sample data:

```bash
node src/seeders/run.js
```

This creates:
- Demo user: `demo@smartretail.com` / `password123`
- API key for testing
- 5 sample products

### Step 7: Start the Server

#### Development Mode (with auto-reload):

```bash
npm run dev
```

#### Production Mode:

```bash
npm start
```

You should see:

```
✅ Database connection established successfully.
✅ Database synchronized.
🚀 SmartRetail API server running on port 3000
📚 API Documentation: http://localhost:3000/api-docs
🌐 API Portal: http://localhost:3000
🏥 Health Check: http://localhost:3000/api/v1/health
```

## Testing the API

### 1. Check Health Status

```bash
curl http://localhost:3000/api/v1/health
```

### 2. Register a New User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"username\":\"testuser\",\"password\":\"password123\",\"store_name\":\"Test Store\"}"
```

### 3. Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"demo\",\"password\":\"password123\"}"
```

Copy the `access_token` from the response.

### 4. Generate API Key

```bash
curl -X POST http://localhost:3000/api/v1/auth/api-keys \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"key_name\":\"My API Key\"}"
```

Copy the `api_key` from the response.

### 5. List Products

```bash
curl -X GET http://localhost:3000/api/v1/products \
  -H "X-API-Key: YOUR_API_KEY"
```

### 6. Create a Product

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"New Product\",\"sku\":\"PROD-999\",\"price\":100000,\"stock\":50}"
```

### 7. Create a Transaction

```bash
curl -X POST http://localhost:3000/api/v1/transactions \
  -H "X-API-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"items\":[{\"product_id\":1,\"quantity\":2}],\"payment_method\":\"cash\"}"
```

## Accessing the Documentation

### Swagger UI (Interactive API Docs)

Open your browser and navigate to:

```
http://localhost:3000/api-docs
```

Here you can:
- View all API endpoints
- Test endpoints directly in the browser
- See request/response examples
- Download OpenAPI specification

### API Portal (Landing Page)

```
http://localhost:3000
```

Beautiful landing page with:
- Feature overview
- Quick start guide
- Pricing information
- Links to documentation

## Database Management

### Using Adminer (if using Docker)

Navigate to:

```
http://localhost:8080
```

Login with:
- System: PostgreSQL
- Server: postgres
- Username: postgres
- Password: postgres123
- Database: smartretail_db

### Using pgAdmin or DBeaver

Connect using:
- Host: localhost
- Port: 5432
- Database: smartretail_db
- Username: postgres
- Password: postgres123

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change it in `.env`:

```env
PORT=3001
```

### Database Connection Error

1. Make sure PostgreSQL is running
2. Check database credentials in `.env`
3. Verify database exists: `psql -U postgres -l`

### PowerShell Execution Policy Error

Run as Administrator:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Module Not Found Error

Delete `node_modules` and reinstall:

```bash
rmdir /s node_modules
npm install
```

## Project Structure

```
api/
├── src/
│   ├── config/
│   │   ├── database.js       # Sequelize configuration
│   │   └── swagger.js        # OpenAPI/Swagger config
│   ├── models/
│   │   ├── User.js           # User model
│   │   ├── ApiKey.js         # API Key model
│   │   ├── Product.js        # Product model
│   │   ├── Transaction.js    # Transaction model
│   │   ├── TransactionItem.js # Transaction items
│   │   └── index.js          # Model associations
│   ├── controllers/
│   │   ├── auth.controller.js        # Auth logic
│   │   ├── products.controller.js    # Product CRUD
│   │   └── transactions.controller.js # Transaction logic
│   ├── routes/
│   │   ├── auth.routes.js            # Auth endpoints
│   │   ├── products.routes.js        # Product endpoints
│   │   └── transactions.routes.js    # Transaction endpoints
│   ├── middleware/
│   │   ├── auth.js           # JWT middleware
│   │   ├── apiKey.js         # API key middleware
│   │   ├── rateLimiter.js    # Rate limiting
│   │   ├── validator.js      # Input validation
│   │   └── errorHandler.js   # Error handling
│   ├── utils/
│   │   ├── jwt.js            # JWT utilities
│   │   └── response.js       # Response formatter
│   ├── migrations/
│   │   └── run.js            # Database migration script
│   ├── seeders/
│   │   └── run.js            # Database seeder
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
├── portal/
│   ├── index.html            # Landing page
│   └── css/
│       └── style.css         # Portal styles
├── .env                      # Environment variables
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── docker-compose.yml        # Docker services
├── package.json              # Dependencies
└── README.md                 # Project documentation
```

## Next Steps

1. ✅ Test all endpoints using Swagger UI
2. ✅ Explore the API portal
3. ✅ Create your own products and transactions
4. ✅ Integrate the API into your application
5. ✅ Read the full documentation

## Support

For issues or questions:
- Check the API documentation: http://localhost:3000/api-docs
- Review error messages in the console
- Check database logs

## Demo Credentials

After running the seeder:

- **Email**: demo@smartretail.com
- **Username**: demo
- **Password**: password123
- **API Key**: (generated after seeding, check console output)

Enjoy building with SmartRetail API! 🚀
