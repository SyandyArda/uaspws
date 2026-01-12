# 🎯 Setup MySQL untuk SmartRetail API

## ✅ Langkah-Langkah Setup

### 1. Buat Database di MySQL

Buka MySQL (via phpMyAdmin, MySQL Workbench, atau command line):

```sql
CREATE DATABASE smartretail_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Update File `.env`

Edit file `.env` di folder `api` dengan kredensial MySQL Anda:

```env
NODE_ENV=development
PORT=3000

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smartretail_db
DB_USER=root
DB_PASSWORD=your_mysql_password_here

# JWT Configuration
JWT_SECRET=smartretail_super_secret_jwt_key_2026
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=smartretail_refresh_token_secret_2026
JWT_REFRESH_EXPIRES_IN=7d

# API Key Configuration
API_KEY_PREFIX=sr_live_

# Rate Limiting
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_FREE_TIER=100
RATE_LIMIT_BASIC_TIER=1000
RATE_LIMIT_PREMIUM_TIER=10000

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Pagination
DEFAULT_PAGE_SIZE=20
MAX_PAGE_SIZE=100
```

**Ganti:**
- `DB_USER` dengan username MySQL Anda (biasanya `root`)
- `DB_PASSWORD` dengan password MySQL Anda

### 3. Install MySQL Driver

```powershell
npm install mysql2
```

### 4. Jalankan Migration (Buat Tabel)

```powershell
node src/migrations/run.js
```

Output yang diharapkan:
```
🔄 Starting database migration...
✅ Database connection established.
✅ All models synchronized successfully.
✅ Database migration completed successfully.
```

### 5. Seed Demo Data

```powershell
node src/seeders/run.js
```

Output:
```
🌱 Starting database seeding...
✅ Demo user created: demo
✅ Demo API key created: sr_live_xxxxx
✅ 5 sample products created.

📝 Demo Credentials:
   Email: demo@smartretail.com
   Username: demo
   Password: password123
   API Key: sr_live_xxxxx
```

### 6. Start Server

```powershell
npm run dev
```

Output:
```
✅ Database connection established successfully.
✅ Database synchronized.
🚀 SmartRetail API server running on port 3000
📚 API Documentation: http://localhost:3000/api-docs
🌐 API Portal: http://localhost:3000
🏥 Health Check: http://localhost:3000/api/v1/health
```

---

## 🧪 Test API

### Via Browser

1. Buka: http://localhost:3000
2. Buka: http://localhost:3000/api-docs (Swagger UI)

### Via cURL

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"demo\",\"password\":\"password123\"}"

# List products (gunakan API key dari seeder)
curl http://localhost:3000/api/v1/products \
  -H "X-API-Key: sr_live_your_api_key_here"
```

---

## ❓ Troubleshooting

### Error: Access denied for user

Pastikan password di `.env` benar:
```env
DB_PASSWORD=your_actual_mysql_password
```

### Error: Unknown database

Buat database dulu:
```sql
CREATE DATABASE smartretail_db;
```

### Error: Cannot find module 'mysql2'

Install driver:
```powershell
npm install mysql2
```

---

## 📊 Cek Database

Setelah migration, Anda akan punya 5 tabel:
- `users` - Data pengguna/merchant
- `api_keys` - API keys untuk akses
- `products` - Data produk
- `transactions` - Header transaksi
- `transaction_items` - Detail item transaksi

Cek via MySQL:
```sql
USE smartretail_db;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM products;
```

---

Selamat! API Anda siap digunakan! 🎉
