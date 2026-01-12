require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { freeTierLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const transactionsRoutes = require('./routes/transactions.routes');
const categoriesRoutes = require('./routes/categories.routes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// API Documentation (before rate limiting)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'SmartRetail API Documentation'
}));

// Serve static files for API portal
app.use(express.static('portal'));

// Serve user dashboard
app.use('/user', express.static('portal/user'));

// Health check (before rate limiting)
app.get('/api/v1/health', (req, res) => {
    res.json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        }
    });
});

// API version info (before rate limiting)
app.get('/api/v1/version', (req, res) => {
    res.json({
        success: true,
        data: {
            version: '1.0.0',
            api_version: 'v1',
            name: 'SmartRetail Open API'
        }
    });
});

// Rate limiting (only for API routes)
app.use('/api/v1', freeTierLimiter);

// Mount API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/transactions', transactionsRoutes);
app.use('/api/v1/categories', categoriesRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
