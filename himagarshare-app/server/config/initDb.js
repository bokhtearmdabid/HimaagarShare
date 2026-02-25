const { sequelize } = require('./database');
const db = require('../models');

const initDatabase = async () => {
  try {
    console.log('🔄 Starting database initialization...');

    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ All models synchronized successfully');

    console.log('\n📊 Database tables created:');
    console.log('  - users');
    console.log('  - listings');
    console.log('  - bookings');

    console.log('\n✨ Database initialization complete!');
    console.log('You can now start the server with: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

initDatabase();
