const { ApiKey } = require('./src/models');

async function getApiKeys() {
    try {
        const apiKeys = await ApiKey.findAll({
            limit: 10,
            order: [['created_at', 'DESC']]
        });

        console.log('\n📋 API Keys in Database:\n');
        apiKeys.forEach((key, index) => {
            console.log(`${index + 1}. Key Name: ${key.key_name}`);
            console.log(`   API Key: ${key.api_key}`);
            console.log(`   User ID: ${key.user_id}`);
            console.log(`   Active: ${key.is_active ? 'Yes' : 'No'}`);
            console.log(`   Created: ${key.created_at}`);
            console.log('');
        });

        if (apiKeys.length === 0) {
            console.log('❌ No API keys found in database.');
            console.log('💡 Run seeder to create demo data');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

getApiKeys();
