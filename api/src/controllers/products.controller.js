const { Product, Category } = require('../models');
const { Op } = require('sequelize');
const ApiResponse = require('../utils/response');

const DEFAULT_PAGE_SIZE = parseInt(process.env.DEFAULT_PAGE_SIZE) || 20;
const MAX_PAGE_SIZE = parseInt(process.env.MAX_PAGE_SIZE) || 100;

/**
 * List all products with pagination
 */
const listProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = Math.min(parseInt(req.query.per_page) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
        const offset = (page - 1) * perPage;

        const { count, rows } = await Product.findAndCountAll({
            where: { user_id: req.user.user_id },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['category_id', 'name', 'description']
            }],
            limit: perPage,
            offset,
            order: [['created_at', 'DESC']]
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

/**
 * Get single product
 */
const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({
            where: {
                product_id: id,
                user_id: req.user.user_id
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['category_id', 'name', 'description']
            }]
        });

        if (!product) {
            const error = ApiResponse.error('NOT_FOUND', 'Product not found', null, 404);
            return res.status(404).json(error);
        }

        const response = ApiResponse.success(product);
        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Create new product
 */
const createProduct = async (req, res, next) => {
    try {
        const { sku, name, description, price, stock, low_stock_threshold, image_url, category_id } = req.body;

        const product = await Product.create({
            user_id: req.user.user_id,
            sku,
            name,
            description,
            price,
            stock: stock || 0,
            low_stock_threshold: low_stock_threshold || 10,
            category_id: category_id || null,
            image_url
        });

        const response = ApiResponse.success(product);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Update product
 */
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { sku, name, description, price, stock, low_stock_threshold, image_url, category_id } = req.body;

        const product = await Product.findOne({
            where: {
                product_id: id,
                user_id: req.user.user_id
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['category_id', 'name', 'description']
            }]
        });

        if (!product) {
            const error = ApiResponse.error('NOT_FOUND', 'Product not found', null, 404);
            return res.status(404).json(error);
        }

        await product.update({
            ...(sku !== undefined && { sku }),
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description }),
            ...(price !== undefined && { price }),
            ...(stock !== undefined && { stock }),
            ...(low_stock_threshold !== undefined && { low_stock_threshold }),
            ...(category_id !== undefined && { category_id }),
            ...(image_url !== undefined && { image_url }),
            is_synced: false
        });

        const response = ApiResponse.success(product);
        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Update stock only
 */
const updateStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        const product = await Product.findOne({
            where: {
                product_id: id,
                user_id: req.user.user_id
            }
        });

        if (!product) {
            const error = ApiResponse.error('NOT_FOUND', 'Product not found', null, 404);
            return res.status(404).json(error);
        }

        await product.update({ stock, is_synced: false });

        const response = ApiResponse.success(product);
        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Soft delete product
 */
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.scope('withDeleted').findOne({
            where: {
                product_id: id,
                user_id: req.user.user_id
            }
        });

        if (!product) {
            const error = ApiResponse.error('NOT_FOUND', 'Product not found', null, 404);
            return res.status(404).json(error);
        }

        await product.update({ is_deleted: true, is_synced: false });

        const response = ApiResponse.success({ message: 'Product deleted successfully' });
        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Search products
 */
const searchProducts = async (req, res, next) => {
    try {
        const { q } = req.query;
        const page = parseInt(req.query.page) || 1;
        const perPage = Math.min(parseInt(req.query.per_page) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
        const offset = (page - 1) * perPage;

        const { count, rows } = await Product.findAndCountAll({
            where: {
                user_id: req.user.user_id,
                [Op.or]: [
                    { name: { [Op.iLike]: `%${q}%` } },
                    { sku: { [Op.iLike]: `%${q}%` } },
                    { description: { [Op.iLike]: `%${q}%` } }
                ]
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['category_id', 'name', 'description']
            }],
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

/**
 * Get low stock products
 */
const getLowStock = async (req, res, next) => {
    try {
        const products = await Product.scope('lowStock').findAll({
            where: { user_id: req.user.user_id },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['category_id', 'name', 'description']
            }],
            order: [['stock', 'ASC']]
        });

        const response = ApiResponse.success(products);
        res.json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    updateStock,
    deleteProduct,
    searchProducts,
    getLowStock
};
