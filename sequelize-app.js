const { Sequelize, DataTypes, Model } = require('sequelize');

// 1. Setup koneksi
const sequelize = new Sequelize('mahasiswa', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// 2. Definisikan Model Mahasiswa
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
}, {
  sequelize,
  modelName: 'Mahasiswa'
});

// 3. Definisikan Model MataKuliah
class MataKuliah extends Model {}
MataKuliah.init({
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'MataKuliah'
});

// 4. Relasi
Mahasiswa.hasMany(MataKuliah, { foreignKey: 'mahasiswaId' });
MataKuliah.belongsTo(Mahasiswa, { foreignKey: 'mahasiswaId' });

// 5. CRUD Operations
async function main() {
  try {
    await sequelize.authenticate();
    console.log('✅ Koneksi berhasil');

    await sequelize.sync({ force: true });
    console.log('✅ Model disinkronisasi');

    // CREATE
    const wisnu = await Mahasiswa.create({
      nama: 'Wisnu',
      jurusan: 'Informatika'
    });

    await MataKuliah.bulkCreate([
      { nama: 'Basis Data', mahasiswaId: wisnu.id },
      { nama: 'Algoritma', mahasiswaId: wisnu.id },
      { nama: 'Jaringan Komputer', mahasiswaId: wisnu.id },
      { nama: 'Sistem Operasi', mahasiswaId: andi.id }
    ]);

    const andi = await Mahasiswa.create({
      nama: 'Andi',
      jurusan: 'Sistem Informasi'
    });

    // READ
    const semuaMahasiswa = await Mahasiswa.findAll({
      include: MataKuliah
    });
    console.log('\n Semua Mahasiswa:\n', JSON.stringify(semuaMahasiswa, null, 2));

    // UPDATE - Ganti nama mata kuliah
    await MataKuliah.update(
      { nama: 'Pemrograman Web' },
      { where: { nama: 'Basis Data' } }
    );

    // UPDATE - Ganti jurusan Andi
    await Mahasiswa.update(
      { jurusan: 'Teknik Informatika' },
      { where: { nama: 'Andi' } }
    );

    // DELETE - Hapus satu mata kuliah
    const algoritma = await MataKuliah.findOne({ where: { nama: 'Algoritma' } });
    if (algoritma) {
      await algoritma.destroy();
      console.log(` Mata kuliah '${algoritma.nama}' dihapus`);
    }

    // DELETE - Hapus Mahasiswa Andi
    const andiToDelete = await Mahasiswa.findOne({ where: { nama: 'Andi' } });
    if (andiToDelete) {
      await andiToDelete.destroy();
      console.log(' Mahasiswa Andi dihapus');
    }

    // READ kembali setelah perubahan
    const dataTerbaru = await Mahasiswa.findAll({ include: MataKuliah });
    console.log('\n Data terbaru:\n', JSON.stringify(dataTerbaru, null, 2));

  } catch (err) {
    console.error(' Gagal:', err);
  } finally {
    await sequelize.close();
  }
}

main();
