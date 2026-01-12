# 🎯 Panduan Testing API di Browser - Step by Step

## ✅ Langkah-Langkah Detail Testing di Swagger UI

### Step 1: Buka Swagger UI

1. Buka browser (Chrome, Edge, atau Firefox)
2. Ketik di address bar: `http://localhost:3000/api-docs`
3. Tekan Enter
4. Tunggu halaman Swagger UI muncul

**Yang Harus Terlihat:**
- Judul "SmartRetail Open API" di atas
- Beberapa section: System, Authentication, Products, Transactions

---

### Step 2: Pilih Endpoint untuk Di-test

**Contoh: Test List Products**

1. **Scroll ke bawah** sampai menemukan section **"Products"**
2. **Klik** pada section "Products" untuk expand (jika belum terbuka)
3. Anda akan melihat beberapa endpoint:
   - GET /api/v1/products
   - GET /api/v1/products/search
   - GET /api/v1/products/low-stock
   - dll.

4. **Klik** pada **"GET /api/v1/products"** (yang pertama)
   - Endpoint ini akan expand dan menampilkan detail

---

### Step 3: Klik "Try it out"

1. Setelah endpoint expand, cari tombol **"Try it out"** di kanan atas
2. **Klik** tombol tersebut
3. Setelah diklik, tombol akan berubah menjadi **"Cancel"**
4. Form input akan muncul

---

### Step 4: Isi Parameter API Key

**PENTING:** Endpoint Products butuh API Key!

1. **Scroll ke bawah** sedikit sampai menemukan bagian **"Parameters"**
2. Cari field **"X-API-Key"** (biasanya di paling atas)
3. **Klik** di dalam field tersebut
4. **Paste** API key berikut:
   ```
   sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd748ee7d9db
   ```
5. Pastikan API key ter-paste dengan benar (tidak ada spasi di awal/akhir)

**Parameter Opsional:**
- `page`: Biarkan kosong atau isi `1`
- `per_page`: Biarkan kosong atau isi `20`

---

### Step 5: Klik "Execute"

1. **Scroll ke bawah** sampai menemukan tombol biru besar **"Execute"**
2. **Klik** tombol "Execute"
3. **Tunggu** beberapa detik (biasanya <1 detik)

---

### Step 6: Lihat Response

Setelah klik Execute, **scroll ke bawah** dan Anda akan melihat:

#### A. **Server Response**

**Response Code:**
- **200** (hijau) = Sukses! ✅
- **401** (merah) = API key salah/tidak ada
- **429** (kuning) = Rate limit exceeded

**Response Body:**
```json
{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "user_id": 1,
      "sku": "LAPTOP-001",
      "name": "Laptop Dell XPS 13",
      "description": "13-inch ultrabook with Intel i7",
      "price": "15000000.00",
      "stock": 10,
      "low_stock_threshold": 3,
      "image_url": null,
      "is_synced": true,
      "is_deleted": false,
      "created_at": "2026-01-03T11:36:19.000Z",
      "updated_at": "2026-01-03T11:36:19.000Z"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 5,
    "total_pages": 1
  },
  "meta": {
    "timestamp": "2026-01-03T12:19:00.000Z"
  }
}
```

#### B. **Response Headers**

Anda juga bisa lihat HTTP headers seperti:
- `content-type: application/json`
- `x-ratelimit-limit: 100`
- dll.

#### C. **Request Details**

Swagger juga menampilkan:
- **Curl command** - untuk copy-paste ke terminal
- **Request URL** - URL lengkap yang dipanggil
- **Request headers** - headers yang dikirim

---

## 🧪 Contoh Testing Endpoint Lain

### Test 2: Create Product (POST)

1. **Scroll** ke endpoint **POST /api/v1/products**
2. **Klik** endpoint tersebut
3. **Klik** "Try it out"
4. **Isi** `X-API-Key` (sama seperti sebelumnya)
5. **Edit** Request body di bagian bawah:
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
6. **Klik** "Execute"
7. **Lihat** response (status 201 Created)

### Test 3: Login (POST)

