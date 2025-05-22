# Tugas BDL – Review ORM: Sequelize (Node.js + MySQL)

**Nama:** I Kadek Mario Prayoga  
**NIM:** 2301020018  

---
## 1. Pendahuluan
Object Relational Mapping (ORM) adalah pendekatan pemrograman yang menghubungkan antara objek dalam kode program dengan tabel dalam database relasional. Sequelize merupakan ORM untuk Node.js yang mendukung berbagai database seperti MySQL, PostgreSQL, SQLite, dan MSSQL.

---

## 2. Cara Instalasi

### a. Inisialisasi Proyek
```bash
mkdir "Tugas-BDL"
cd "Tugas-BDL"
npm init -y
````

### b. Instalasi Sequelize dan MySQL driver

```bash
npm install sequelize mysql2
```

---

## 3. Cara Penggunaan

### a. Setup Koneksi Database

```js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mahasiswa', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});
```

### b. Definisi Model

```js
const Mahasiswa = sequelize.define('Mahasiswa', {
  nama: Sequelize.STRING,
  jurusan: Sequelize.STRING
});

const MataKuliah = sequelize.define('MataKuliah', {
  nama: Sequelize.STRING
});

Mahasiswa.hasMany(MataKuliah);
MataKuliah.belongsTo(Mahasiswa);
```

### c. Operasi CRUD dan Relasi

```js
await sequelize.sync({ force: true });
const mario = await Mahasiswa.create({ nama: 'Mario', jurusan: 'Informatika' });
await mario.createMataKuliah({ nama: 'Basis Data' });
await mario.createMataKuliah({ nama: 'Algoritma' });

const data = await Mahasiswa.findAll({ include: MataKuliah });
console.log(JSON.stringify(data, null, 2));
```

---

## 4. Fitur-Fitur Sequelize

* **Relasi Antar Tabel**: One-to-One, One-to-Many, Many-to-Many
* **Eager Loading dan Lazy Loading**
* **Sinkronisasi Skema Otomatis**
* **Validasi dan Constraints**
* **Hooks & Lifecycle Callbacks**

---

## 5. Contoh Program (`sequelize-app.js`)

```js
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('mahasiswa', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

const Mahasiswa = sequelize.define('Mahasiswa', {
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jurusan: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

const MataKuliah = sequelize.define('MataKuliah', {
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Mahasiswa.hasMany(MataKuliah);
MataKuliah.belongsTo(Mahasiswa);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi berhasil');

    await sequelize.sync({ force: true });
    console.log('✅ Model tersinkronisasi');

    const mario = await Mahasiswa.create({ nama: 'Mario', jurusan: 'Informatika' });
    await mario.createMataKuliah({ nama: 'Basis Data' });
    await mario.createMataKuliah({ nama: 'Algoritma' });

    const data = await Mahasiswa.findAll({ include: MataKuliah });
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

start();
```

---

## 6. Cara Menjalankan

```bash
node sequelize-app.js
```

Pastikan MySQL aktif dan terdapat database `mahasiswa`.

---

## 7. Output Program

```json
[
  {
    "nama": "Mario",
    "jurusan": "Informatika",
    "MataKuliahs": [
      { "nama": "Basis Data" },
      { "nama": "Algoritma" }
    ]
  }
]
```

---

## 8. Kesimpulan

Sequelize mempermudah pengembangan aplikasi backend dengan fitur ORM modern. Relasi antar tabel, sinkronisasi model, serta dukungan untuk lazy & eager loading menjadikannya powerful untuk berbagai jenis proyek Node.js.

---

