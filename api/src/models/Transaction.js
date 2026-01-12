const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
        transaction_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'user_id'
            },
            onDelete: 'CASCADE'
        },
        total_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        payment_method: {
            type: DataTypes.STRING(50),
            allowNull: true,
            validate: {
                isIn: [['cash', 'card', 'e-wallet', 'bank_transfer', 'other']]
            }
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: 'completed',
            validate: {
                isIn: [['pending', 'completed', 'cancelled', 'refunded']]
            }
        },
        sync_status: {
            type: DataTypes.STRING(50),
            defaultValue: 'synced',
            validate: {
                isIn: [['pending', 'synced', 'failed']]
            }
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'transactions',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['created_at']
            },
            {
                fields: ['status']
            },
            {
                fields: ['sync_status']
            }
        ]
    });

    return Transaction;
};
