const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testApiKeyEndpoints() {
    try {
        console.log('🔐 Testing API Key Management Endpoints\n');

        // Step 1: Login
        console.log('1️⃣ Logging in...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            username: 'demo',
            password: 'password123'
        });

        const token = loginResponse.data.data.tokens.access_token;
        console.log('✅ Login successful!');
        console.log(`   Token: ${token.substring(0, 30)}...\n`);

        // Step 2: List existing API keys
        console.log('2️⃣ Listing existing API keys...');
        const listResponse = await axios.get(`${BASE_URL}/auth/api-keys`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`✅ Found ${listResponse.data.data.length} API key(s):`);
        listResponse.data.data.forEach((key, index) => {
            console.log(`   ${index + 1}. ${key.key_name}: ${key.api_key.substring(0, 20)}...`);
        });
        console.log('');

        // Step 3: Generate new API key
        console.log('3️⃣ Generating new API key...');
        const generateResponse = await axios.post(`${BASE_URL}/auth/api-keys`, {
            key_name: 'Test API Key',
            expires_in_days: 30
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const newApiKey = generateResponse.data.data;
        console.log('✅ New API key generated!');
        console.log(`   Key ID: ${newApiKey.key_id}`);
        console.log(`   Key Name: ${newApiKey.key_name}`);
        console.log(`   API Key: ${newApiKey.api_key}`);
        console.log(`   Expires: ${newApiKey.expires_at}\n`);

        // Step 4: Test using the new API key
        console.log('4️⃣ Testing new API key with /products endpoint...');
        const productsResponse = await axios.get(`${BASE_URL}/products`, {
            headers: { 'X-API-Key': newApiKey.api_key }
        });

        console.log(`✅ API key works! Found ${productsResponse.data.data.products.length} products\n`);

        console.log('🎉 All API key endpoints are working correctly!\n');
        console.log('📋 Summary:');
        console.log(`   ✅ POST /api/v1/auth/login - Working`);
        console.log(`   ✅ GET /api/v1/auth/api-keys - Working`);
        console.log(`   ✅ POST /api/v1/auth/api-keys - Working`);
        console.log(`   ✅ API Key authentication - Working`);

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        if (error.response?.status === 404) {
            console.error('\n⚠️  Endpoint not found! The route may not be properly registered.');
        }
    }
}

testApiKeyEndpoints();