1. **Scroll** ke section **Authentication**
2. **Klik** **POST /api/v1/auth/login**
3. **Klik** "Try it out"
4. **Edit** Request body:
   ```json
   {
     "username": "demo",
     "password": "password123"
   }
   ```
5. **Klik** "Execute"
6. **Copy** `access_token` dari response
7. Token ini bisa digunakan untuk endpoint yang butuh JWT

---

## ❓ Troubleshooting

### Problem 1: Endpoint Tidak Muncul

**Solusi:**
- Refresh halaman (F5)
- Clear browser cache (Ctrl+Shift+Delete)
- Pastikan server masih running
- Cek console browser (F12) untuk error

### Problem 2: Response 401 Unauthorized

**Penyebab:**
- API key tidak diisi
- API key salah
- API key tidak ter-paste dengan benar

**Solusi:**
- Pastikan field `X-API-Key` terisi
- Copy-paste ulang API key
- Hapus spasi di awal/akhir

### Problem 3: Response 429 Rate Limit

**Penyebab:**
- Terlalu banyak request dalam 1 jam

**Solusi:**
- Tunggu 1 jam
- Atau restart server untuk reset counter

### Problem 4: Tombol "Try it out" Tidak Ada

**Penyebab:**
- Endpoint belum di-expand
- Halaman belum fully loaded

**Solusi:**
- Klik pada endpoint untuk expand
- Tunggu halaman fully loaded
- Refresh halaman

---

## 📸 Visual Guide

### Tampilan Swagger UI

```
┌─────────────────────────────────────────┐
│  SmartRetail Open API                   │
│  Version: 1.0.0                         │
├─────────────────────────────────────────┤
│  ▼ System                               │
│  ▼ Authentication                       │
│  ▼ Products                             │
│    ► GET /api/v1/products              │  ← Klik ini
│    ► GET /api/v1/products/search       │
│    ► POST /api/v1/products             │
│  ▼ Transactions                         │
└─────────────────────────────────────────┘
```

### Setelah Expand Endpoint

```
┌─────────────────────────────────────────┐
│  GET /api/v1/products                   │
│  List all products (paginated)          │
│                                         │
│  [Try it out]  ← Klik ini              │
│                                         │
│  Parameters:                            │
│  X-API-Key *  [___________________]    │  ← Isi API key
│  page         [___________________]    │
│  per_page     [___________________]    │
│                                         │
│  [Execute]  ← Lalu klik ini            │
└─────────────────────────────────────────┘
```

### Response Area

```
┌─────────────────────────────────────────┐
│  Server response                        │
│  Code: 200  ✓                          │
│                                         │
│  Response body:                         │
│  {                                      │
│    "success": true,                     │
│    "data": [...]                        │
│  }                                      │
│                                         │
│  Response headers:                      │
│  content-type: application/json         │
│                                         │
│  Curl:                                  │
│  curl -X GET "http://..."              │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist Testing

Gunakan checklist ini untuk memastikan testing berhasil:

- [ ] Buka http://localhost:3000/api-docs
- [ ] Halaman Swagger UI muncul
- [ ] Expand endpoint yang ingin di-test
- [ ] Klik "Try it out"
- [ ] Isi API key di field X-API-Key
- [ ] Klik "Execute"
- [ ] Response code 200 (hijau)
- [ ] Response body menampilkan data
- [ ] Tidak ada error message

---

## 🎯 Tips Sukses

1. **Pastikan server running** - Cek terminal, harus ada pesan "Server running on port 3000"
2. **Gunakan API key yang benar** - Copy dari file ini, jangan ketik manual
3. **Tunggu response** - Jangan klik Execute berkali-kali
4. **Scroll untuk lihat response** - Response ada di bawah tombol Execute
5. **Cek status code** - 200 = sukses, 401 = unauthorized, 429 = rate limit

---

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah:
1. Screenshot error yang muncul
2. Cek browser console (F12 → Console tab)
3. Cek terminal server untuk error log
4. Pastikan database MySQL masih running

**API Key untuk Copy-Paste:**
```
sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd748ee7d9db
```

**Demo Login:**
- Username: `demo`
- Password: `password123`

---

Selamat testing! 🚀
