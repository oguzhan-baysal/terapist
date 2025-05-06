const { MongoClient } = require('mongodb');

async function migrateUsers() {
  try {
    console.log('Kullanıcı verilerini taşıma işlemi başlatılıyor...');
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const client = await MongoClient.connect(uri);
    const testDb = client.db('test');
    const terapistDb = client.db('terapist');

    // Test veritabanındaki kullanıcıları al
    const users = await testDb.collection('users').find({}).toArray();
    console.log(`${users.length} kullanıcı bulundu.`);

    if (users.length > 0) {
      // Terapist veritabanına kullanıcıları taşı
      const result = await terapistDb.collection('users').insertMany(users);
      console.log(`${result.insertedCount} kullanıcı başarıyla taşındı.`);

      // Eski koleksiyonu temizle
      await testDb.collection('users').drop();
      console.log('Eski koleksiyon temizlendi.');
    }

    console.log('Taşıma işlemi başarıyla tamamlandı.');
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('Taşıma işlemi sırasında hata oluştu:', error);
    process.exit(1);
  }
}

migrateUsers(); 