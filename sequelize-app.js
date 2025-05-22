// sequelize-app.js
const { Sequelize, DataTypes } = require('sequelize');

// 1. Setup koneksi ke database MySQL
const sequelize = new Sequelize('mahasiswa', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});


// 2. Definisikan model Mahasiswa
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

// 3. Definisikan model MataKuliah dan relasi
const MataKuliah = sequelize.define('MataKuliah', {
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Mahasiswa.hasMany(MataKuliah);
MataKuliah.belongsTo(Mahasiswa);

// 4. Sinkronisasi dan contoh data
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi berhasil');

    await sequelize.sync({ force: true });
    console.log('✅ Model tersinkronisasi');

    // Tambah data
    const emyu = await Mahasiswa.create({ nama: 'Mario', jurusan: 'Informatika' });
    await emyu.createMataKuliah({ nama: 'Basis Data' });
    await emyu.createMataKuliah({ nama: 'Algoritma' });

    // Ambil data dengan relasi (eager loading)
    const data = await Mahasiswa.findAll({ include: MataKuliah });
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
}

start();
