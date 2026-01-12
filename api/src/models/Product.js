const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        product_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'category_id'
            },
            onDelete: 'SET NULL'
        },
        sku: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        low_stock_threshold: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        image_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        is_synced: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'products',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['sku']
            },
            {
                unique: true,
                fields: ['user_id', 'sku'],
                name: 'unique_user_sku'
            },
            {
                fields: ['is_deleted']
            }
        ],
        defaultScope: {
            where: {
                is_deleted: false
            }
        },
        scopes: {
            withDeleted: {
                where: {}
            },
            lowStock: {
                where: sequelize.literal('"stock" <= "low_stock_threshold"')
            }
        }
    });

    return Product;
};
