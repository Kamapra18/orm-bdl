Berikut ini adalah **file lengkap `README.md`** yang bisa langsung kamu salin untuk tugas BDL-mu:

---

````markdown
# Tugas BDL – Review ORM: Sequelize (Node.js + MySQL)

**Nama:** I Kadek Mario Prayoga  
**NIM:** 2301020018  

---

## 1. Pendahuluan

Object Relational Mapping (ORM) adalah pendekatan pemrograman yang menghubungkan antara objek dalam kode program dengan tabel dalam database relasional. Sequelize merupakan ORM untuk Node.js yang mendukung berbagai database seperti MySQL, PostgreSQL, SQLite, dan MSSQL. Dengan Sequelize, kita dapat melakukan operasi database seperti membuat, membaca, memperbarui, dan menghapus data tanpa menulis query SQL mentah.

---

## 2. Cara Instalasi

### a. Inisialisasi Proyek

```bash
mkdir Tugas-BDL
cd Tugas-BDL
npm init -y
````

### b. Instalasi Sequelize dan MySQL2

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
const { DataTypes, Model } = require('sequelize');

class Mahasiswa extends Model {}
Mahasiswa.init({
  nama: DataTypes.STRING,
  jurusan: DataTypes.STRING
}, { sequelize, modelName: 'Mahasiswa' });

class MataKuliah extends Model {}
MataKuliah.init({
  nama: DataTypes.STRING
}, { sequelize, modelName: 'MataKuliah' });

Mahasiswa.hasMany(MataKuliah, { foreignKey: 'mahasiswaId' });
MataKuliah.belongsTo(Mahasiswa, { foreignKey: 'mahasiswaId' });
```

### c. Operasi CRUD

```js
// CREATE
const mhs = await Mahasiswa.create({ nama: 'Wisnu', jurusan: 'Informatika' });
await MataKuliah.bulkCreate([
  { nama: 'Basis Data', mahasiswaId: mhs.id },
  { nama: 'Algoritma', mahasiswaId: mhs.id }
]);

// READ
const data = await Mahasiswa.findAll({ include: MataKuliah });

// UPDATE
await MataKuliah.update(
  { nama: 'Pemrograman Web' },
  { where: { nama: 'Basis Data' } }
);

// DELETE
const mk = await MataKuliah.findOne({ where: { nama: 'Algoritma' } });
if (mk) await mk.destroy();
```

---

## 4. Fitur-Fitur Sequelize

* **Relasi Antar Tabel**: One-to-One, One-to-Many, Many-to-Many
* **Model Berbasis Kelas (Class-based)**
* **Validasi dan Constraints**
* **Eager & Lazy Loading**
* **Sinkronisasi Skema Otomatis**
* **Lifecycle Hooks**

---

## 5. Contoh Program (`sequelize-app.js`)

```js
const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize = new Sequelize('mahasiswa', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

class Mahasiswa extends Model {}
Mahasiswa.init({
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jurusan: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { sequelize, modelName: 'Mahasiswa' });

class MataKuliah extends Model {}
MataKuliah.init({
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, { sequelize, modelName: 'MataKuliah' });

Mahasiswa.hasMany(MataKuliah, { foreignKey: 'mahasiswaId' });
MataKuliah.belongsTo(Mahasiswa, { foreignKey: 'mahasiswaId' });

async function main() {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi berhasil');

    await sequelize.sync({ force: true });
    console.log('✅ Model disinkronisasi');

    const wisnu = await Mahasiswa.create({ nama: 'Wisnu', jurusan: 'Informatika' });

    await MataKuliah.bulkCreate([
      { nama: 'Basis Data', mahasiswaId: wisnu.id },
      { nama: 'Algoritma', mahasiswaId: wisnu.id },
      { nama: 'Jaringan Komputer', mahasiswaId: wisnu.id }
    ]);

    const andi = await Mahasiswa.create({ nama: 'Andi', jurusan: 'Sistem Informasi' });

    await MataKuliah.update(
      { nama: 'Pemrograman Web' },
      { where: { nama: 'Basis Data' } }
    );

    await Mahasiswa.update(
      { jurusan: 'Teknik Informatika' },
      { where: { nama: 'Andi' } }
    );

    const algoritma = await MataKuliah.findOne({ where: { nama: 'Algoritma' } });
    if (algoritma) await algoritma.destroy();

    const andiData = await Mahasiswa.findOne({ where: { nama: 'Andi' } });
    if (andiData) await andiData.destroy();

    const result = await Mahasiswa.findAll({ include: MataKuliah });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

main();
```

---

## 6. Cara Menjalankan

```bash
node sequelize-app.js
```

> Pastikan MySQL aktif dan database `mahasiswa` sudah tersedia.

---

## 7. Output Program (Contoh)

```json
[
  {
    "id": 1,
    "nama": "Wisnu",
    "jurusan": "Informatika",
    "MataKuliahs": [
      { "id": 1, "nama": "Pemrograman Web", "mahasiswaId": 1 },
      { "id": 3, "nama": "Jaringan Komputer", "mahasiswaId": 1 }
    ]
  }
]
```

---

## 8. Kesimpulan

Sequelize mempermudah pengembangan aplikasi backend dengan fitur ORM modern. Relasi antar tabel, sinkronisasi model, validasi, dan dukungan eager/lazy loading menjadikan Sequelize sangat powerful dan efisien untuk digunakan dalam proyek Node.js yang berbasis database relasional.

---