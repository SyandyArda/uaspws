const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TransactionItem = sequelize.define('TransactionItem', {
        item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        transaction_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'transactions',
                key: 'transaction_id'
            },
            onDelete: 'CASCADE'
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'products',
                key: 'product_id'
            },
            onDelete: 'SET NULL'
        },
        product_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        unit_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        subtotal: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: 'transaction_items',
        timestamps: false,
        underscored: true,
        indexes: [
            {
                fields: ['transaction_id']
            },
            {
                fields: ['product_id']
            }
        ]
    });

    return TransactionItem;
};
