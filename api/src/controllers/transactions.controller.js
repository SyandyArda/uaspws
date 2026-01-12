const { Transaction, TransactionItem, Product, Category, sequelize } = require('../models');
const { Op } = require('sequelize');
const ApiResponse = require('../utils/response');

const DEFAULT_PAGE_SIZE = parseInt(process.env.DEFAULT_PAGE_SIZE) || 20;
const MAX_PAGE_SIZE = parseInt(process.env.MAX_PAGE_SIZE) || 100;

/**
 * List all transactions
 */
const listTransactions = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = Math.min(parseInt(req.query.per_page) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
        const offset = (page - 1) * perPage;

        const { count, rows } = await Transaction.findAndCountAll({
            where: { user_id: req.user.user_id },
            include: [{
                model: TransactionItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['product_id', 'name', 'sku'],
                    include: [{
                        model: Category,
                        as: 'category',
                        attributes: ['category_id', 'name']
                    }]
                }]
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
 * Get single transaction
 */
const getTransaction = async (req, res, next) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findOne({
            where: {
                transaction_id: id,
                user_id: req.user.user_id
            },
            include: [{
                model: TransactionItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['product_id', 'name', 'sku'],
                    include: [{
                        model: Category,
                        as: 'category',
                        attributes: ['category_id', 'name']
                    }]
                }]
            }]
        });

        if (!transaction) {
            const error = ApiResponse.error('NOT_FOUND', 'Transaction not found', null, 404);
            return res.status(404).json(error);
        }

        const response = ApiResponse.success(transaction);
        res.json(response);
    } catch (error) {
        next(error);
    }
};

/**
 * Create new transaction
 */
const createTransaction = async (req, res, next) => {
    const t = await sequelize.transaction();

    try {
        const { items, payment_method, notes } = req.body;

        // Validate items
        if (!items || items.length === 0) {
            const error = ApiResponse.error('VALIDATION_ERROR', 'Transaction must have at least one item', null, 400);
            return res.status(400).json(error);
        }

        let total_price = 0;
        const transactionItems = [];

        // Process each item
        for (const item of items) {
            const product = await Product.findOne({
                where: {
                    product_id: item.product_id,
                    user_id: req.user.user_id
                },
                transaction: t
            });

            if (!product) {
                await t.rollback();
                const error = ApiResponse.error('NOT_FOUND', `Product ${item.product_id} not found`, null, 404);
                return res.status(404).json(error);
            }

            // Check stock
            if (product.stock < item.quantity) {
                await t.rollback();
                const error = ApiResponse.error(
                    'INSUFFICIENT_STOCK',
                    `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
                    { product_id: product.product_id, available: product.stock, requested: item.quantity },
                    400
                );
                return res.status(400).json(error);
            }

            // Calculate subtotal
            const subtotal = parseFloat(product.price) * item.quantity;
            total_price += subtotal;

            // Deduct stock
            await product.update({
                stock: product.stock - item.quantity,
                is_synced: false
            }, { transaction: t });

            transactionItems.push({
                product_id: product.product_id,
                product_name: product.name,
                quantity: item.quantity,
                unit_price: product.price,
                subtotal
            });
        }

        // Create transaction
        const transaction = await Transaction.create({
            user_id: req.user.user_id,
            total_price,
            payment_method,
            notes,
            status: 'completed',
            sync_status: 'pending'
        }, { transaction: t });

        // Create transaction items
        for (const item of transactionItems) {
            await TransactionItem.create({
                transaction_id: transaction.transaction_id,
                ...item
            }, { transaction: t });
        }

        await t.commit();

        // Fetch complete transaction with items
        const completeTransaction = await Transaction.findByPk(transaction.transaction_id, {
            include: [{
                model: TransactionItem,
                as: 'items'
            }]
        });

        const response = ApiResponse.success(completeTransaction);
        res.status(201).json(response);
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

/**
 * Get daily summary
 */
const getDailySummary = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const transactions = await Transaction.findAll({
            where: {
                user_id: req.user.user_id,
                created_at: {
                    [Op.gte]: today,
                    [Op.lt]: tomorrow
                },
                status: 'completed'
            }
        });

        const total_revenue = transactions.reduce((sum, t) => sum + parseFloat(t.total_price), 0);
        const total_transactions = transactions.length;

        const response = ApiResponse.success({
            date: today.toISOString().split('T')[0],
            total_revenue,
            total_transactions,
            average_transaction: total_transactions > 0 ? total_revenue / total_transactions : 0
        });

        res.json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listTransactions,
    getTransaction,
    createTransaction,
    getDailySummary
};
