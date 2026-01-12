const { sequelize, Product, Transaction, TransactionItem, User } = require('./src/models');

async function testStockUpdate() {
    let t;
    try {
        console.log('Authenticating...');
        await sequelize.authenticate();
        console.log('Database connected.');

        // 1. Get a user (or create one)
        let user = await User.findOne({ where: { username: 'arsyan' } });
        if (!user) {
            console.log('User not found, using first user');
            user = await User.findOne();
        }
        console.log(`Using user: ${user.username} (ID: ${user.user_id})`);

        // 2. Create a test product
        const initialStock = 100;
        const buyQuantity = 5;

        const product = await Product.create({
            user_id: user.user_id,
            sku: `TEST-${Date.now()}`,
            name: 'Stock Test Product',
            price: 50000,
            stock: initialStock,
            description: 'Test product for stock update'
        });
        console.log(`Created product: ${product.name} (ID: ${product.product_id}) with stock: ${product.stock}`);

        // 3. Mock Request Body for Transaction
        const reqBody = {
            items: [
                {
                    product_id: product.product_id,
                    quantity: buyQuantity,
                    unit_price: 50000
                }
            ],
            payment_method: 'cash',
            notes: 'Test transaction'
        };

        // 4. Simulate logic from transactions.controller.js
        console.log('Starting transaction simulation...');
        t = await sequelize.transaction();

        try {
            // Retrieve product inside transaction
            const p = await Product.findOne({
                where: { product_id: product.product_id, user_id: user.user_id },
                transaction: t
            });

            if (!p) throw new Error('Product not found in transaction');

            // Update stock
            console.log(`Current stock in DB: ${p.stock}. reducing by ${buyQuantity}`);

            // Method 1: The one currently in controller
            /*
            await p.update({
               stock: p.stock - buyQuantity,
               is_synced: false
            }, { transaction: t });
            */

            // Let's verify exactly what the controller does
            // const subtotal = parseFloat(p.price) * buyQuantity;
            // await p.update({ stock: p.stock - buyQuantity, is_synced: false }, { transaction: t });

            // Using the exact logic from controller
            const updated = await p.update({
                stock: p.stock - buyQuantity,
                is_synced: false
            }, { transaction: t });

            console.log('Update call finished.');

            // Create transaction record
            const transaction = await Transaction.create({
                user_id: user.user_id,
                total_price: 50000 * buyQuantity,
                payment_method: 'cash',
                status: 'completed'
            }, { transaction: t });

            await TransactionItem.create({
                transaction_id: transaction.transaction_id,
                product_id: p.product_id,
                product_name: p.name,
                quantity: buyQuantity,
                unit_price: p.price,
                subtotal: 50000 * buyQuantity
            }, { transaction: t });

            await t.commit();
            console.log('Transaction committed.');

        } catch (err) {
            await t.rollback();
            console.error('Transaction failed:', err);
            throw err;
        }

        // 5. Verify Stock
        const reloadedProduct = await Product.findByPk(product.product_id);
        console.log(`Final stock for product ID ${product.product_id}: ${reloadedProduct.stock}`);

        if (reloadedProduct.stock === initialStock - buyQuantity) {
            console.log('SUCCESS: Stock updated correctly.');
        } else {
            console.log('FAIL: Stock did NOT update correctly.');
        }

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await sequelize.close();
    }
}

testStockUpdate();
