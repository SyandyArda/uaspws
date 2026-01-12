# Troubleshooting npm Install Issues

## Problem
npm install gagal dengan error: `ERR_INVALID_ARG_TYPE` - ini adalah bug npm di Windows.

## ✅ Solusi Pasti Berhasil

### Opsi 1: Update npm ke Versi Terbaru

```powershell
# Jalankan PowerShell sebagai Administrator
# Lalu jalankan:
npm install -g npm@latest --force
```

Setelah update, coba lagi:
```powershell
cd "d:\Materi kuliah\PWS\SmartRetail\api"
npm install
```

### Opsi 2: Install Dependencies Satu Per Satu (Paling Aman)

Jika npm masih bermasalah, install dependencies secara manual:

```powershell
cd "d:\Materi kuliah\PWS\SmartRetail\api"

# Install dependencies utama satu per satu
npm install express --save
npm install pg sequelize --save
npm install jsonwebtoken bcryptjs --save
npm install express-rate-limit --save
npm install swagger-ui-express swagger-jsdoc --save
npm install dotenv cors helmet morgan --save
npm install express-validator uuid --save
npm install nodemon --save-dev
```

### Opsi 3: Gunakan Node Version Manager (nvm-windows)

Download dan install nvm-windows, lalu:

```powershell
nvm install 20.10.0
nvm use 20.10.0
cd "d:\Materi kuliah\PWS\SmartRetail\api"
npm install
```

### Opsi 4: Jalankan Tanpa Install (Quick Test)

Jika Anda hanya ingin test API cepat, saya bisa buatkan versi sederhana tanpa dependencies berat.

## 🎯 Rekomendasi

**Coba Opsi 2** (install satu per satu) - ini paling reliable untuk Windows dengan npm bermasalah.

Atau jika Anda punya akses internet bagus, **coba Opsi 1** (update npm dulu).

---

## Alternative: Jalankan dengan Docker

Jika semua opsi di atas gagal, cara paling mudah adalah pakai Docker:

```powershell
# Install Docker Desktop for Windows
# Lalu jalankan:
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=smartretail_db postgres:14-alpine
```

Mau saya buatkan script installer otomatis atau Anda coba salah satu opsi di atas dulu?
