# 🧪 Testing SmartRetail API - PowerShell Guide

## ✅ API Berhasil Jalan!

Server sudah running di http://localhost:3000

---

## 📝 PowerShell Commands untuk Testing

### 1. Health Check

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/health" | Select-Object -Expand Content
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-01-03T11:50:01.183Z",
    "uptime": 807.38,
    "environment": "development"
  }
}
```

### 2. Get API Version

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/version" | Select-Object -Expand Content
```

### 3. List Products (dengan API Key)

```powershell
$apiKey = "sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd748ee7d9db"
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/products" -Headers @{"X-API-Key"=$apiKey} | Select-Object -Expand Content
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "name": "Laptop Dell XPS 13",
      "sku": "LAPTOP-001",
      "price": "15000000.00",
      "stock": 10
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 5,
    "total_pages": 1
  }
}
```

### 4. Login (Get JWT Token)

```powershell
$body = @{
    username = "demo"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body | Select-Object -Expand Content
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": 1,
      "email": "demo@smartretail.com",
      "username": "demo",
      "store_name": "Demo Store",
      "role": "admin"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": "15m"
    }
  }
}
```

### 5. Create Product (dengan API Key)

```powershell
$apiKey = "sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd748ee7d9db"

$body = @{
    name = "iPhone 15 Pro"
    sku = "PHONE-001"
    price = 18000000
    stock = 20
    description = "Latest iPhone model"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/products" `
    -Method POST `
    -Headers @{"X-API-Key"=$apiKey} `
    -ContentType "application/json" `
    -Body $body | Select-Object -Expand Content
```

### 6. Create Transaction (dengan API Key)

```powershell
$apiKey = "sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd748ee7d9db"

$body = @{
    items = @(
        @{
            product_id = 1
            quantity = 2
        },
        @{
            product_id = 2
            quantity = 1
        }
    )
    payment_method = "cash"
    notes = "Test transaction"
} | ConvertTo-Json -Depth 3

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/transactions" `
    -Method POST `
    -Headers @{"X-API-Key"=$apiKey} `
    -ContentType "application/json" `
    -Body $body | Select-Object -Expand Content
```

### 7. Get Daily Summary

```powershell
$apiKey = "sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd748ee7d9db"

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/transactions/daily-summary" `
    -Headers @{"X-API-Key"=$apiKey} | Select-Object -Expand Content
```

### 8. Search Products

```powershell
$apiKey = "sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd748ee7d9db"

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/products/search?q=laptop" `
    -Headers @{"X-API-Key"=$apiKey} | Select-Object -Expand Content
```

### 9. Get Low Stock Products

```powershell
$apiKey = "sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd748ee7d9db"

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/products/low-stock" `
    -Headers @{"X-API-Key"=$apiKey} | Select-Object -Expand Content
```

### 10. Update Product Stock

```powershell
$apiKey = "sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd748ee7d9db"

$body = @{
    stock = 50
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/v1/products/1/stock" `
    -Method PATCH `
    -Headers @{"X-API-Key"=$apiKey} `
    -ContentType "application/json" `
    -Body $body | Select-Object -Expand Content
```

---

## 🌐 Testing via Browser

### Swagger UI (Recommended)

Buka browser dan kunjungi:
```
http://localhost:3000/api-docs
```

Di Swagger UI, Anda bisa:
1. Klik endpoint yang ingin di-test
2. Klik "Try it out"
3. Isi parameter/body
4. Klik "Execute"
5. Lihat response

### API Portal

```
http://localhost:3000
```

Landing page dengan dokumentasi lengkap.

---

## 💡 Tips PowerShell

### Simpan API Key sebagai Variable

```powershell
$apiKey = "sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd748ee7d9db"
```

Lalu gunakan `$apiKey` di command berikutnya.

### Format JSON Response (Pretty Print)

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/products" `
    -Headers @{"X-API-Key"=$apiKey} | 
    Select-Object -Expand Content | 
    ConvertFrom-Json | 
    ConvertTo-Json -Depth 10
```

### Save Response to File

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/v1/products" `
    -Headers @{"X-API-Key"=$apiKey} | 
    Select-Object -Expand Content | 
    Out-File "products.json"
```

---

## 🔑 Demo Credentials

**Login:**
- Username: `demo`
- Password: `password123`

**API Key:**
```
sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd748ee7d9db
```

---

## 📊 Expected Responses

### Success Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-01-03T11:50:01.183Z"
  }
}
```

### Paginated Response Format

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 5,
    "total_pages": 1
  },
  "meta": {
    "timestamp": "2026-01-03T11:50:01.183Z"
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [ ... ]
  },
  "meta": {
    "timestamp": "2026-01-03T11:50:01.183Z"
  }
}
```

---

## ✅ Testing Checklist

- [x] Health check endpoint
- [x] Login endpoint
- [x] List products
- [ ] Create product
- [ ] Update product
- [ ] Delete product
- [ ] Create transaction
- [ ] Get daily summary
- [ ] Search products
- [ ] Low stock alert

---

## 🎯 Next Steps

1. Test semua endpoint via Swagger UI
2. Coba buat product baru
3. Coba buat transaksi
4. Lihat daily summary
5. Test error handling (coba input invalid)

Selamat testing! 🚀
