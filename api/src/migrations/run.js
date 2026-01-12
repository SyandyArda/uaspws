const { sequelize } = require('../models');

/**
 * Database migration script
 * Run with: node src/migrations/run.js
 */
const runMigrations = async () => {
    try {
        console.log('🔄 Starting database migration...');

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection established.');

        // Sync all models (create tables)
        await sequelize.sync({ force: false, alter: true });
        console.log('✅ All models synchronized successfully.');

        // Create indexes
        console.log('✅ Database migration completed successfully.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

runMigrations();
