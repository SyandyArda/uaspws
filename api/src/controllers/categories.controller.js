const { Category, Product, sequelize } = require('../models');
const ApiResponse = require('../utils/response');

const DEFAULT_PAGE_SIZE = parseInt(process.env.DEFAULT_PAGE_SIZE) || 20;
const MAX_PAGE_SIZE = parseInt(process.env.MAX_PAGE_SIZE) || 100;

/**
 * List all categories
 */
const listCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            where: {
                user_id: req.user.user_id,
                is_active: true
            },
            include: [{
                model: Category,
                as: 'subcategories',
                where: { is_active: true },
                required: false
            }],
            order: [['name', 'ASC']]
        });

        const response = ApiResponse.success(categories);
        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Get single category
 */
const getCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findOne({
            where: {
                category_id: id,
                user_id: req.user.user_id
            },
            include: [
                {
                    model: Category,
                    as: 'subcategories',
                    where: { is_active: true },
                    required: false
                },
                {
                    model: Category,
                    as: 'parent',
                    attributes: ['category_id', 'name']
                }
            ]
        });

        if (!category) {
            const error = ApiResponse.error('NOT_FOUND', 'Category not found', null, 404);
            return res.status(404).json(error);
        }

        // Get product count
        const productCount = await Product.count({
            where: {
                category_id: id,
                is_deleted: false
            }
        });

        const categoryData = category.toJSON();
        categoryData.product_count = productCount;

        const response = ApiResponse.success(categoryData);
        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Create new category
 */
const createCategory = async (req, res, next) => {
    try {
        const { name, description, parent_id, image_url } = req.body;

        // Check if parent category exists and belongs to user
        if (parent_id) {
            const parentCategory = await Category.findOne({
                where: {
                    category_id: parent_id,
                    user_id: req.user.user_id
                }
            });

            if (!parentCategory) {
                const error = ApiResponse.error(
                    'INVALID_PARENT',
                    'Parent category not found or does not belong to you',
                    null,
                    400
                );
                return res.status(400).json(error);
            }
        }

        const category = await Category.create({
            user_id: req.user.user_id,
            name,
            description,
            parent_id,
            image_url
        });

        const response = ApiResponse.success(category);
        res.status(201).json(response);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const err = ApiResponse.error(
                'DUPLICATE',
                'Category name already exists',
                null,
                400
            );
            return res.status(400).json(err);
        }
        next(error);
    }
};

/**
 * Update category
 */
const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, parent_id, image_url, is_active } = req.body;

        const category = await Category.findOne({
            where: {
                category_id: id,
                user_id: req.user.user_id
            }
        });

        if (!category) {
            const error = ApiResponse.error('NOT_FOUND', 'Category not found', null, 404);
            return res.status(404).json(error);
        }

        // Check if trying to set itself as parent
        if (parent_id && parseInt(parent_id) === parseInt(id)) {
            const error = ApiResponse.error(
                'INVALID_PARENT',
                'Category cannot be its own parent',
                null,
                400
            );
            return res.status(400).json(error);
        }

        // Check if parent category exists and belongs to user
        if (parent_id) {
            const parentCategory = await Category.findOne({
                where: {
                    category_id: parent_id,
                    user_id: req.user.user_id
                }
            });

            if (!parentCategory) {
                const error = ApiResponse.error(
                    'INVALID_PARENT',
                    'Parent category not found or does not belong to you',
                    null,
                    400
                );
                return res.status(400).json(error);
            }
        }

        await category.update({
            name: name || category.name,
            description: description !== undefined ? description : category.description,
            parent_id: parent_id !== undefined ? parent_id : category.parent_id,
            image_url: image_url !== undefined ? image_url : category.image_url,
            is_active: is_active !== undefined ? is_active : category.is_active
        });

        const response = ApiResponse.success(category);
        res.json(response);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const err = ApiResponse.error(
                'DUPLICATE',
                'Category name already exists',
                null,
                400
            );
            return res.status(400).json(err);
        }
        next(error);
    }
};

/**
 * Delete category
 */
const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await Category.findOne({
            where: {
                category_id: id,
                user_id: req.user.user_id
            }
        });

        if (!category) {
            const error = ApiResponse.error('NOT_FOUND', 'Category not found', null, 404);
            return res.status(404).json(error);
        }

        // Check if category has products
        const productCount = await Product.count({
            where: {
                category_id: id,
                is_deleted: false
            }
        });

        if (productCount > 0) {
            const error = ApiResponse.error(
                'CATEGORY_IN_USE',
                `Cannot delete category with ${productCount} products. Remove products first or reassign them to another category.`,
                { product_count: productCount },
                400
            );
            return res.status(400).json(error);
        }

        // Check if category has subcategories
        const subcategoryCount = await Category.count({
            where: {
                parent_id: id
            }
        });

        if (subcategoryCount > 0) {
            const error = ApiResponse.error(
                'CATEGORY_HAS_SUBCATEGORIES',
                `Cannot delete category with ${subcategoryCount} subcategories. Delete subcategories first.`,
                { subcategory_count: subcategoryCount },
                400
            );
            return res.status(400).json(error);
        }

        await category.destroy();

        const response = ApiResponse.success({
            message: 'Category deleted successfully',
            category_id: parseInt(id)
        });
        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Get category products
 */
const getCategoryProducts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page) || 1;
        const perPage = Math.min(parseInt(req.query.per_page) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
        const offset = (page - 1) * perPage;

        // Check if category exists and belongs to user
        const category = await Category.findOne({
            where: {
                category_id: id,
                user_id: req.user.user_id
            }
        });

        if (!category) {
            const error = ApiResponse.error('NOT_FOUND', 'Category not found', null, 404);
            return res.status(404).json(error);
        }

        const { count, rows } = await Product.findAndCountAll({
            where: {
                category_id: id,
                user_id: req.user.user_id,
                is_deleted: false
            },
            limit: perPage,
            offset,
            order: [['name', 'ASC']]
        });

        const response = ApiResponse.paginated(rows, {
            page,
            perPage,
            total: count
        });

        res.json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryProducts
};
