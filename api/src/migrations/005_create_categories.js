module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create categories table
        await queryInterface.createTable('categories', {
            category_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'user_id'
                },
                onDelete: 'CASCADE'
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            parent_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'categories',
                    key: 'category_id'
                },
                onDelete: 'SET NULL'
            },
            image_url: {
                type: Sequelize.STRING(500),
                allowNull: true
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // Add indexes
        await queryInterface.addIndex('categories', ['user_id'], {
            name: 'idx_categories_user'
        });

        await queryInterface.addIndex('categories', ['parent_id'], {
            name: 'idx_categories_parent'
        });

        await queryInterface.addIndex('categories', ['user_id', 'name'], {
            unique: true,
            name: 'unique_user_category_name'
        });

        // Add category_id to products table
        await queryInterface.addColumn('products', 'category_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'category_id'
            },
            onDelete: 'SET NULL',
            after: 'user_id'
        });

        await queryInterface.addIndex('products', ['category_id'], {
            name: 'idx_products_category'
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove category_id from products
        await queryInterface.removeIndex('products', 'idx_products_category');
        await queryInterface.removeColumn('products', 'category_id');

        // Drop categories table
        await queryInterface.dropTable('categories');
    }
};
