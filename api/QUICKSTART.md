# 🚀 Quick Start Guide - SmartRetail API

## ✅ Status Saat Ini

- ✅ Node.js v24.12.0 terinstall
- ✅ npm 11.6.2 terinstall  
- ✅ Dependencies terinstall (186 packages)
- ✅ Kode backend lengkap
- ⏳ **Butuh: PostgreSQL database**

---

## 📦 Langkah Selanjutnya: Install PostgreSQL

### Opsi 1: Install PostgreSQL (Recommended untuk Production)

1. **Download PostgreSQL**
   - Kunjungi: https://www.postgresql.org/download/windows/
   - Download PostgreSQL 14 atau 15
   - Jalankan installer

2. **Saat Install, Catat:**
   - Password untuk user `postgres` (misalnya: `postgres123`)
   - Port: `5432` (default)

3. **Setelah Install, Buat Database:**
   ```sql
   -- Buka pgAdmin atau psql
   CREATE DATABASE smartretail_db;
   ```

4. **Update file `.env`** di folder `api`:
   ```env
   DB_PASSWORD=postgres123  # ganti dengan password Anda
   ```

5. **Jalankan Migration:**
   ```powershell
   cd "d:\Materi kuliah\PWS\SmartRetail\api"
   node src/migrations/run.js
   ```

6. **Seed Demo Data:**
   ```powershell
   node src/seeders/run.js
   ```

7. **Start Server:**
   ```powershell
   npm run dev
   ```

### Opsi 2: Gunakan SQLite (Alternatif Cepat - Tidak Perlu Install PostgreSQL)

Jika Anda ingin test cepat tanpa install PostgreSQL, saya bisa modifikasi kode untuk pakai SQLite (database file lokal).

Mau saya buatkan versi SQLite?

---

## 🎯 Setelah PostgreSQL Jalan

Akses API di:
- **API Server**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api-docs
- **API Portal**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/v1/health

### Demo Credentials
- Username: `demo`
- Password: `password123`

---

## 📚 Dokumentasi Lengkap

Semua dokumentasi sudah siap:
1. ✅ **Architecture Document** - Diagram sistem lengkap
2. ✅ **Implementation Plan** - Rencana teknis
3. ✅ **Endpoint Reference** - Daftar 25+ API endpoints
4. ✅ **Walkthrough** - Dokumentasi implementasi
5. ✅ **SETUP.md** - Panduan instalasi detail
6. ✅ **README.md** - Project overview

---

## ❓ Pilih Salah Satu

**A. Install PostgreSQL** (ikuti Opsi 1 di atas)  
**B. Pakai SQLite** (saya modifikasi kode, lebih cepat untuk demo)  
**C. Lanjut ke dokumentasi** (skip database, fokus ke dokumen untuk tugas)

Mana yang Anda pilih?
