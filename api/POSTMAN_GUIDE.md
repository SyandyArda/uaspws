# 📮 Postman Collection - SmartRetail API

## 📥 Cara Import ke Postman

### 1. Buka Postman

Download Postman jika belum punya: https://www.postman.com/downloads/

### 2. Import Collection

1. Buka Postman
2. Klik **Import** (di kiri atas)
3. Pilih **File** tab
4. Drag & drop file `SmartRetail_API.postman_collection.json` atau klik **Choose Files**
5. Klik **Import**

### 3. Collection Siap Digunakan!

Collection akan muncul di sidebar kiri dengan nama **"SmartRetail Open API"**

---

## 🔑 Setup Environment Variables

Collection sudah include variables:
- `base_url`: http://localhost:3000
- `api_key`: sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd748ee7d9db
- `access_token`: (auto-filled setelah login)
- `refresh_token`: (auto-filled setelah login)

---

## 🧪 Cara Testing

### Opsi 1: Menggunakan API Key (Recommended)

1. Buka folder **Products** atau **Transactions**
2. Pilih request (misalnya "List Products")
3. Klik **Send**
4. API Key sudah otomatis ter-attach di header `X-API-Key`

### Opsi 2: Menggunakan JWT Token

1. Buka folder **Authentication**
2. Jalankan request **Login**
3. Token akan otomatis tersimpan di environment variables
4. Request lain yang butuh JWT akan otomatis menggunakan token tersebut

---

## 📁 Collection Structure

### 1. System (2 endpoints)
- ✅ Health Check
- ✅ API Version

### 2. Authentication (9 endpoints)
- ✅ Register
- ✅ Login (auto-save token)
- ✅ Refresh Token
- ✅ Get Profile
- ✅ Update Profile
- ✅ Change Password
- ✅ List API Keys
- ✅ Generate API Key (auto-save new key)
- ✅ Revoke API Key

### 3. Products (8 endpoints)
- ✅ List Products (with pagination)
- ✅ Get Product
- ✅ Create Product
- ✅ Update Product
- ✅ Update Stock
- ✅ Delete Product (soft delete)
- ✅ Search Products
- ✅ Get Low Stock Products

### 4. Transactions (4 endpoints)
- ✅ List Transactions (with pagination)
- ✅ Get Transaction
- ✅ Create Transaction (atomic)
- ✅ Get Daily Summary

**Total: 23 endpoints**

---

## 🎯 Quick Start Testing Flow

### Flow 1: Test dengan API Key (Paling Mudah)

```
1. System > Health Check
2. Products > List Products
3. Products > Create Product
4. Transactions > Create Transaction
5. Transactions > Get Daily Summary
```

### Flow 2: Test dengan JWT

```
1. Authentication > Login (token auto-saved)
2. Authentication > Get Profile
3. Authentication > Generate API Key (new key auto-saved)
4. Products > List Products (using new API key)
5. Transactions > Create Transaction
```

---

## 💡 Tips Postman

### 1. Lihat Response

Setelah klik **Send**, lihat response di tab **Body** (Pretty/Raw/Preview)

### 2. Save Request

Klik **Save** untuk menyimpan perubahan pada request body atau headers

### 3. Duplicate Request

Klik kanan pada request → **Duplicate** untuk membuat variasi testing

### 4. Environment Variables

Klik mata (👁️) di kanan atas untuk melihat semua environment variables

### 5. Pre-request Scripts

Request **Login** dan **Generate API Key** sudah punya script untuk auto-save token/key

### 6. Tests Tab

Beberapa request punya **Tests** yang otomatis menyimpan response ke variables

---

## 🔧 Customize Variables

Jika server berjalan di port lain atau host berbeda:

1. Klik mata (👁️) di kanan atas
2. Edit `base_url` (misalnya: `http://localhost:3001`)
3. Klik **Save**

---

## 📊 Example Requests

### Create Product

```json
{
  "name": "iPhone 15 Pro",
  "sku": "PHONE-001",
  "price": 18000000,
  "stock": 20,
  "description": "Latest iPhone model",
  "low_stock_threshold": 5
}
```

### Create Transaction

```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ],
  "payment_method": "cash",
  "notes": "Test transaction from Postman"
}
```

### Login

```json
{
  "username": "demo",
  "password": "password123"
}
```

---

## ✅ Testing Checklist

Gunakan checklist ini untuk memastikan semua endpoint berfungsi:

**System:**
- [ ] Health Check
- [ ] API Version

**Authentication:**
- [ ] Register new user
- [ ] Login
- [ ] Get profile
- [ ] Update profile
- [ ] Change password
- [ ] Generate API key
- [ ] List API keys
- [ ] Revoke API key

**Products:**
- [ ] List products
- [ ] Get single product
- [ ] Create product
- [ ] Update product
- [ ] Update stock
- [ ] Delete product
- [ ] Search products
- [ ] Get low stock products

**Transactions:**
- [ ] List transactions
- [ ] Get single transaction
- [ ] Create transaction
- [ ] Get daily summary

---

## 🐛 Troubleshooting

### Error: "Could not get response"

- Pastikan server running (`npm run dev`)
- Check `base_url` di environment variables

### Error: "Unauthorized"

- Untuk Products/Transactions: pastikan API key benar
- Untuk Profile endpoints: pastikan sudah login dan token tersimpan

### Error: "Validation Error"

- Check request body format
- Pastikan semua required fields terisi

---

## 📚 Dokumentasi Lengkap

Untuk dokumentasi API lengkap, buka:
- **Swagger UI**: http://localhost:3000/api-docs
- **API Portal**: http://localhost:3000

---

## 🎉 Ready to Test!

Collection sudah siap digunakan. Mulai testing dengan:
1. **System > Health Check** untuk memastikan server jalan
2. **Products > List Products** untuk melihat data sample
3. **Transactions > Create Transaction** untuk test transaksi

Happy Testing! 🚀
