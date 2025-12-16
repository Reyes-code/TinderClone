// test.js
const { MongoClient } = require('mongodb');

// REEMPLAZA 'tuPassword' con tu contraseña real
const uri = "mongodb+srv://Reyes-coder:admin123@cluster0.6w63ngy.mongodb.net/tinder_db?retryWrites=true&w=majority";

async function testConnection() {
  const client = new MongoClient(uri);
  
  try {
    console.log('🔄 Conectando a MongoDB Atlas...');
    await client.connect();
    
    console.log('✅ ¡Conectado exitosamente!');
    
    // Listar bases de datos
    const databasesList = await client.db().admin().listDatabases();
    console.log('📁 Bases de datos disponibles:');
    databasesList.databases.forEach(db => console.log(`   - ${db.name}`));
    
    // Verificar/crear la base de datos tinder_db
    const db = client.db('tinder_db');
    const collections = await db.listCollections().toArray();
    
    console.log('📄 Colecciones en tinder_db:');
    if (collections.length === 0) {
      console.log('   - No hay colecciones (la BD está vacía)');
    } else {
      collections.forEach(col => console.log(`   - ${col.name}`));
    }
    
    // Crear colección users si no existe
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`👤 Usuarios en colección: ${userCount}`);
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verifica tu contraseña en MongoDB Atlas');
    console.log('2. Añade tu IP a Network Access en MongoDB Atlas');
    console.log('3. Asegúrate que el cluster esté activo');
  } finally {
    await client.close();
    console.log('\n🔗 Conexión cerrada');
  }
}

testConnection();