const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ApiKey = sequelize.define('ApiKey', {
        key_id: {
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
        api_key: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        key_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        permissions: {
            type: DataTypes.JSON,
            defaultValue: {}
        },
        last_used_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'api_keys',
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['api_key']
            },
            {
                fields: ['user_id']
            }
        ]
    });

    return ApiKey;
};
