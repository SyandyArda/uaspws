const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: dbConfig.logging,
        pool: dbConfig.pool,
        dialectOptions: dbConfig.dialectOptions
    }
);

// Import models
const User = require('./User')(sequelize);
const ApiKey = require('./ApiKey')(sequelize);
const Product = require('./Product')(sequelize);
const Transaction = require('./Transaction')(sequelize);
const TransactionItem = require('./TransactionItem')(sequelize);
const Category = require('./Category')(sequelize);

// Define associations
User.hasMany(ApiKey, {
    foreignKey: 'user_id',
    as: 'apiKeys',
    onDelete: 'CASCADE'
});
ApiKey.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasMany(Product, {
    foreignKey: 'user_id',
    as: 'products',
    onDelete: 'CASCADE'
});
Product.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'owner'
});

User.hasMany(Transaction, {
    foreignKey: 'user_id',
    as: 'transactions',
    onDelete: 'CASCADE'
});
Transaction.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

Transaction.hasMany(TransactionItem, {
    foreignKey: 'transaction_id',
    as: 'items',
    onDelete: 'CASCADE'
});
TransactionItem.belongsTo(Transaction, {
    foreignKey: 'transaction_id',
    as: 'transaction'
});

Product.hasMany(TransactionItem, {
    foreignKey: 'product_id',
    as: 'transactionItems'
});
TransactionItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});

// Category associations
User.hasMany(Category, {
    foreignKey: 'user_id',
    as: 'categories',
    onDelete: 'CASCADE'
});
Category.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'owner'
});

Category.hasMany(Product, {
    foreignKey: 'category_id',
    as: 'products'
});
Product.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
});

// Self-referencing for subcategories
Category.hasMany(Category, {
    foreignKey: 'parent_id',
    as: 'subcategories'
});
Category.belongsTo(Category, {
    foreignKey: 'parent_id',
    as: 'parent'
});

// Export models and sequelize instance
module.exports = {
    sequelize,
    Sequelize,
    User,
    ApiKey,
    Product,
    Transaction,
    TransactionItem,
    Category
};
