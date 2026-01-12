const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, Product, ApiKey } = require('../models');

/**
 * Database seeder script
 * Run with: node src/seeders/run.js
 */
const runSeeders = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Create demo user
        const password_hash = await bcrypt.hash('password123', 12);

        const user = await User.create({
            email: 'demo@smartretail.com',
            username: 'demo',
            password_hash,
            store_name: 'Demo Store',
            role: 'admin'
        });

        console.log('✅ Demo user created:', user.username);

        // Generate API key for demo user
        const prefix = process.env.API_KEY_PREFIX || 'sr_live_';
        const randomKey = crypto.randomBytes(32).toString('hex');
        const api_key = prefix + randomKey;

        const apiKey = await ApiKey.create({
            user_id: user.user_id,
            api_key,
            key_name: 'Demo API Key'
        });

        console.log('✅ Demo API key created:', apiKey.api_key);

        // Create sample products
        const products = [
            {
                user_id: user.user_id,
                sku: 'LAPTOP-001',
                name: 'Laptop Dell XPS 13',
                description: '13-inch ultrabook with Intel i7',
                price: 15000000,
                stock: 10,
                low_stock_threshold: 3
            },
            {
                user_id: user.user_id,
                sku: 'MOUSE-001',
                name: 'Logitech MX Master 3',
                description: 'Wireless mouse for productivity',
                price: 1500000,
                stock: 25,
                low_stock_threshold: 5
            },
            {
                user_id: user.user_id,
                sku: 'KEYBOARD-001',
                name: 'Keychron K2 Mechanical Keyboard',
                description: 'Wireless mechanical keyboard',
                price: 1200000,
                stock: 15,
                low_stock_threshold: 5
            },
            {
                user_id: user.user_id,
                sku: 'MONITOR-001',
                name: 'LG 27" 4K Monitor',
                description: '27-inch 4K UHD monitor',
                price: 5000000,
                stock: 8,
                low_stock_threshold: 2
            },
            {
                user_id: user.user_id,
                sku: 'HEADSET-001',
                name: 'Sony WH-1000XM4',
                description: 'Noise-canceling wireless headphones',
                price: 4500000,
                stock: 12,
                low_stock_threshold: 3
            }
        ];

        await Product.bulkCreate(products);
        console.log(`✅ ${products.length} sample products created.`);

        console.log('\n📝 Demo Credentials:');
        console.log('   Email: demo@smartretail.com');
        console.log('   Username: demo');
        console.log('   Password: password123');
        console.log(`   API Key: ${apiKey.api_key}`);
        console.log('\n✅ Database seeding completed successfully.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

runSeeders();
