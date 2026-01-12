# 🗄️ Cara Cek Database MySQL - SmartRetail API

## 📊 Opsi 1: Menggunakan MySQL Command Line (Paling Cepat)

### Langkah-Langkah:

1. **Buka Command Prompt atau PowerShell baru**

2. **Login ke MySQL:**
   ```bash
   mysql -u root -p
   ```
   Masukkan password MySQL Anda

3. **Pilih Database:**
   ```sql
   USE smartretailweb_db;
   ```

4. **Lihat Semua Tabel:**
   ```sql
   SHOW TABLES;
   ```
   
   Output:
   ```
   +----------------------------+
   | Tables_in_smartretailweb_db|
   +----------------------------+
   | api_keys                   |
   | products                   |
   | transaction_items          |
   | transactions               |
   | users                      |
   +----------------------------+
   ```

5. **Cek Data di Tabel:**

   **Lihat Users:**
   ```sql
   SELECT * FROM users;
   ```

   **Lihat Products:**
   ```sql
   SELECT product_id, name, sku, price, stock FROM products;
   ```

   **Lihat API Keys:**
   ```sql
   SELECT key_id, user_id, api_key, key_name, is_active FROM api_keys;
   ```

   **Lihat Transactions:**
   ```sql
   SELECT transaction_id, total_price, payment_method, status, created_at FROM transactions;
   ```

6. **Keluar dari MySQL:**
   ```sql
   EXIT;
   ```

---

## 📊 Opsi 2: Menggunakan phpMyAdmin (Paling Mudah - GUI)

### Jika Anda Punya XAMPP/WAMP:

1. **Buka browser** → http://localhost/phpmyadmin
2. **Klik** database `smartretailweb_db` di sidebar kiri
3. **Klik** tabel yang ingin dilihat (users, products, dll)
4. **Klik** tab **"Browse"** untuk melihat data

---

## 📊 Opsi 3: Menggunakan MySQL Workbench (GUI Professional)

### Jika Sudah Install MySQL Workbench:

1. **Buka MySQL Workbench**
2. **Klik** koneksi localhost
3. **Masukkan** password
4. **Klik** schema `smartretailweb_db`
5. **Expand** Tables
6. **Klik kanan** pada tabel → **Select Rows**

---

## 📊 Opsi 4: Menggunakan VS Code Extension

### Install Extension:

1. **Buka VS Code**
2. **Install** extension: **"MySQL"** by Jun Han
3. **Klik** icon MySQL di sidebar
4. **Add Connection:**
   - Host: `localhost`
   - User: `root`
   - Password: (password MySQL Anda)
   - Port: `3306`
5. **Connect** dan browse database

---

## 🔍 Query Berguna untuk Cek Data

### Cek Jumlah Data di Setiap Tabel:

```sql
USE smartretailweb_db;

SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'api_keys', COUNT(*) FROM api_keys
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'transaction_items', COUNT(*) FROM transaction_items;
```

### Cek Demo User:

```sql
SELECT user_id, email, username, store_name, role, is_active 
FROM users 
WHERE username = 'demo';
```

### Cek Demo Products:

```sql
SELECT product_id, name, sku, price, stock, low_stock_threshold 
FROM products 
ORDER BY product_id;
```

### Cek API Key:

```sql
SELECT key_id, user_id, api_key, key_name, is_active, created_at 
FROM api_keys 
WHERE user_id = 1;
```

### Cek Struktur Tabel:

```sql
DESCRIBE users;
DESCRIBE products;
DESCRIBE transactions;
```

---

## 📝 Expected Data (Setelah Seeding)

### Users Table:
```
user_id | email                  | username | store_name  | role  | is_active
--------|------------------------|----------|-------------|-------|----------
1       | demo@smartretail.com   | demo     | Demo Store  | admin | 1
```

### Products Table (5 products):
```
product_id | name                | sku          | price      | stock
-----------|---------------------|--------------|------------|------
1          | Laptop Dell XPS 13  | LAPTOP-001   | 15000000   | 10
2          | Logitech MX Master 3| MOUSE-001    | 1500000    | 25
3          | Keychron K2         | KEYBOARD-001 | 1200000    | 15
4          | LG 27" 4K Monitor   | MONITOR-001  | 5000000    | 8
5          | Sony WH-1000XM4     | HEADSET-001  | 4500000    | 12
```

### API Keys Table:
```
key_id | user_id | api_key                                                          | is_active
-------|---------|------------------------------------------------------------------|----------
1      | 1       | sr_live_00077a634d6576a68d8d12f455d3873bb29ff6ab8bc275659fbecd... | 1
```

---

## 🚀 Quick Check via PowerShell

Jika MySQL sudah di PATH, bisa langsung:

```powershell
# Cek semua tabel
mysql -u root -p -e "USE smartretailweb_db; SHOW TABLES;"

# Cek products
mysql -u root -p -e "USE smartretailweb_db; SELECT * FROM products;"

# Cek users
mysql -u root -p -e "USE smartretailweb_db; SELECT * FROM users;"
```

---

## ❓ Troubleshooting

### Error: Access denied

**Solusi:** Pastikan password MySQL benar

### Error: Unknown database

**Solusi:** Database belum dibuat, jalankan:
```sql
CREATE DATABASE smartretailweb_db;
```
Lalu jalankan migration:
```powershell
node src/migrations/run.js
node src/seeders/run.js
```

### Error: mysql command not found

**Solusi:** 
- Pastikan MySQL terinstall
- Atau gunakan phpMyAdmin/MySQL Workbench
- Atau tambahkan MySQL ke PATH

---

## 💡 Rekomendasi

**Untuk Quick Check:** Gunakan MySQL Command Line  
**Untuk Visual/GUI:** Gunakan phpMyAdmin atau MySQL Workbench  
**Untuk Development:** Gunakan VS Code MySQL Extension

---

## 🔗 Info Database

**Database Name:** `smartretailweb_db`  
**Host:** `localhost`  
**Port:** `3306`  
**User:** `root` (atau user MySQL Anda)  
**Password:** (password MySQL Anda)

**Tables:**
- `users` - User accounts
- `api_keys` - API keys
- `products` - Product inventory
- `transactions` - Transaction headers
- `transaction_items` - Transaction line items

---

Pilih cara yang paling nyaman untuk Anda! 🎯
