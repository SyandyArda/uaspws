# SmartRetail API

> **REST API untuk Sistem Manajemen Retail dengan API Key Authentication**  
> Tugas Akhir Mata Kuliah Pemrograman Web Service

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange.svg)](https://www.mysql.com/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-brightgreen.svg)](https://swagger.io/)

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [API Documentation](#-api-documentation)
- [Endpoint API](#-endpoint-api)
- [Autentikasi](#-autentikasi)
- [Testing](#-testing)
- [Struktur Project](#-struktur-project)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)
- [Kontributor](#-kontributor)

## 🎯 Tentang Project

SmartRetail API adalah REST API untuk sistem manajemen retail yang dibangun dengan fokus pada **API Key Authentication**. Project ini dikembangkan sebagai tugas akhir mata kuliah Pemrograman Web Service dengan tujuan untuk:

- Mengimplementasikan autentikasi berbasis API Key
- Menyediakan REST API yang terstruktur dan terdokumentasi dengan baik
- Menerapkan best practices dalam pengembangan API
- Menggunakan database relational dengan normalisasi yang tepat

### Fitur Unggulan

✨ **API Key Authentication** - Sistem autentikasi yang aman menggunakan API Key  
📦 **Product Management** - CRUD lengkap untuk manajemen produk  
💳 **Transaction Management** - Pencatatan transaksi dengan auto stock deduction  
📂 **Category Management** - Organisasi produk dengan kategori hierarkis  
📊 **Swagger Documentation** - Dokumentasi API interaktif  
🎨 **User Dashboard** - Interface untuk testing API dan manajemen API Key  

## ✨ Fitur Utama

### 1. API Key Authentication System
- Generate API Key dengan nama dan expiration date
- Revoke API Key yang tidak digunakan
- Track last used timestamp
- Support untuk multiple API keys per user

### 2. Product Management
- Create, Read, Update, Delete products
- Search products by name, SKU, or description
- Low stock alerts
- Category assignment
- Stock management

### 3. Transaction Management
- Create transactions with multiple items
- Automatic stock deduction
- Transaction history
- Daily sales summary
- Support untuk berbagai payment methods

### 4. Category Management
- Hierarchical categories (parent-child)
- Category-based product filtering
- Product count per category

### 5. Interactive Documentation
- Swagger UI untuk testing API
- User dashboard dengan API testing interface
- Comprehensive API documentation

## 🛠 Teknologi yang Digunakan

### Backend
- **Node.js** (v18.x) - Runtime environment
- **Express.js** (v4.x) - Web framework
- **MySQL** (v8.x) - Database
- **Sequelize** (v6.x) - ORM

### Authentication & Security
- **JSON Web Token (JWT)** - Token-based authentication
- **bcrypt** - Password hashing
- **express-rate-limit** - Rate limiting
- **helmet** - Security headers

### Documentation
- **Swagger/OpenAPI 3.0** - API documentation
- **swagger-jsdoc** - JSDoc to OpenAPI
- **swagger-ui-express** - Interactive API docs

### Development Tools
- **Morgan** - HTTP request logger
- **dotenv** - Environment variables
- **express-validator** - Input validation

## 📦 Instalasi

### Prerequisites

Pastikan Anda sudah menginstall:
- Node.js (v18.x atau lebih tinggi)
- MySQL (v8.x atau lebih tinggi)
- npm atau yarn

### Clone Repository

```bash
git clone https://github.com/SyandyArda/uaspws.git
cd uaspws
```

### Install Dependencies

```bash
cd api
npm install
```

## ⚙️ Konfigurasi

### 1. Setup Database

Buat database MySQL:

```sql
CREATE DATABASE smartretailweb_db;
```

### 2. Environment Variables

Buat file `.env` di folder `api/`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smartretailweb_db
DB_USER=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=7d

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
```

### 3. Run Migrations

```bash
npm run migrate
```

### 4. (Optional) Seed Database

```bash
npm run seed
```

## 🚀 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server akan berjalan di: `http://localhost:3000`

## 📚 API Documentation

### Swagger UI

Akses dokumentasi interaktif di:
```
http://localhost:3000/api-docs
```

### User Dashboard

Akses dashboard untuk testing API di:
```
http://localhost:3000/user
```

**Test Credentials:**
- Username: `arsyan`
- Password: `arda12345`

## 🔌 Endpoint API

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register user baru | Public |
| POST | `/api/v1/auth/login` | Login user | Public |
| POST | `/api/v1/auth/refresh` | Refresh access token | Public |
| GET | `/api/v1/auth/me` | Get user profile | JWT |
| PUT | `/api/v1/auth/profile` | Update profile | JWT |
| POST | `/api/v1/auth/change-password` | Change password | JWT |
| GET | `/api/v1/auth/api-keys` | List API keys | JWT |
| POST | `/api/v1/auth/api-keys` | Generate API key | JWT |
| DELETE | `/api/v1/auth/api-keys/:id` | Revoke API key | JWT |

### Product Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/products` | List all products | API Key |
| POST | `/api/v1/products` | Create product | API Key |
| GET | `/api/v1/products/search` | Search products | API Key |
| GET | `/api/v1/products/low-stock` | Get low stock products | API Key |
| GET | `/api/v1/products/:id` | Get single product | API Key |
| PUT | `/api/v1/products/:id` | Update product | API Key |
| PATCH | `/api/v1/products/:id/stock` | Update stock only | API Key |
| DELETE | `/api/v1/products/:id` | Delete product | API Key |

### Transaction Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/transactions` | List transactions | API Key |
| POST | `/api/v1/transactions` | Create transaction | API Key |
| GET | `/api/v1/transactions/:id` | Get single transaction | API Key |
| GET | `/api/v1/transactions/daily-summary` | Get daily summary | API Key |

### Category Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/categories` | List categories | API Key |
| POST | `/api/v1/categories` | Create category | API Key |
| GET | `/api/v1/categories/:id` | Get single category | API Key |
| PUT | `/api/v1/categories/:id` | Update category | API Key |
| DELETE | `/api/v1/categories/:id` | Delete category | API Key |
| GET | `/api/v1/categories/:id/products` | Get category products | API Key |

**Total: 27 Endpoints**

## 🔐 Autentikasi

### 1. JWT Authentication (untuk User Management)

```bash
# Login
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "arsyan",
  "password": "arda12345"
}

# Response
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "..."
  }
}

# Use token in subsequent requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. API Key Authentication (untuk API Endpoints)

```bash
# Generate API Key (requires JWT)
POST /api/v1/auth/api-keys
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "key_name": "My API Key",
  "expires_at": "2026-12-31"
}

# Response
{
  "success": true,
  "data": {
    "key_id": 1,
    "api_key": "sr_live_abc123...",
    "key_name": "My API Key"
  }
}

# Use API Key in requests
X-API-Key: sr_live_abc123...
```

## 🧪 Testing

### 1. Via Swagger UI

1. Buka `http://localhost:3000/api-docs`
2. Click "Authorize" button
3. Masukkan API Key
4. Test endpoints langsung dari browser

### 2. Via User Dashboard

1. Buka `http://localhost:3000/user`
2. Login dengan credentials
3. Generate API Key
4. Pilih API Key dari dropdown
5. Test endpoints dari dashboard

### 3. Via Postman

Import collection: `api/SmartRetail_API.postman_collection.json`

### 4. Via cURL

```bash
# List Products
curl -X GET http://localhost:3000/api/v1/products \
  -H "X-API-Key: sr_live_your_api_key_here"

# Create Product
curl -X POST http://localhost:3000/api/v1/products \
  -H "X-API-Key: sr_live_your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Dell XPS 13",
    "price": 15000000,
    "stock": 10,
    "category_id": 1
  }'
```

## 📁 Struktur Project

```
SmartRetail/
├── api/
│   ├── portal/                    # Frontend files
│   │   ├── index.html            # Landing page
│   │   ├── css/                  # Stylesheets
│   │   ├── js/                   # JavaScript files
│   │   └── user/                 # User dashboard
│   │       ├── index.html        # Dashboard page
│   │       ├── css/              # Dashboard styles
│   │       └── js/               # Dashboard scripts
│   ├── src/
│   │   ├── config/               # Configuration files
│   │   │   ├── database.js       # Database config
│   │   │   └── swagger.js        # Swagger config
│   │   ├── controllers/          # Route controllers
│   │   │   ├── auth.controller.js
│   │   │   ├── products.controller.js
│   │   │   ├── transactions.controller.js
│   │   │   └── categories.controller.js
│   │   ├── middleware/           # Express middleware
│   │   │   ├── auth.js           # JWT middleware
│   │   │   ├── apiKey.js         # API Key middleware
│   │   │   ├── validator.js      # Input validation
│   │   │   ├── errorHandler.js   # Error handling
│   │   │   └── rateLimiter.js    # Rate limiting
│   │   ├── migrations/           # Database migrations
│   │   ├── models/               # Sequelize models
│   │   │   ├── User.js
│   │   │   ├── ApiKey.js
│   │   │   ├── Product.js
│   │   │   ├── Transaction.js
│   │   │   ├── TransactionItem.js
│   │   │   ├── Category.js
│   │   │   └── index.js
│   │   ├── routes/               # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── products.routes.js
│   │   │   ├── transactions.routes.js
│   │   │   └── categories.routes.js
│   │   ├── seeders/              # Database seeders
│   │   ├── utils/                # Utility functions
│   │   │   ├── jwt.js            # JWT utilities
│   │   │   └── response.js       # API response formatter
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # Server entry point
│   ├── .env                      # Environment variables
│   ├── .gitignore               # Git ignore file
│   ├── package.json             # Dependencies
│   └── README.md                # API documentation
└── README.md                    # This file
```

## 🗄️ Database Schema

### ERD (Entity Relationship Diagram)

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    Users    │──────<│   API Keys   │       │ Categories  │
└─────────────┘       └──────────────┘       └─────────────┘
       │                                             │
       │                                             │
       │              ┌─────────────┐                │
       └─────────────>│  Products   │<───────────────┘
                      └─────────────┘
                             │
                             │
       ┌─────────────┐       │       ┌──────────────────┐
       │Transactions │<──────┴──────>│Transaction Items │
       └─────────────┘               └──────────────────┘
```

### Tables

1. **users** - User accounts
2. **api_keys** - API keys untuk autentikasi
3. **products** - Product catalog
4. **categories** - Product categories (hierarchical)
5. **transactions** - Sales transactions
6. **transaction_items** - Transaction line items

## 📸 Screenshots

### Swagger Documentation
![Swagger UI](docs/screenshots/swagger-ui.png)

### User Dashboard
![User Dashboard](docs/screenshots/dashboard.png)

### API Key Management
![API Keys](docs/screenshots/api-keys.png)

### Category Management
![Categories](docs/screenshots/categories.png)

## 🎓 Kontributor

**Syandi Arda**  
NIM: [Your NIM]  
Program Studi: [Your Program]  
Mata Kuliah: Pemrograman Web Service  

## 📝 Lisensi

Project ini dibuat untuk keperluan akademik (Tugas Akhir Mata Kuliah).

## 🙏 Acknowledgments

- Dosen Pengampu: [Nama Dosen]
- Universitas: [Nama Universitas]
- Referensi: Express.js, Sequelize, Swagger Documentation

---

**Built with ❤️ for Academic Purpose**

Last Updated: January 2026
